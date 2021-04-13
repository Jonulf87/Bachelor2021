import React, { useEffect, useState } from 'react';
import theme from './theme'
import {
    Route,
    BrowserRouter as Router,
    Switch
} from "react-router-dom";
import clsx from 'clsx';
import './custom.css';
import AuthProvider from './providers/AuthProvider';

import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { Divider, Drawer, Hidden, IconButton, Toolbar, Typography, CssBaseline, AppBar, } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import MainMenu from './components/MainPageNavBar/MainMenu';
import UserAdminMain from './components/UserAdmin/UserAdminMain';
import CrewMain from './components/Crew/CrewMain';
import CrewAdminMain from './components/Crew/CrewAdminMain';
import EventMain from './components/Event/EventMain';
import ParticipantMain from './components/Participant/ParticipantMain';
import ReportMain from './components/Report/ReportMain';
import TicketMain from './components/Ticket/TicketMain';
import UserMain from './components/User/UserMain';
import VenueMain from './components/Venue/VenueMain';
import UserRegister from "./components/User/UserRegister";
import UserLogin from "./components/User/UserLogin";
import SeatMapMain from './components/SeatMap/SeatMapMain';
import LogOut from './components/MainPageNavBar/LogOut';
import NavBarHeader from './components/MainPageNavBar/NavBarHeader';
import CurrentEventProvider from './providers/CurrentEventProvider';
import OrganizerAdminMain from './components/OrganizerAdmin/OrganizerAdminMain';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }));


export default function App() {

    const classes = useStyles();


    return (

        <AuthProvider>
            <CurrentEventProvider>
                <ThemeProvider theme={theme}>
                    <div className={classes.root}>
                        <CssBaseline />
                        <MainMenu />

                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                            <Switch>
                                <Route path='/user' component={UserMain} />
                                <Route path='/venue' component={VenueMain} />
                                <Route path='/crew/:id' component={CrewMain} />
                                <Route path='/crewadmin' component={CrewAdminMain} />
                                <Route path='/useradmin' component={UserAdminMain} />
                                <Route path='/report' component={ReportMain} />
                                <Route path='/event' component={EventMain} />
                                <Route path='/participant' component={ParticipantMain} />
                                <Route path='/ticketadmin' component={TicketMain} />
                                <Route path='/register' component={UserRegister} />
                                <Route path='/login' component={UserLogin} />
                                <Route path='/logout' component={LogOut} />
                                <Route exact path='/' component={EventMain} />
                                <Route path='/seatmap' component={SeatMapMain} />
                                <Route path='/organizer' component={OrganizerAdminMain} />
                            </Switch>
                        </main>
                    </div>
                </ThemeProvider>
            </CurrentEventProvider>
        </AuthProvider>
    );
}
