import { Fragment } from 'react';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';

import { ThemeProvider } from './components/theme-provider';
import Pages from './routes/Pages';

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Fragment>
                <Pages />
            </Fragment>
        </ThemeProvider>
    );
}

const AppWithErrorHandler = withErrorHandler(App, AppErrorBoundaryFallback);
export default AppWithErrorHandler;
