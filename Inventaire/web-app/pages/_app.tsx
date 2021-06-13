import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CssBaseline } from '@material-ui/core';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { useStore } from '../Utils/store';
import { Layout, SnackBar, ThemeProvider } from '../components';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <NextAuthProvider session={pageProps.session}>
      <ReduxProvider store={store}>
        <ThemeProvider>
          <CssBaseline>
            <Layout>
              <Component {...pageProps} />
              <SnackBar />
            </Layout>
          </CssBaseline>
        </ThemeProvider>
      </ReduxProvider>
    </NextAuthProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
