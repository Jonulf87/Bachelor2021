import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import {
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Snackbar,
    Paper,
    Container,
    Toolbar,
    CardHeader,
    CardActionArea,
    CardActions,
} from '@mui/material';
import { Alert } from '@mui/material';
import { format, parseISO } from 'date-fns';
import useAuth from '../../hooks/useAuth';
import EditUser from './EditUser';
import EditUserPassword from './EditUserPassword';
import EditUsername from './EditUsername';
import EditUserEMail from './EditUserEMail';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            //maxWidth: '650px',
        },
        p: {
            fontsize: '14px',
            marginBottom: '10px',
        },
        table: {
            width: '100%',
        },
    }),
);

export default function UserInfo() {
    const [userInfo, setUserInfo] = useState([]);
    const [dialogEditUserOpen, setDialogEditUserOpen] = useState(false);
    const [dialogEditUserPasswordOpen, setDialogEditUserPasswordOpen] = useState(false);
    const [dialogEditUsernameOpen, setDialogEditUsernameOpen] = useState(false);
    const [dialogEditUserEMailOpen, setDialogEditUserEMailOpen] = useState(false);
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

    const handleDialogEditUserEMailOpen = () => {
        setDialogEditUserEMailOpen(true);
    };

    const handleDialogEditUserEMailClose = () => {
        setDialogEditUserEMailOpen(false);
    };

    const handleDialogEditUsernameOpen = () => {
        setDialogEditUsernameOpen(true);
    };

    const handleDialogEditUsernameClose = () => {
        setDialogEditUsernameOpen(false);
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
                    Du har oppdatert brukeren din
                </Alert>
            </Snackbar>
            <Card className={classes.root}>
                <CardContent>
                    {isReady && (
                        <>
                            <Typography gutterBottom variant="h6" component="h2">
                                Hei {userInfo.firstName}
                            </Typography>
                            <table className={classes.table}>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" id="fulltnavn">
                                                <strong>Fullt navn:</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" aria-labelledby="fulltnavn">
                                                {userInfo.firstName} {userInfo.middleName} {userInfo.lastName}
                                            </Typography>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" id="brukernavn">
                                                <strong>Brukernavn:</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" aria-labelledby="brukernavn">
                                                {userInfo.userName}
                                            </Typography>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" id="epost">
                                                <strong>E-post:</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" aria-labelledby="epost">
                                                {userInfo.eMail}
                                            </Typography>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" id="tlf">
                                                <strong>Telefon:</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" aria-labelledby="tlf">
                                                {userInfo.phoneNumber}
                                            </Typography>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" id="adr">
                                                <strong>Adresse:</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" aria-labelledby="adr">
                                                {userInfo.address}
                                            </Typography>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" id="postnr">
                                                <strong>Postnr:</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" aria-labelledby="postnr">
                                                {userInfo.zipCode}
                                            </Typography>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" id="kjnn">
                                                <strong>Kjønn:</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" aria-labelledby="kjnn">
                                                {userInfo.gender}
                                            </Typography>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" id="fdag">
                                                <strong>Fødselsdato:</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" aria-labelledby="fdag">
                                                {format(parseISO(userInfo.dateOfBirth), 'dd.MM.yyyy')}
                                            </Typography>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" id="allergisk">
                                                <strong>Allergier:</strong>
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography className={classes.p} variant="body1" component="p" aria-labelledby="allergisk">
                                                {userInfo.isAllergic ? 'Ja, jeg er allergisk' : 'Nei, jeg har ingen allergier'}
                                            </Typography>
                                        </td>
                                    </tr>
                                    {userInfo.isAllergic && (
                                        <tr>
                                            <td>
                                                <Typography className={classes.p} variant="body1" component="p" id="allergier">
                                                    <strong>Allergier:&nbsp;</strong>
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography className={classes.p} variant="body1" component="p" aria-labelledby="allergier">
                                                    {userInfo.allergyDescription}
                                                </Typography>
                                            </td>
                                        </tr>
                                    )}
                                    {userInfo.team && (
                                        <tr>
                                            <td>
                                                <Typography className={classes.p} variant="body1" component="p" id="lag">
                                                    <strong>Lag:&nbsp;</strong>
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography className={classes.p} variant="body1" component="p" aria-labelledby="lag">
                                                    {userInfo.team}
                                                </Typography>
                                            </td>
                                        </tr>
                                    )}
                                    {userInfo.parentPhoneNumber && (
                                        <>
                                            <tr>
                                                <td>
                                                    <Typography className={classes.p} variant="body1" component="p" id="parent">
                                                        <strong>Foresatt:&nbsp;</strong>
                                                    </Typography>
                                                </td>
                                                <td>
                                                    <Typography
                                                        className={classes.p}
                                                        variant="body1"
                                                        component="p"
                                                        aria-labelledby="parent"
                                                    >
                                                        {userInfo.parentFirstName}&nbsp;{userInfo.parentLastName}
                                                    </Typography>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Typography className={classes.p} variant="body1" component="p" id="parentname">
                                                        <strong>Foresatt telefon:&nbsp;</strong>
                                                    </Typography>
                                                </td>
                                                <td>
                                                    <Typography
                                                        className={classes.p}
                                                        variant="body1"
                                                        component="p"
                                                        aria-labelledby="parentname"
                                                    >
                                                        {userInfo.parentPhoneNumber}
                                                    </Typography>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Typography className={classes.p} variant="body1" component="p" id="parentemail">
                                                        <strong>Foresatt epost:&nbsp;</strong>
                                                    </Typography>
                                                </td>
                                                <td>
                                                    <Typography
                                                        className={classes.p}
                                                        variant="body1"
                                                        component="p"
                                                        aria-labelledby="parentemail"
                                                    >
                                                        {userInfo.parentEMail}
                                                    </Typography>
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                    {userInfo.comments && (
                                        <tr>
                                            <td>
                                                <Typography className={classes.p} variant="body1" component="p" id="userinfo">
                                                    <strong>Tilleggsinformasjon:&nbsp;</strong>
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography className={classes.p} variant="body1" component="p" aria-labelledby="userinfo">
                                                    {userInfo.comments}
                                                </Typography>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Button
                                style={{ marginRight: '5px', marginBottom: '5px' }}
                                variant="contained"
                                color="primary"
                                onClick={handleDialogEditUserOpen}
                            >
                                Endre personalia
                            </Button>
                            <Button
                                style={{ marginRight: '5px', marginBottom: '5px' }}
                                variant="contained"
                                color="primary"
                                onClick={handleDialogEditUserPasswordOpen}
                            >
                                Endre passord
                            </Button>
                            <Button
                                style={{ marginRight: '5px', marginBottom: '5px' }}
                                variant="contained"
                                color="primary"
                                onClick={handleDialogEditUsernameOpen}
                            >
                                Endre brukernavn
                            </Button>
                            <Button
                                style={{ marginRight: '5px', marginBottom: '5px' }}
                                variant="contained"
                                color="primary"
                                onClick={handleDialogEditUserEMailOpen}
                            >
                                Endre e-post
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
                            <EditUsername
                                dialogEditUsernameOpen={dialogEditUsernameOpen}
                                handleDialogEditUsernameClose={handleDialogEditUsernameClose}
                                setAlertOpen={setAlertOpen}
                                triggerUpdate={triggerUpdate}
                            />
                            <EditUserEMail
                                dialogEditUserEMailOpen={dialogEditUserEMailOpen}
                                handleDialogEditUserEMailClose={handleDialogEditUserEMailClose}
                                setAlertOpen={setAlertOpen}
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
