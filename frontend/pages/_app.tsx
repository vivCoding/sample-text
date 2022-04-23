import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import ThemeModeContext from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import { store } from '../src/store'

import 'react-toastify/dist/ReactToastify.min.css'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache
}

const MyApp = (props: MyAppProps): JSX.Element => {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
    const themeMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = React.useMemo(
        () => createTheme({
            typography: {
                fontFamily: 'Roboto',
            },
            components: {
                MuiButtonBase: {
                    defaultProps: {
                        disableRipple: true,
                    },
                },
            },
            palette: {
                mode,
            },
        }),
        [mode],
    );

    return (
        <Provider store={store}>
            <CacheProvider value={emotionCache}>
                <Head>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                </Head>
                <ThemeModeContext.Provider value={themeMode}>
                    <ThemeProvider theme={theme}>
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline />
                        <ToastContainer />
                        <Component {...pageProps} />
                    </ThemeProvider>
                </ThemeModeContext.Provider>
            </CacheProvider>
        </Provider>
    );
}

export default MyApp
