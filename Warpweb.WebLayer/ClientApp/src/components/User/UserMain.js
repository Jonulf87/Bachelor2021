import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UserDataCard from './UserDataCard';
import UserInfoCompact from './UserInfoCompact';
import UserTicketTable from './UserTicketTable';
import UserCrewTable from './UserCrewTable';
import Grid from '@material-ui/core/Grid';

export default function PaperSheet() {

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
        <Grid container spacing={2}>
            <Grid item xs>
                <UserInfoCompact />
            </Grid>
            <Grid item xs>
                <UserTicketTable />
            </Grid>
            <Grid item xs>
                <UserCrewTable />
            </Grid>
        </Grid>
    );
}
