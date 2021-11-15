import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Head from 'next/head';
import Close from 'components/assets/close';
import GlobalStyle from 'style/Global';
import theme from 'ui/theme';
import 'style/base.scss';

import Router from 'next/router';
import NProgress from 'nprogress';
import 'style/nprogress.scss';
import { AppProps } from 'next/dist/shared/lib/router/router';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [cookiesConsent, setCookiesConsent] = useState<string | null>(null);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    setCookiesConsent(localStorage.getItem('cookiesConsent'));
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2ZD3ZDVEZD"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments)}
        gtag("js", new Date());
        gtag("config", "G-2ZD3ZDVEZD");
    `,
          }}
        ></script>
        {/* Tell the browser to never restore the scroll position on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"`,
          }}
        />
      </Head>

      <GlobalStyle />
      <Component {...pageProps} />

      {!cookiesConsent && !hide && (
        <div className="cookies">
          We use cookies.
          <a
            className="cookiesLink"
            href="https://intercom.help/ternoa/fr/collections/2774679-legal"
          >
            Learn more
          </a>
          <Close
            className="cross"
            onClick={() => {
              localStorage.setItem('cookiesConsent', 'true');
              setHide(true);
            }}
          />
        </div>
      )}
    </ThemeProvider>
  );
};

export default App;
