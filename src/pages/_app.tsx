import "@/styles/globals.css";
import type { AppProps, AppType } from "next/app";
import Head from "next/head";
import React from "react";

const MainApp: AppType = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default MainApp;
