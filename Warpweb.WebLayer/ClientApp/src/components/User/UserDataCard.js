import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Card, CardContent, Typography, List, ListItem, ListItemText } from '@material-ui/core';
import BusinessIcon from '@material-ui/icons/Business';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import CakeIcon from '@material-ui/icons/Cake';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import useAuth from '../../hooks/useAuth';

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

    let [userInfo, setUserInfo] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [showParents, setShowParent] = useState(false);
    const { isAuthenticated, token } = useAuth();


    useEffect(() => {
        const getUser = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/users/currentuser', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();
                setUserInfo(result);
                setIsReady(true);
            }
        }
        getUser();

    }, []);

    //useEffect(() => {
    //    const showParents = () => {
    //        if (userInfo.parentPhoneNumber !== null) {
    //            setShowParent(true);
    //        }
    //    };
    //    showParents();
    //}, []);


    const classes = useStyles();
    return (
        <Card className={classes.root}>

            <CardContent>
                {isReady && (<>
                    <Typography gutterBottom variant="h5" component="h2">
                        Hei {userInfo.firstName}  
                    </Typography>

                    <List>
                        <ListItem>
                            <ListItemText>Etternavn:</ListItemText>
                            <ListItemText primary={userInfo.lastName} />
                        </ListItem>

                        <ListItem>
                            <ListItemText>Mellomnavn:</ListItemText>
                            <ListItemText primary={userInfo.middleName} />
                        </ListItem>

                        <ListItem>
                            <ListItemText>Adresse:</ListItemText>
                            <ListItemText primary={ userInfo.address } />
                        </ListItem>

                        <ListItem>
                            <ListItemText>Postnummer:</ListItemText>
                            <ListItemText primary={userInfo.zipCode} />
                        </ListItem>

                        <ListItem>
                            <ListItemText>Telefon:</ListItemText>
                            <ListItemText primary={ userInfo.phoneNumber } />
                        </ListItem>

                        <ListItem>
                            <ListItemText>E-Post:</ListItemText>
                            <ListItemText primary={ userInfo.eMail } />
                        </ListItem>

                        <ListItem>
                            <ListItemText>Fødselsdato:</ListItemText>
                            <ListItemText primary={ userInfo.dateOfBirth }/>
                        </ListItem>

                        <ListItem>
                            <ListItemText>Brukernavn:</ListItemText>
                            <ListItemText primary={ userInfo.userName } />
                        </ListItem>

                        <ListItem>
                            <ListItemText>Kjønn:</ListItemText>
                            <ListItemText primary={userInfo.gender} />
                        </ListItem>

                        <ListItem>
                            <ListItemText>Allergisk:</ListItemText>
                            <ListItemText primary={userInfo.isAllergic ? 'Ja, jeg er allergisk' : 'Nei, jeg har ingen allergier'} />
                        </ListItem>

                        {userInfo.isAllergic && 
                            <ListItem>
                                <ListItemText>Allergibeskrivelse:</ListItemText>
                                <ListItemText primary={userInfo.allergyDescription} />
                            </ListItem>
                        }

                        <ListItem>
                            <ListItemText>Lag/klan:</ListItemText>
                            <ListItemText primary={userInfo.team} />
                        </ListItem>

                        <ListItem>
                            <ListItemText>Tilleggsinformasjon</ListItemText>
                            <ListItemText primary={userInfo.comments} />
                        </ListItem>

                        {userInfo}
                        

                    </List>
                </>)}

                {!isReady && (<p>Loading...</p>)}

                
            </CardContent>
        </Card>
    );
}

