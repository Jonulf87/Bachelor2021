import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid, Button, Card, CardContent, Typography, List, ListItem, ListItemText } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: 20,
        },
    }),
);

export default function UserDataCard() {

    let [userInfo, setUserInfo] = useState([]);
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

    }, [isAuthenticated]);


    useEffect(() => {
        const showParents = () => {
            if (userInfo) {
                setShowParent(true);
            }
        };
        showParents();

    }, []);

    const classes = useStyles();

    return (
        <Card className={classes.root}>

            <CardContent>
                {isReady && (<>
                    <Typography gutterBottom variant="h5" component="h2">
                        Hei {userInfo.firstName}
                    </Typography>

                    <List>
                        <ListItem divider>
                            <ListItemText primary={userInfo.lastName} secondary="Etternavn" />
                        </ListItem>

                        <ListItem divider>
                            <ListItemText primary={userInfo.middleName} secondary="Mellomnavn" />
                        </ListItem>

                        <ListItem divider>
                            <ListItemText primary={userInfo.address} secondary="Adresse" />
                        </ListItem>

                        <ListItem divider>
                            <ListItemText primary={userInfo.zipCode} secondary="Postnr" />
                        </ListItem>

                        <ListItem divider>
                            <ListItemText primary={userInfo.phoneNumber} secondary="Telefon" />
                        </ListItem>

                        <ListItem divider>
                            <ListItemText primary={userInfo.eMail} secondary="E-post" />
                        </ListItem>

                        <ListItem divider>
                            <ListItemText primary={userInfo.dateOfBirth} secondary="Fødselsdato" />
                        </ListItem>

                        <ListItem divider>
                            <ListItemText primary={userInfo.userName} secondary="Brukernavn" />
                        </ListItem>

                        <ListItem divider>
                            <ListItemText primary={userInfo.gender} secondary="Kjønn" />
                        </ListItem>

                        <ListItem divider>
                            <ListItemText primary={userInfo.isAllergic ? 'Ja, jeg er allergisk' : 'Nei, jeg har ingen allergier'} secondary="Allergisk" />
                        </ListItem>

                        {userInfo.isAllergic &&
                            <ListItem divider>
                                <ListItemText primary={userInfo.allergyDescription} secondary="Allergibeskrivelse" />
                            </ListItem>
                        }

                        {showParents && <>
                            <Grid container>
                                <ListItem divider>
                                    <ListItemText primary={userInfo.parentFirstName} secondary="Foresatt fornavn" />
                                </ListItem>

                                <ListItem divider>
                                    <ListItemText primary={userInfo.parentLastName} secondary="Foresatt etternavn" />
                                </ListItem>

                                <ListItem divider>
                                    <ListItemText primary={userInfo.parentPhoneNumber} secondary="Foresatt telefon" />
                                </ListItem>

                                <ListItem divider>
                                    <ListItemText primary={userInfo.parentEMail} secondary="Foresatt e-post" />
                                </ListItem>
                            </Grid>
                        </>}

                        <ListItem divider>
                            <ListItemText primary={userInfo.team} secondary="Lag/klan" />
                        </ListItem>

                        <ListItem>
                            <ListItemText primary={userInfo.comments} secondary="Tilleggsinformasjon" />
                        </ListItem>

                        <ListItem>
                            <Button variant="contained" color="primary">
                                Endre
                            </Button>
                        </ListItem>

                    </List>
                </>)}

                {!isReady && (<p>Loading...</p>)}

            </CardContent>
        </Card>
    );
}

