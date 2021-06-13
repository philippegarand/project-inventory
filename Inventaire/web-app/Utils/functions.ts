import { Session } from 'next-auth/client';
import { ACCOUNT_TYPE_ID, ACCOUNT_TYPE_TEXT, PAGES } from './enums';

export const ConvertAccountTypeToString = (AccountType: number) => {
  switch (AccountType) {
    case ACCOUNT_TYPE_ID.ADMIN:
      return ACCOUNT_TYPE_TEXT.ADMIN;
    case ACCOUNT_TYPE_ID.MANAGER:
      return ACCOUNT_TYPE_TEXT.MANAGER;
    case ACCOUNT_TYPE_ID.EMPLOYEE:
      return ACCOUNT_TYPE_TEXT.EMPLOYEE;
    case ACCOUNT_TYPE_ID.NONE:
      return ACCOUNT_TYPE_TEXT.NONE;
  }
};

/**
 * Return a Next-Auth redirect object if there's no session
 * or if the session user doesn't have the minimum required role.
 * Return undefined otherwise
 *
 * ** Make sure role fit with the page in NavItem array in DrawerMenu.
 */
export const IsUserAllowedOnPage = (
  session: Session,
  minRole: ACCOUNT_TYPE_ID,
): object | undefined => {
  if (!session || !session.user) {
    return {
      redirect: {
        destination: PAGES.LOGIN,
        permanent: false,
      },
    };
  }

  if (session.user.role > minRole) {
    return {
      redirect: {
        destination: PAGES.INVENTORY,
        permanent: false,
      },
    };
  }

  // is allowed, nothing to return
  return undefined;
};
