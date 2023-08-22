import type { Cookie } from "@hooks/useCookie";

import { createContext, useContext } from "react";

interface CookieContextProps {
  cookie: Cookie;
  updateCookie: (key: keyof Cookie, value: Cookie[keyof Cookie]) => void;
  deleteCookie: (key: keyof Cookie) => void;
}

const CookieContext = createContext<CookieContextProps | undefined>(undefined);

interface Props extends CookieContextProps {
  children: React.ReactNode;
}

export function useCookieContext(): CookieContextProps {
  const ctx = useContext(CookieContext);

  if (ctx == null) throw new Error("useCookieContext must be used within a CookieProvider");

  return ctx;
}

export default function CookierProvider({ cookie, updateCookie, deleteCookie, children }: Props) {
  return (
    <CookieContext.Provider value={{ cookie, deleteCookie, updateCookie }}>
      {children}
    </CookieContext.Provider>
  );
}

CookieContext.displayName = "CookieContext";
