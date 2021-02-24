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
    let [userAccessToken, setUserAccessToken] = useState(null);
    let [userInfo, setUserInfo] = useState(null);


    useEffect(() => {
        const getUser = async () => {

            const authenticationResult = await authService.isAuthenticated();
            const userResult = await authService.getUser();


            if (!!userResult != null) {
                setIsAuthenticated(authenticationResult);
                setIsReady(true);
                setUser(userResult);
                const accessToken = await authService.getAccessToken();
                setUserAccessToken(accessToken);

                //console.log("isAuthenticated = " + isAuthenticated);
                //console.log("isReady = " + isReady);
                //console.log("user = " + user);
                //console.log("userAccessToken = " + userAccessToken);
            }
            

            //if (isReady && isAuthenticated) {
            //    const response = await fetch('https://localhost:44308/api/users', {
            //        headers: {
            //            Authorization: 'token ${userAccessToken}'
            //        }
            //    });
            //    const result = await response.json();
            //    setUserInfo(result);
            //}
        }

        getUser();
    }, [isAuthenticated]);








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

    //const classes = useStyles(); Denne gir masse feilkoder

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