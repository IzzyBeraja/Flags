import type { ColorScheme } from "@mantine/core";
import type { AppProps, AppContext } from "next/app";

import Layout from "@components/Layout";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { getCookie, setCookie } from "cookies-next";
import NextApp from "next/app";
import Head from "next/head";
import { useState } from "react";

type Props = AppProps & {
  currColorScheme: ColorScheme;
};

export default function App({ Component, pageProps, currColorScheme }: Props) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(currColorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <title>🚩 Flags</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <Layout>
            <Component {...pageProps} />
            <Notifications />
          </Layout>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);

  return {
    ...appProps,
    currColorScheme:
      getCookie("mantine-color-scheme", appContext.ctx) || "dark",
  };
};
