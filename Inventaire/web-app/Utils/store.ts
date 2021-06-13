import { signIn, signOut } from 'next-auth/client';
import { useMemo } from 'react';
import { createStore, Store } from 'redux';
import { PAGES } from './enums';

export enum ACTION_TYPE {
  CHANGE_THEME = 'change theme',
  CHANGE_WAREHOUSE = 'change warehouse',
  LOGIN = 'login',
  LOGOUT = 'logout',
  SNACKBAR = 'snackbar',
  SNACKBAR_RESET = 'snackbar reset',
}

export enum SEVERITY_TYPE {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

let store: Store<any>;

export interface IStoreState {
  darkTheme: boolean;
  snackbar: {
    snackbarOpen?: boolean;
    snackbarMessage?: string;
    snackbarSeverity?: SEVERITY_TYPE;
    snackbarDuration?: number;
  };
  selectedWarehouse: number;
}

const initialState: IStoreState = {
  darkTheme: true,
  snackbar: {},
  selectedWarehouse: null,
};

const reducer = (state = initialState, action: any): IStoreState => {
  switch (action.type) {
    case ACTION_TYPE.CHANGE_THEME:
      localStorage.setItem('darkTheme', JSON.stringify(action.darkTheme));
      return {
        ...state,
        darkTheme: action.darkTheme,
      };
    case ACTION_TYPE.CHANGE_WAREHOUSE:
      return {
        ...state,
        selectedWarehouse: action.warehouseId,
      };
    case ACTION_TYPE.SNACKBAR:
      return {
        ...state,
        snackbar: {
          snackbarOpen: true,
          snackbarMessage: action.message,
          snackbarSeverity: action.severity,
          snackbarDuration: action.duration,
        },
      };
    case ACTION_TYPE.SNACKBAR_RESET:
      return {
        ...state,
        snackbar: { snackbarOpen: false },
      };
    case ACTION_TYPE.LOGIN:
      if (action.rememberMe) {
        // TODO: do something? (extend session time => how)
        console.log('remember me');
      }
      signIn('inventory-login', {
        email: action.user.email,
        password: action.user.password,
        callbackUrl: PAGES.INVENTORY,
      });
      return {
        ...state,
      };
    case ACTION_TYPE.LOGOUT:
      signOut({ callbackUrl: PAGES.LOGIN });
      return {
        ...state,
      };
    default:
      return state;
  }
};

function initStore(preloadedState = initialState) {
  return createStore(reducer, preloadedState);
}

export const initializeStore = (preloadedState: any) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState: IStoreState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
