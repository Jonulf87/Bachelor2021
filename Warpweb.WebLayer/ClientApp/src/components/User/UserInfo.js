import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid, Button, Card, CardContent, Typography, CircularProgress } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: 20,
            maxWidth: 450,
        },
        p: {
            fontsize: 14,
            marginBottom: 10,
        },
    }),
);

export default function UserInfo() {

    const [userInfo, setUserInfo] = useState([]);
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
        <Card className={classes.root} variant="outlined">

            <CardContent>
                {isReady && (<>
                    <Typography gutterBottom variant="h6" component="h2" gutterBottom>
                        Hei {userInfo.firstName}&nbsp;{userInfo.lastName}
                    </Typography>

                    <Typography className={classes.p} variant="body1" component="p">
                        <strong>Fullt navn:&nbsp;</strong>{userInfo.firstName}&nbsp;{userInfo.middleName}&nbsp;{userInfo.lastName}
                    </Typography>

                    <Typography className={classes.p} variant="body1" component="p">
                        <strong>Brukernavn:&nbsp;</strong>{userInfo.userName}
                    </Typography>

                    <Typography className={classes.p} variant="body1" component="p">
                        <strong>E-post:&nbsp;</strong>{userInfo.eMail}
                    </Typography>

                    <Typography className={classes.p} variant="body1" component="p">
                        <strong>Telefon:&nbsp;</strong>{userInfo.phoneNumber}
                    </Typography>

                    <Typography className={classes.p} variant="body1" component="p">
                        <strong>Kjønn:&nbsp;</strong>{userInfo.gender}
                    </Typography>

                    <Typography className={classes.p} variant="body1" component="p">
                        <strong>Fødselsdato:&nbsp;</strong>{userInfo.dateOfBirth}
                    </Typography>

                    <Typography className={classes.p} variant="body1" component="p">
                        <strong>Allergier:&nbsp;</strong>{userInfo.isAllergic ? 'Ja, jeg er allergisk' : 'Nei, jeg har ingen allergier'}
                    </Typography>

                    {userInfo.isAllergic &&
                        <Typography className={classes.p} variant="body1" component="p">
                            <strong>Allergier:&nbsp;</strong>{userInfo.allergyDescription}
                        </Typography>
                    }

                    {userInfo.parentPhoneNumber &&
                        <Grid container id="userParentInfo" spacing={2}>
                        <Typography className={classes.p} variant="body1" component="p">
                                <strong>Foresatt:&nbsp;</strong>{userInfo.parentFirstName}&nbsp;{userInfo.parentLastName}
                            </Typography>

                        <Typography className={classes.p} variant="body1" component="p">
                                <strong>Foresatt telefon:&nbsp;</strong>{userInfo.parentPhoneNumber}
                            </Typography>

                        <Typography className={classes.p} variant="body1" component="p">
                                <strong>Foresatt epost:&nbsp;</strong>{userInfo.parentEMail}
                            </Typography>
                        </Grid>
                    }

                    <Typography className={classes.p} variant="body1" component="p">
                        <strong>Lag/klan:&nbsp;</strong>{userInfo.team}
                    </Typography>

                    <Typography className={classes.p} variant="body1" component="p">
                        <strong>Tilleggsinformasjon:&nbsp;</strong>{userInfo.comments}
                    </Typography>


                    <Button variant="contained" color="primary">
                        Endre
                    </Button>

                </>)}

                {!isReady && ((<CircularProgress />))}

            </CardContent>
        </Card >
    );
}

