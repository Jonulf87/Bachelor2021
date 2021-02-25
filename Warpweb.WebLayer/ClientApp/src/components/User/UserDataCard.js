import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BusinessIcon from '@material-ui/icons/Business';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import CakeIcon from '@material-ui/icons/Cake';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import authService from '../api-authorization/AuthorizeService';

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

export default function UserDataCard() {


    let [isReady, setIsReady] = useState(false);
    let [userInfo, setUserInfo] = useState(null);


    useEffect(() => {
        const getUser = async () => {

            const authenticationResult = await authService.isAuthenticated();

            if (authenticationResult) {
                const accessToken = await authService.getAccessToken();

                const response = await fetch('/api/users', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const result = await response.json();
                setUserInfo(result);
                setIsReady(true);
            }
        }

        getUser();



    }, []);


    const classes = useStyles();
    return (
        <Card className={classes.root}>

            <CardContent>
                {isReady && (<>
                    <Typography gutterBottom variant="h5" component="h2">
                        {userInfo.firstName} { userInfo.lastName }  
                    </Typography>

                    <List>
                        <ListItem>
                            <ListItemIcon><BusinessIcon /></ListItemIcon>
                            <ListItemText primary={ userInfo.address } />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><PhoneIcon /></ListItemIcon>
                            <ListItemText primary={ userInfo.phoneNumber } />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><EmailIcon /></ListItemIcon>
                            <ListItemText primary={ userInfo.eMail } />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CakeIcon /></ListItemIcon>
                            <ListItemText primary={ userInfo.dateOfBirth }/>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                            <ListItemText primary={ userInfo.userName } />
                        </ListItem>
                    </List>
                </>)}

                {!isReady && (<p>Loading...</p>)}

                
            </CardContent>
        </Card>
    );
}

