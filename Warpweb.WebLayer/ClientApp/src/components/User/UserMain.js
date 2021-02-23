import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextareaAutosize } from '@material-ui/core';
import UserDataCard from './UserDataCard';
import UserTicketTable from './UserTicketTable';
import UserCrewTable from './UserCrewTable';
import authService from '../api-authorization/AuthorizeService';

export default function PaperSheet({ theme }) {

    let [isReady, setIsReady] = useState(false);
    let [isAuthenticated, setIsAuthenticated] = useState(false);
    let [user, setUser] = useState(null);
    let [userAccessToken, setUserAccessToken] = useState(null);


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
            }
            

            if (isReady && isAuthenticated) {
                fetch('localhost', {
                    headers: {
                        Authorization: 'token ${userAccessToken}'
                    }
                })
                    .then(result => result.json)
                    .then(json => console.log(json));
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
        <>
            <UserDataCard />
            <UserTicketTable />
            <UserCrewTable />
        </>


    );
}