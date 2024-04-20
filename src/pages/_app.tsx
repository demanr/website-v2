import "@/styles/globals.css";
import type { AppProps, AppType } from "next/app";
import Head from "next/head";
import React from "react";

// pages/_app.js
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  // checks that we are client-side
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug(); // debug mode in development
    },
  });
}

const MainApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <PostHogProvider client={posthog}>
      <div>
        <Head>
          <link rel="icon" type="image/svg+xml" href="/myfavicon.ico" />
          <meta name="viewport" content="width=device-width" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Red+Hat Display:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
            rel="stylesheet"
          />
          {/*<!-- HTML Meta Tags -->*/}
          <title>Rachelle De Man</title>
          <meta
            name="description"
            content="Software Developer. Studying Computer Science at McMaster University."
          />

          {/*<!-- Facebook Meta Tags -->*/}
          <meta property="og:url" content="https://rachelle.tech" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Rachelle De Man" />
          <meta
            property="og:description"
            content="Software Developer. Studying Computer Science at McMaster University."
          />
          <meta property="og:image" content=" " />

          {/*<!-- Twitter Meta Tags -->*/}
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="rachelle.tech" />
          <meta property="twitter:url" content="https://rachelle.tech" />
          <meta name="twitter:title" content="Rachelle De Man" />
          <meta
            name="twitter:description"
            content="Software Developer. Studying Computer Science at McMaster University."
          />
          <meta name="twitter:image" content=" " />
          {/*<!-- Meta Tags Generated via https://www.opengraph.xyz -->*/}
        </Head>
        <Component {...pageProps} />
      </div>
    </PostHogProvider>
  );
};

export default MainApp;
