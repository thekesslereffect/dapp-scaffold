import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html className='bg-[var(--body-color)]'>
        <Head>
        <link rel="shortcut icon" href="/favicon.ico"/>
        <script src="https://terminal.jup.ag/main-v3.js" data-preload />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
