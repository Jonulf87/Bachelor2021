import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextareaAutosize } from '@material-ui/core';
import UserDataCard from './UserDataCard';
import UserTicketTable from './UserTicketTable';
import UserCrewTable from './UserCrewTable';
import authService from '../api-authorization/AuthorizeService';
import Grid from '@material-ui/core/Grid';

export default function PaperSheet({ theme }) {



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

    const classes = useStyles(); //Denne gir masse feilkoder

    return (
        <Grid container spacing={3}>
            <Grid item xs>
                <UserDataCard />
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