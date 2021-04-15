import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, ButtonGroup, Drawer, Hidden, Divider, Toolbar, Typography, IconButton, Paper } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

import AdminMainMenu from './AdminMainMenu';
import UserMainMenu from './UserMainMenu';
import CrewMainMenu from './CrewMainMenu';
import NavBarHeader from './NavBarHeader';


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
        boxShadow: 'none',
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
        color: theme.palette.primary.contrastText,
        '& .MuiListItemIcon-root': {
            color: theme.palette.primary.contrastText
        },
        '& .MuiListSubheader-root': {
            color: theme.palette.primary.contrastText
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


export default function MainMenu(props) {

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const { window } = props;

    const container = window !== undefined ? () => window().document.body : undefined;

    const classes = useStyles();

    const NavContents = () => {
        return (
            <>
                <div className={classes.toolbar} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography component={Link} to="/" className={classes.link} variant="h4" noWrap >
                        Warpweb
                    </Typography>
                </div>

                <Divider />
                <AdminMainMenu />
                <Divider />
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
                        <UserMainMenu />
                    </ButtonGroup>
                </Toolbar>
            </AppBar>

            <nav className={classes.drawer} aria-label="mailbox folders">
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