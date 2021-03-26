

import {
    Route,
    BrowserRouter as Router,
    Switch
} from "react-router-dom";
import { makeStyles, useTheme } from '@material-ui/core/styles';

import './custom.css'
import MainPage from './components/MainPage/MainPage';
import AdminMainMenu from './components/MainPageNavBar/AdminMainMenu';
import UserAdminMain from './components/UserAdmin/UserAdminMain';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import AppBar from '@material-ui/core/AppBar';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CrewMain from './components/Crew/CrewMain';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import EventMain from './components/Event/EventMain';
import IconButton from '@material-ui/core/IconButton';
import { LoginMenu } from './components/api-authorization/LoginMenu';
import MainPageNavBar from './components/MainPageNavBar/MainPageNavBar';
import MenuIcon from '@material-ui/icons/Menu';
import ParticipantMain from './components/Participant/ParticipantMain';
import React from 'react';
import ReportMain from './components/Report/ReportMain';
import TicketMain from './components/Ticket/TicketMain';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import UserMain from './components/User/UserMain';
import UserMainMenu from './components/MainPageNavBar/UserMainMenu';
import VenueMain from './components/Venue/VenueMain';
import clsx from 'clsx';
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import UserRegister from "./components/User/UserRegister";



export default function App(props) {
    //static displayName = App.name;

    const drawerWidth = 240;

    const useStyles = makeStyles((theme) => ({
        root: {

            display: 'flex',
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,
            },
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
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
    }));

    const { window } = props;
    const classes = useStyles();
    //const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    //    function handleDrawerOpen() {
    //        setOpen(true);
    //    };

    //    function handleDrawerClose() {
    //        setOpen(false);
    //};

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
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
                        <Typography variant="h6" noWrap>
                            WarpWeb
                        </Typography>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="mailbox folders">
                    <Hidden smUp implementation="css">
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
                            <Divider />
                            <UserMainMenu />
                            <Divider />
                            <AdminMainMenu />
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            <div className={classes.toolbar} background="primary" />
                            <Divider />
                            <UserMainMenu />
                            <Divider />
                            <AdminMainMenu />
                        </Drawer>
                    </Hidden>
                </nav>

                {/*<Drawer
                //    variant="permanent"
                //    className={clsx(classes.drawer, {
                //        [classes.drawerOpen]: open,
                //        [classes.drawerClose]: !open,
                //    })}
                //    classes={{
                //        paper: clsx({
                //            [classes.drawerOpen]: open,
                //            [classes.drawerClose]: !open,
                //        }),
                //    }}
                //>
                //    <div className={classes.toolbar}>
                //        <IconButton onClick={handleDrawerClose}>
                //            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                //        </IconButton>
                //    </div>
                //    <Divider />

                //    <UserMainMenu />

                //    <Divider />

                //    <AdminMainMenu />
                
                //</Drawer>*/}


                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                        <Route path='/user' component={UserMain} />
                        <Route path='/venue' component={VenueMain} />
                        <Route path='/crew' component={CrewMain} />
                        <Route path='/useradmin' component={UserAdminMain} />
                        <Route path='/report' component={ReportMain} />
                        <Route path='/event' component={EventMain} />
                        <Route path='/participant' component={ParticipantMain} />
                        <Route path='/ticket' component={TicketMain} />
                        <Route path='/register' component={UserRegister} />
                    </Switch>

                    <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
                </main>
            </div>
        </ThemeProvider>

        // <Route path='/seat' component={SeatMapBackdrop} />
        //<div className="container">
        //    <MainPageNavBar />

        //</div>
        //<Layout>
        //<Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
        //</Layout>

        //<Route path='/useradmin' component={} />
    );
}