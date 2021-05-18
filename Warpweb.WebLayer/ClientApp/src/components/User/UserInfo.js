import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Card, CardContent, Typography, CircularProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { format, parseISO } from 'date-fns';
import useAuth from '../../hooks/useAuth';
import EditUser from './EditUser';
import EditUserPassword from './EditUserPassword';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: 20,
            maxWidth: 650,
        },
        p: {
            fontsize: 14,
            marginBottom: 10,
        },
    }),
);

export default function UserInfo() {
    const [userInfo, setUserInfo] = useState([]);
    const [dialogEditUserOpen, setDialogEditUserOpen] = useState(false);
    const [dialogEditUserPasswordOpen, setDialogEditUserPasswordOpen] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);

    const { isAuthenticated, token } = useAuth();

    const handleDialogEditUserPasswordOpen = () => {
        setDialogEditUserPasswordOpen(true);
    };

    const handleDialogEditUserPasswordClose = () => {
        setDialogEditUserPasswordOpen(false);
    };

    const handleDialogEditUserClose = () => {
        setDialogEditUserOpen(false);
    };

    const handleDialogEditUserOpen = () => {
        setDialogEditUserOpen(true);
    };

    const triggerUpdate = () => {
        setUpdateUser((oldValue) => !oldValue);
    };

    useEffect(() => {
        const getUser = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/users/currentuser', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                });

                const result = await response.json();
                setUserInfo(result);
                setIsReady(true);
            }
        };
        getUser();
    }, [isAuthenticated, updateUser]);

    const classes = useStyles();

    return (
        <>
            <Snackbar
                open={alertOpen}
                autoHideDuration={5000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" color="success" variant="filled">
                    Du har oppdatert passordet ditt
                </Alert>
            </Snackbar>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    {isReady && (
                        <>
                            <Typography gutterBottom variant="h6" component="h2" gutterBottom>
                                Hei {userInfo.firstName}&nbsp;{userInfo.lastName}
                            </Typography>

                            <Typography className={classes.p} variant="body1" component="p">
                                <strong>Fullt navn:&nbsp;</strong>
                                {userInfo.firstName}&nbsp;{userInfo.middleName}&nbsp;{userInfo.lastName}
                            </Typography>

                            <Typography className={classes.p} variant="body1" component="p">
                                <strong>Brukernavn:&nbsp;</strong>
                                {userInfo.userName}
                            </Typography>

                            <Typography className={classes.p} variant="body1" component="p">
                                <strong>E-post:&nbsp;</strong>
                                {userInfo.eMail}
                            </Typography>

                            <Typography className={classes.p} variant="body1" component="p">
                                <strong>Telefon:&nbsp;</strong>
                                {userInfo.phoneNumber}
                            </Typography>

                            <Typography className={classes.p} variant="body1" component="p">
                                <strong>Adresse:&nbsp;</strong>
                                {userInfo.address}
                            </Typography>

                            <Typography className={classes.p} variant="body1" component="p">
                                <strong>Postnr:&nbsp;</strong>
                                {userInfo.zipCode}
                            </Typography>

                            <Typography className={classes.p} variant="body1" component="p">
                                <strong>Kjønn:&nbsp;</strong>
                                {userInfo.gender}
                            </Typography>

                            <Typography className={classes.p} variant="body1" component="p">
                                <strong>Fødselsdato:&nbsp;</strong>
                                {format(parseISO(userInfo.dateOfBirth), 'dd.MM.yyyy')}
                            </Typography>

                            <Typography className={classes.p} variant="body1" component="p">
                                <strong>Allergier:&nbsp;</strong>
                                {userInfo.isAllergic ? 'Ja, jeg er allergisk' : 'Nei, jeg har ingen allergier'}
                            </Typography>

                            {userInfo.isAllergic && (
                                <Typography className={classes.p} variant="body1" component="p">
                                    <strong>Allergier:&nbsp;</strong>
                                    {userInfo.allergyDescription}
                                </Typography>
                            )}

                            {userInfo.parentPhoneNumber && (
                                <>
                                    <Typography className={classes.p} variant="body1" component="p">
                                        <strong>Foresatt:&nbsp;</strong>
                                        {userInfo.parentFirstName}&nbsp;{userInfo.parentLastName}
                                    </Typography>

                                    <Typography className={classes.p} variant="body1" component="p">
                                        <strong>Foresatt telefon:&nbsp;</strong>
                                        {userInfo.parentPhoneNumber}
                                    </Typography>

                                    <Typography className={classes.p} variant="body1" component="p">
                                        <strong>Foresatt epost:&nbsp;</strong>
                                        {userInfo.parentEMail}
                                    </Typography>
                                </>
                            )}

                            {userInfo.team && (
                                <Typography className={classes.p} variant="body1" component="p">
                                    <strong>Lag/klan:&nbsp;</strong>
                                    {userInfo.team}
                                </Typography>
                            )}

                            {userInfo.comments && (
                                <Typography className={classes.p} variant="body1" component="p">
                                    <strong>Tilleggsinformasjon:&nbsp;</strong>
                                    {userInfo.comments}
                                </Typography>
                            )}

                            <Button variant="contained" color="primary" onClick={handleDialogEditUserOpen}>
                                Endre
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleDialogEditUserPasswordOpen}>
                                Endre passord
                            </Button>

                            <EditUserPassword
                                dialogEditUserPasswordOpen={dialogEditUserPasswordOpen}
                                handleDialogEditUserPasswordClose={handleDialogEditUserPasswordClose}
                                setAlertOpen={setAlertOpen}
                            />
                            <EditUser
                                dialogEditUserOpen={dialogEditUserOpen}
                                handleDialogEditUserClose={handleDialogEditUserClose}
                                triggerUpdate={triggerUpdate}
                            />
                        </>
                    )}

                    {!isReady && <CircularProgress />}
                </CardContent>
            </Card>
        </>
    );
}
