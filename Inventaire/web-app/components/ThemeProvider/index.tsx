import { useDispatch, useSelector } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core';
import { DarkTheme, LightTheme } from '../../Utils/theme';
import { ACTION_TYPE, IStoreState } from '../../Utils/store';
import { useEffect, useState } from 'react';

export default function ThemeProvider(props: any) {
  const darkTheme = useSelector((state: IStoreState) => state.darkTheme);
  const dispatch = useDispatch();

  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // to set theme from localStorage (init only, cause flash of darktheme if light theme set)
  useEffect(() => {
    const isDT = localStorage.getItem('darkTheme');
    dispatch({
      type: ACTION_TYPE.CHANGE_THEME,
      darkTheme: Boolean(isDT) ? isDT === 'true' : true,
    });
  }, []);

  // Set local theme value on store change
  useEffect(() => {
    setIsDarkTheme(darkTheme);
  }, [darkTheme]);

  return (
    <MuiThemeProvider theme={isDarkTheme ? DarkTheme : LightTheme}>
      {props.children}
    </MuiThemeProvider>
  );
}
