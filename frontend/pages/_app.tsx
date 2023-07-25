import "@styles/reactFlow.css";

import type { Cookie } from "@hooks/useCookie";
import type { ColorScheme } from "@mantine/core";
import type { AppProps, AppContext } from "next/app";

import CookierProvider from "@components/CookieProvider/CookieProvider";
import Layout from "@components/Layout/Layout";
import useCookie from "@hooks/useCookie";
import { getDefaultCookies } from "@hooks/useCookie";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { emotionCache } from "@styles/emotionCache";
import NextApp from "next/app";
import Head from "next/head";

type Props = AppProps & {
  cookies: Cookie;
};

export default function App({ Component, pageProps, cookies }: Props) {
  const { cookie, updateCookie, deleteCookie } = useCookie(cookies);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (cookie.mantineColorScheme === "dark" ? "light" : "dark");
    updateCookie("mantineColorScheme", nextColorScheme);
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
      <CookierProvider
        cookie={cookie}
        updateCookie={updateCookie}
        deleteCookie={deleteCookie}
      >
        <ColorSchemeProvider
          colorScheme={cookie.mantineColorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            emotionCache={emotionCache}
            theme={{ colorScheme: cookie.mantineColorScheme }}
            withGlobalStyles
            withNormalizeCSS
          >
            <Layout>
              <Component {...pageProps} />
              <Notifications />
            </Layout>
          </MantineProvider>
        </ColorSchemeProvider>
      </CookierProvider>
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);

  return {
    ...appProps,
    cookies: getDefaultCookies(appContext.ctx),
  };
};
