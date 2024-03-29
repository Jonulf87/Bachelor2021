﻿import {
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import useAuth from '../../hooks/useAuth';
import usePurchase from '../../hooks/usePurchase';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) =>
    createStyles({
        unChecked: {
            backgroundColor: 'rgba(255, 0, 0, 0.3)',
        },

        checked: {
            backgroundColor: 'rgba(0, 255, 0, 0.3)',
        },
    }),
);

export default function TicketPurchaseSummary() {
    const [userData, setUserData] = useState(null);
    const [eventName, setEventName] = useState(null);
    const [open, setOpen] = useState(false);

    const { isAuthenticated, token } = useAuth();
    const { shoppingCart, selectedMainEventId, totalPrice, setCheckedEula, checkedEula } = usePurchase();

    const classes = useStyles();

    useEffect(() => {
        const getUserData = async () => {
            const responseUser = await fetch('/api/users/currentuser', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
            });
            const resultUser = await responseUser.json();
            setUserData(resultUser);

            const responseEvent = await fetch(`/api/events/getmainevent/${selectedMainEventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
            });
            const resultEventName = await responseEvent.json();
            setEventName(resultEventName);
        };
        getUserData();
    }, [isAuthenticated]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const shoppingCartUnique = [...new Set(shoppingCart.map((a) => a.descriptionName))];

    return (
        <>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Regler:</DialogTitle>
                <DialogContent dividers>
                    <Typography>1. Ingen mat ved stolen</Typography>
                    <Typography>2. Ikke snakke stygt</Typography>
                    <Typography>3.For øvrig kan man gjøre hva man vil</Typography>
                </DialogContent>
            </Dialog>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            {userData ? (
                                <>
                                    <Typography variant="h6">
                                        <strong>Personalia:</strong>
                                    </Typography>

                                    <Typography variant="body1" component="p">
                                        <strong>Navn:&nbsp;</strong>
                                        {userData.firstName}&nbsp;{userData.lastName}
                                    </Typography>

                                    <Typography variant="body1" component="p">
                                        <strong>Fødselsdato:&nbsp;</strong>
                                        {format(parseISO(userData.dateOfBirth), 'dd.MM.yyyy')}
                                    </Typography>

                                    <Typography variant="body1" component="p">
                                        <strong>E-post:&nbsp;</strong>
                                        {userData.eMail}
                                    </Typography>

                                    <Typography variant="body1" component="p">
                                        <strong>Telefon:&nbsp;</strong>
                                        {userData.phoneNumber}
                                    </Typography>
                                </>
                            ) : (
                                <CircularProgress />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            {eventName ? (
                                <Typography variant="h6">Valgte billetter til {eventName.name}:</Typography>
                            ) : (
                                <CircularProgress />
                            )}

                            {shoppingCartUnique ? (
                                shoppingCartUnique.map((ticket) => (
                                    <Typography key={ticket}>
                                        {ticket} x {shoppingCart.filter((a) => a.descriptionName === ticket).length}
                                    </Typography>
                                ))
                            ) : (
                                <CircularProgress />
                            )}
                            <Typography>
                                <strong>Totalt: {totalPrice},-</strong>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={checkedEula ? classes.checked : classes.unChecked}>
                        <CardContent>
                            <FormControlLabel
                                control={<Checkbox checked={checkedEula} onChange={(e) => setCheckedEula(e.target.checked)} />}
                                label={
                                    <>
                                        <span>Jeg har lest og forstått de</span>
                                        <Link onClick={handleOpen} to="#">
                                            {' '}
                                            vilkår og regler
                                        </Link>
                                        <span> som gjelder for dette arrangement</span>
                                    </>
                                }
                            />
                        </CardContent>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
