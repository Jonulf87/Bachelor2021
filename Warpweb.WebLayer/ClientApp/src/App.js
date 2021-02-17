import React from 'react';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import './custom.css'
//import Layout from './components/Layout/Layout';
import MainPage from './components/MainPage/MainPage';
import Test from './components/Test';
import SeatMapBackdrop from './components/SeatMap/SeatMapBackdrop';
import MainPageNavBar from './components/MainPageNavBar/MainPageNavBar';
import UserMain from './components/User/UserMain';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import EventIcon from '@material-ui/icons/Event';
import GroupIcon from '@material-ui/icons/Group';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentIcon from '@material-ui/icons/Assignment';



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
                        Mini variant drawer
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
 
                <List> 
                    <ListItem button>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary='Min side' />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary='Logg ut' />
                    </ListItem>
                    
                </List>
                <Divider />
 
                <List>
                    <ListItem button>
                        <ListItemIcon><HomeWorkIcon /></ListItemIcon>
                        <ListItemText primary='Lokale' />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><ConfirmationNumberIcon /></ListItemIcon>
                        <ListItemText primary='Billetter' />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><EventIcon /></ListItemIcon>
                        <ListItemText primary='Arrangement' />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><GroupIcon /></ListItemIcon>
                        <ListItemText primary='Crew' />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><AssignmentIndIcon /></ListItemIcon>
                        <ListItemText primary='Deltagere' />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon><AssignmentIcon /></ListItemIcon>
                        <ListItemText primary='Rapporter' />
                    </ListItem>

                    
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <UserMain theme={theme} />
                <SeatMapBackdrop />
            </main>
        </div>
        //<div className="container">
        //    <MainPageNavBar />
        //    <SeatMapBackdrop />
        //</div>
        //<Layout>
        //  <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
        //</Layout>
    );
}