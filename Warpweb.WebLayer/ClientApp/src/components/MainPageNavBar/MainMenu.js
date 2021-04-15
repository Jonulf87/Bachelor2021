import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import useAuth from '../../hooks/useAuth';


import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, ButtonGroup, Drawer, Hidden, Divider, Toolbar, Typography, IconButton, Paper } from '@material-ui/core';

import AdminMainMenu from './AdminMainMenu';
import UserMainMenu from './UserMainMenu';
import CrewMainMenu from './CrewMainMenu';
import NavBarHeader from './NavBarHeader';
import LoginMenu from './LoginMenu';


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
            width: '100%',
            zIndex: theme.zIndex.drawer + 1,
            marginLeft: drawerWidth,
        },
        boxShadow: 'none',
        backgroundColor: theme.palette.primary.main,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    buttonRight: {
        marginLeft: "auto",
        '&:hover': {
            color: theme.palette.secondary,
        },
    },

    // nødvendig for innhold nendefor baren
    toolbar: theme.mixins.toolbar,

    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary,
        '& .MuiListItemIcon-root': {
            color: theme.palette.primary
        },
        '& .MuiListSubheader-root': {
            color: theme.palette.primary
        }

    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    link: {
        textDecoration: 'none'
    }
}));


export default function MainMenu({ window }) {

    const [mobileOpen, setMobileOpen] = useState(false);
    const [policies, setPolicies] = useState([]);
    const [crews, setCrews] = useState([]);
    const { currentEventChangeCompleteTrigger } = useCurrentEvent();
    const { isAuthenticated, token, roles } = useAuth();

    const container = window !== undefined ? () => window().document.body : undefined;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    const classes = useStyles();

    useEffect(() => {
        if (isAuthenticated) {
            const getPoliciesAndCrews = async () => {
                const responsePolicies = await fetch('/api/security/policies', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultPolicies = await responsePolicies.json();
                setPolicies(resultPolicies);

                const responseCrews = await fetch('/api/security/policies', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultCrews = await responseCrews.json();
                setCrews(resultCrews);
                console.log(resultCrews);
            }

            getPoliciesAndCrews();
        }
        else {
            setPolicies([]);
            setCrews([]);
        }
    }, [currentEventChangeCompleteTrigger, isAuthenticated])

    const NavContents = () => {
        return (
            <>
                <div className={classes.toolbar} />
                <UserMainMenu />
                <Divider />
                {(policies || roles) &&
                    <>
                    <AdminMainMenu policies={policies} roles={roles} />
                        <Divider />
                    </>
                }
                <CrewMainMenu />
            </>
        )
    }


    return (
        <>
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
                    <ButtonGroup className={classes.buttonRight}>
                        <LoginMenu />
                    </ButtonGroup>
                </Toolbar>
            </AppBar>

            <nav className={classes.drawer} aria-label="Meny">
                <Hidden mdUp>
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor='left'
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <NavContents />
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
                        <NavContents />
                    </Drawer>
                </Hidden>
            </nav>
        </>
    )
}