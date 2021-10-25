import React from 'react';

import makeStyles from '@mui/styles/makeStyles';
import { Button, ButtonGroup } from '@mui/material';

import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.primary.contrastText,
    },
    buttonRight: {
        marginLeft: 'auto',
        '&:hover': {
            color: theme.palette.secondary,
        },
    },
}));

export default function LoginMenu({ menuItems }) {
    const classes = useStyles();

    return (
        <ButtonGroup className={classes.buttonRight}>
            {menuItems.map((item) => (
                <Button className={classes.root} startIcon={item.itemIcon} component={Link} to={item.destination} key={item.itemText}>
                    {item.itemText}
                </Button>
            ))}
        </ButtonGroup>
    );
}
