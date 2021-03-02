import React from 'react';
import NProgress from 'nprogress';
import Router from 'next/router';
import { NotificationContainer } from 'react-notifications';

import 'public/styles/globals.css';
import 'nprogress/nprogress.css';
import 'react-notifications/lib/notifications.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NotificationContainer />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
