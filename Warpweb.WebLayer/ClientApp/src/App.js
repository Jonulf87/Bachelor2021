import React from 'react';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import { LoginMenu } from './components/api-authorization/LoginMenu';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { useState } from 'react';

import './custom.css'
import MainPage from './components/MainPage/MainPage';
import Test from './components/Test';
import SeatMapBackdrop from './components/SeatMap/SeatMapBackdrop';
import AdminMainMenu from './components/MainPageNavBar/AdminMainMenu';
import UserMainMenu from './components/MainPageNavBar/UserMainMenu';
import VenueMain from './components/Venue/VenueMain';
import EventMain from './components/Event/EventMain';
import ParticipantMain from './components/Participant/ParticipantMain';
import ReportMain from './components/Report/ReportMain';
import TicketMain from './components/Ticket/TicketMain';
import CrewMain from './components/Crew/CrewMain';
import MainPageNavBar from './components/MainPageNavBar/MainPageNavBar';
import UserMain from './components/User/UserMain';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import { ThemeProvider } from '@material-ui/core/styles'



export default function App() {
    //static displayName = App.name;

    

    const drawerWidth = 240;

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }));

        const classes = useStyles();
        const theme = useTheme();
        const [open, setOpen] = React.useState(false);

        function handleDrawerOpen() {
            setOpen(true);
        };

        function handleDrawerClose() {
            setOpen(false);
        };

    return (

        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Warpweb 
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />

                <UserMainMenu />

                <Divider />

                <AdminMainMenu />
                
            </Drawer>


            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                    <Route path='/venue' component={VenueMain} />
                    <Route path='/crew' component={CrewMain} />
                    <Route path='/seat' component={SeatMapBackdrop} />
                    <Route path='/report' component={ReportMain} />
                    <Route path='/event' component={EventMain} />
                    <Route path='/participant' component={ParticipantMain} />
                    <Route path='/ticket' component={TicketMain} />

                </Switch>
                <UserMain />

                
                <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
            </main>
        </div>
        //<div className="container">
        //    <MainPageNavBar />
        //    <SeatMapBackdrop />
        //</div>
        //<Layout>
        //<Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
        //</Layout>
    );
}