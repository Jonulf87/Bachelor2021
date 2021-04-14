﻿import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, ListItemIcon, Button, ButtonGroup} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import theme from '../../theme';

const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.primary.contrastText
    }
}));

export default function UserMainMenu() {

    const { isAuthenticated } = useAuth();
    
    const classes = useStyles();

    return (
        <>
            {isAuthenticated && (
                <>
                    <Button
                    className={classes.root}
                    startIcon={<PersonIcon />}
                    component={Link}
                    to='/user'
                    >
                        Min side
                    </Button>
                    <Button
                    className={classes.root}
                    startIcon={<ExitToAppIcon />}
                    component={Link}
                    to='/logout'>
                        Logg ut
                    </Button>
                </>
                )}
            {!isAuthenticated && (
                <>
                    <Button
                    className={classes.root}
                    startIcon={<PersonIcon />}
                    component={Link}
                    to='/register'
                    >
                        Min side
                    </Button>
                    <Button
                    className={classes.root}
                    startIcon={<ExitToAppIcon />}
                    component={Link}
                    to='/login'>
                        Logg inn
                    </Button>
                </>
            )}
        </>
    );
}
