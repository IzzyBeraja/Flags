import type { OptionsType } from "cookies-next/lib/types";

import { useSetState } from "@mantine/hooks";
import { getCookies, setCookie as setCookiesNext } from "cookies-next";

export type Cookie = {
  mantineColorScheme: "dark" | "light";
};

export type UseCookieReturn = {
  cookie: Cookie;
  updateCookie: (key: keyof Cookie, value: Cookie[keyof Cookie]) => void;
  deleteCookie: (key: keyof Cookie) => void;
};

const defaultCookie: Cookie = {
  mantineColorScheme: "light",
};

export function getDefaultCookies(options?: OptionsType): Cookie {
  return { ...defaultCookie, ...getCookies(options) };
}

export default function useCookie(initialCookie?: Cookie): UseCookieReturn {
  const [cookie, setCookie] = useSetState<Cookie>(
    initialCookie ?? defaultCookie
  );

  const updateCookie = (key: keyof Cookie, value: Cookie[keyof Cookie]) => {
    setCookiesNext(key, value);
    setCookie({ [key]: value });
  };

  const deleteCookie = (key: keyof Cookie) => {
    deleteCookie(key);
    setCookie({ [key]: defaultCookie[key] });
  };

  return { cookie, deleteCookie, updateCookie };
}
