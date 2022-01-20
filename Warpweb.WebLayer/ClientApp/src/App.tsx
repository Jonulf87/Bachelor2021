import theme from './theme';
import './custom.css';
import AuthProvider from './providers/AuthProvider';

import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import CurrentEventProvider from './providers/CurrentEventProvider';
import PurchaseProvider from './providers/PurchaseProvider';
import SeatMapAdminProvider from './providers/SeatMapAdminProvider';
import SeatMapProvider from './providers/SeatMapProvider';
import { Root } from './components/Root/Root';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

export default function App() {
    return (
        <AuthProvider>
            <CurrentEventProvider>
                <PurchaseProvider>
                    <SeatMapAdminProvider>
                        <SeatMapProvider>
                            <LocalizationProvider dateAdapter={DateAdapter}>
                                <StyledEngineProvider injectFirst>
                                    <ThemeProvider theme={theme}>
                                        <Root />
                                    </ThemeProvider>
                                </StyledEngineProvider>
                            </LocalizationProvider>
                        </SeatMapProvider>
                    </SeatMapAdminProvider>
                </PurchaseProvider>
            </CurrentEventProvider>
        </AuthProvider>
    );
}
