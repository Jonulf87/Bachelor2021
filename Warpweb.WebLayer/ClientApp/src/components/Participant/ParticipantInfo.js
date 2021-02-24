import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import authService from '../api-authorization/AuthorizeService';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';


const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            //maxWidth: 500,
            marginBottom: 20,
        },
    }),
);


export default function ParticipantInfo() {


    let [isReady, setIsReady] = useState(false);
    let [usersList, setUsersList] = useState([]);

    useEffect(() => {
        const getUsers = async () => {

            const authenticationResult = authService.isAuthenticated();

            if (authenticationResult) {
                const accessToken = await authService.getAccessToken();

                const response = await fetch('/api/users/UsersList', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const result = await response.json();
                setUsersList(result);

                setIsReady(true);
            }
        }

        getUsers();

    }, []);

    function getUsersFromList() {
        return usersList.map((user) =>
            <ListItem>
                <ListItemIcon><AccessibilityNewIcon /></ListItemIcon>
                <ListItemText primary={user.firstName + " " + user.lastName} />
                <ListItemText primary={user.lastName} />
            </ListItem>
            
            
            )
    };

    const classes = useStyles();
    return (
        <Card className={classes.root}>

            <CardContent>
                {isReady && (<>
                    {getUsersFromList()}
                </>)}

                {!isReady && (<p>Loading...</p>)}


            </CardContent>
        </Card>

    );
}
