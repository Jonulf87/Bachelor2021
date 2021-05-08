import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Button, ButtonGroup } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.primary.contrastText
    },
    buttonRight: {
        marginLeft: "auto",
        '&:hover': {
            color: theme.palette.secondary,
        },
    },
}));

export default function LoginMenu() {

    const { isAuthenticated } = useAuth();

    const classes = useStyles();

    return (
        <ButtonGroup
            className={classes.buttonRight}
        >
            {isAuthenticated && (
                <>
                    <Button
                        className={classes.root}          
                        startIcon= {<PersonIcon />}
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
                        Registrer
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
        </ButtonGroup>
    );
}
