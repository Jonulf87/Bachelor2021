import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UserList from './UserList';
import Grid from '@material-ui/core/Grid';

export default function UserAdminMain() {

    const useStyles = makeStyles((theme) => ({
        paper: {
            display: 'flex',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(1),
                width: theme.spacing(16),
                height: theme.spacing(16),
            },
        },
    }));

    const classes = useStyles(); 

    return (
        <Grid container spacing={3}>
            <Grid item xs>
                <UserList />
            </Grid>
        </Grid>

    );
}