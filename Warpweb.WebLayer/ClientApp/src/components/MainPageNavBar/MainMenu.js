import React from 'react';

import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Divider, Typography} from '@material-ui/core';

import AdminMainMenu from './AdminMainMenu';
import UserMainMenu from './UserMainMenu';
import CrewMainMenu from './CrewMainMenu';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    link: {
        textDecoration: 'none'
    },
}));


export default function MainMenu() {
    
    const classes = useStyles();

    return (
        <>
        <div className={classes.toolbar} background="primary" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography component={Link} to="/" color="primary" className={classes.link}  variant="h4" noWrap >
                Warpweb
            </Typography>
        </div>
        <Divider />
        <UserMainMenu />
        <Divider />
        <AdminMainMenu />
        <Divider />
        <CrewMainMenu />
        </>
    )
}