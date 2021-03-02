import Head from 'next/head';
import React from 'react';
import dynamic from "next/dynamic";

import Auth from 'component/Auth';

const ScannerPage = () => {
  const Scanner = dynamic(
    () => {
      return import("../component/Scanner");
    },
    { ssr: false }
  );

  return (
    <Auth>
      <Head>
        <title>Dam Sen Park</title>
      </Head>
      <Scanner />
    </Auth>
  );
};

export default ScannerPage;
