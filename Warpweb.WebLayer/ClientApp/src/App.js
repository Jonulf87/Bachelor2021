import React from 'react';
import theme from './theme'
import {
    Route,
    BrowserRouter as Router,
    Switch
} from "react-router-dom";
import './custom.css';
import AuthProvider from './providers/AuthProvider';

import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Container } from '@material-ui/core';

import AppRouter from './components/Approuter';
import MainMenu from './components/MainPageNavBar/MainMenu';
import CurrentEventProvider from './providers/CurrentEventProvider';
import PurchaseProvider from './providers/PurchaseProvider';
import SeatMapAdminProvider from './providers/SeatMapAdminProvider';
import SeatMapProvider from './providers/SeatMapProvider';

Date.prototype.toJSON = function () {
    const hoursDiff = this.getHours() - this.getTimezoneOffset() / 60;
    this.setHours(hoursDiff);
    return this.toISOString();
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    // necessary for content to be below app bar
    toolbar: {
        height: '80px'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            paddingLeft: '0px',
            paddingRight: '0px',
        }
    },
}));


export default function App() {

    const classes = useStyles();


    return (

        <AuthProvider>
            <CurrentEventProvider>
                <PurchaseProvider>
                    <SeatMapAdminProvider>
                        <SeatMapProvider>
                            <ThemeProvider theme={theme}>
                                <div className={classes.root}>
                                    <CssBaseline />
                                    <MainMenu />
                                    <main className={classes.content}>
                                        <div className={classes.toolbar} />
                                        <Container
                                            maxWidth='xl'
                                            justify="center"
                                        >
                                            <AppRouter />
                                        </Container>
                                    </main>
                                </div>
                            </ThemeProvider>
                        </SeatMapProvider>
                    </SeatMapAdminProvider>
                </PurchaseProvider>
            </CurrentEventProvider>
        </AuthProvider>
    );
}
