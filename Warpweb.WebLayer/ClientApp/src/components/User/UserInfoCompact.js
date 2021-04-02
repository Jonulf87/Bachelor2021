import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Grid, Button, Card, CardContent, Typography, CircularProgress, Divider
} from '@material-ui/core';
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

    const classes = useStyles();

    return (
        <Card className={classes.root}>

            <CardContent>
                {isReady && (<>
                    <Grid container>

                        <Typography gutterBottom variant="h5" component="h2">
                            Hei {userInfo.firstName}&nbsp;{userInfo.lastName}
                        </Typography>

                        <Grid id="userFullName" item xs={12}>
                            <p><strong>Fullt navn:&nbsp;</strong>{userInfo.firstName}&nbsp;{userInfo.middleName}&nbsp;{userInfo.lastName}</p>
                        </Grid>

                        <Grid id="userUserName" item xs={12}>
                            <p><strong>Brukernavn:&nbsp;</strong>{userInfo.userName}</p>
                        </Grid>

                        <Grid id="userEmail" item xs={12}>
                            <p><strong>E-post:&nbsp;</strong>{userInfo.eMail}</p>
                        </Grid>

                        <Grid id="userPhoneNumber" item xs={12}>
                            <p><strong>Telefon:&nbsp;</strong>{userInfo.phoneNumber}</p>
                        </Grid>

                        <Grid id="userGender" item xs={12}>
                            <p><strong>Kjønn:&nbsp;</strong>{userInfo.gender}</p>
                        </Grid>

                        <Grid id="userDateOfBirth" item xs={12}>
                            <p><strong>Fødselsdato:&nbsp;</strong>{userInfo.dateOfBirth}</p>
                        </Grid>

                        <Grid id="userIsAllergic" item xs={12}>
                            <p><strong>Allergier:&nbsp;</strong>{userInfo.isAllergic ? 'Ja, jeg er allergisk' : 'Nei, jeg har ingen allergier'}</p>
                        </Grid>

                        {userInfo.isAllergic &&
                            <Grid id="userAllergyDescription" item xs={12}>
                                <p><strong>Allergier:&nbsp;</strong>{userInfo.allergyDescription}</p>
                            </Grid>
                        }

                        {userInfo.parentPhoneNumber &&
                            <Grid id="userParentInfo" container>
                                <Grid id="userParenFullName" item xs={12}>
                                    <p><strong>Foresatt:&nbsp;</strong>{userInfo.parentFirstName}&nbsp;{userInfo.parentLastName} </p>
                                </Grid>

                                <Grid id="userParentPhoneNumber" item xs={12}>
                                    <p><strong>Foresatt telefon:&nbsp;</strong>{userInfo.parentPhoneNumber} </p>
                                </Grid>

                                <Grid id="userParentEmail" item xs={12}>
                                    <p><strong>Foresatt epost:&nbsp;</strong>{userInfo.parentEMail} </p>
                                </Grid>
                            </Grid>
                        }

                        <Grid id="userTeam" item xs={12}>
                            <p><strong>Lag/klan:&nbsp;</strong>{userInfo.team} </p>
                        </Grid>

                        <Grid id="userComments" item xs={12}>
                            <p><strong>Tilleggsinformasjon:&nbsp;</strong>{userInfo.comments} </p>
                        </Grid>

                        <Grid>
                            <Button variant="contained" color="primary">
                                Endre
                            </Button>
                        </Grid>

                    </Grid>
                </>)}

                {!isReady && ((<CircularProgress />))}

            </CardContent>
        </Card >
    );
}

