import type { DocumentContext } from "next/document";

import { ServerStyles, createStylesServer } from "@mantine/next";
import Document from "next/document";

import { emotionCache } from "@/emotionCache";

const stylesServer = createStylesServer(emotionCache);

export default class _Document extends Document {
  static override async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles
          html={initialProps.html}
          server={stylesServer}
          key="styles"
        />,
      ],
    };
  }
}
