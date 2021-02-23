import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextareaAutosize } from '@material-ui/core';
import UserDataCard from './UserDataCard';
import UserTicketTable from './UserTicketTable';
import UserCrewTable from './UserCrewTable';
import authService from '../api-authorization/AuthorizeService';
import Grid from '@material-ui/core/Grid';

export default function PaperSheet({ theme }) {

    let [isReady, setIsReady] = useState(false);
    let [isAuthenticated, setIsAuthenticated] = useState(false);
    let [user, setUser] = useState(null);
    let [isLoaded, setIsLoaded] = useState(false);


    useEffect(() => {
        const getUser = async () => {

            const authenticationResult = await authService.isAuthenticated();
            const userResult = await authService.getUser();

            setIsAuthenticated(authenticationResult);
            setIsReady(true);

            if (isReady && isAuthenticated) {
                fetch()                
            }
        }
    }, []);








    const useStyles = makeStyles((theme) => ({
        paper: {
            display: 'flex',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(1),
                width: theme.spacing(TextareaAutosize),
                height: theme.spacing(TextareaAutosize),
            },
        },
    }));

    const classes = useStyles();

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