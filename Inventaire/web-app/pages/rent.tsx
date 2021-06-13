import { NextPageContext } from 'next';
import { getSession } from 'next-auth/client';
import { ACCOUNT_TYPE_ID } from '../Utils/enums';
import { IsUserAllowedOnPage } from '../Utils/functions';

interface ICtx extends NextPageContext {}
export async function getServerSideProps(ctx: ICtx) {
  const session = await getSession(ctx);
  return (
    IsUserAllowedOnPage(session, ACCOUNT_TYPE_ID.EMPLOYEE) || {
      props: {
        /*user: session.user*/
      },
    }
  );
}
export default function rent() {
  return <div>Rent</div>;
}
