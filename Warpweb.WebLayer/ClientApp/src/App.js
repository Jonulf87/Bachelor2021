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

export default function App(props) {

    const drawerWidth = 240;

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        drawer: {
            [theme.breakpoints.up('md')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            [theme.breakpoints.up('md')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,
            },
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        link: {
            textDecoration: 'none'
        },
    }));

    const { window } = props;
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };




    const container = window !== undefined ? () => window().document.body : undefined;

    return (

        <AuthProvider>
            <CurrentEventProvider>
                <ThemeProvider theme={theme}>
                    <div className={classes.root}>
                        <CssBaseline />
                        <AppBar position="fixed" className={classes.appBar}>
                            <Toolbar>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    className={classes.menuButton}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <NavBarHeader />
                            </Toolbar>
                        </AppBar>
                        <nav className={classes.drawer} aria-label="mailbox folders">
                            <Hidden mdUp>
                                <Drawer
                                    container={container}
                                    variant="temporary"
                                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                                    open={mobileOpen}
                                    onClose={handleDrawerToggle}
                                    classes={{
                                        paper: classes.drawerPaper,
                                    }}
                                    ModalProps={{
                                        keepMounted: true, // Better open performance on mobile.
                                    }}
                                >
                                    <MainMenu />
                                </Drawer>
                            </Hidden>
                            <Hidden smDown>
                                <Drawer
                                    classes={{
                                        paper: classes.drawerPaper,
                                    }}
                                    variant="permanent"
                                    open
                                >

                                    <MainMenu />
                                </Drawer>
                            </Hidden>
                        </nav>

                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                            <Switch>
                                <Route path='/user' component={UserMain} />
                                <Route path='/venue' component={VenueMain} />
                                <Route path='/crew' component={CrewMain} />
                                <Route path='/crewadmin' component={CrewAdminMain} />
                                <Route path='/useradmin' component={UserAdminMain} />
                                <Route path='/report' component={ReportMain} />
                                <Route path='/event' component={EventMain} />
                                <Route path='/participant' component={ParticipantMain} />
                                <Route path='/ticket' component={TicketMain} />
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
