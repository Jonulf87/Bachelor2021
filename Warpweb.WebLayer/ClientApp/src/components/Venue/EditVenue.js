import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, Divider, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            padding: theme.spacing(1),
            width: '100%',
        },
    },
}));

export default function EditVenue({ venueId, dialogEditVenueOpen, handleDialogEditVenueClose, triggerUpdate }) {
    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    const [venue, setVenue] = useState('');

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getVenue = async () => {
            if (isAuthenticated) {
                const response = await fetch(`/api/venues/getvenue/${venueId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setVenue(result);
                } else if (response.status === 400) {
                    const errorResult = await response.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                } else {
                    const errorResult = await response.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        };
        getVenue();
    }, [isAuthenticated]);

    const submitForm = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            const response = await fetch('/api/venues/updatevenue', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify(venue),
            });
            if (response.ok) {
                triggerUpdate();
            } else if (response.status === 400) {
                const errorResult = await response.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            } else {
                const errorResult = await response.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
            handleDialogEditVenueClose();
        }
    };

    return (
        <Dialog open={dialogEditVenueOpen} onClose={handleDialogEditVenueClose}>
            <PopupWindow
                open={errorDialogOpen}
                handleClose={handleErrorDialogClose}
                error={error}
                clearError={setError}
                errors={errors}
                clearErrors={setErrors}
            />

            <Paper>
                <DialogTitle>Endre lokale</DialogTitle>
                <form className={classes.root} onSubmit={submitForm}>
                    <TextField
                        variant="outlined"
                        id="venueName"
                        label="Navn"
                        required
                        value={venue.name}
                        onChange={(e) => setVenue((oldValues) => ({ ...oldValues, name: e.target.value }))}
                    />
                    <TextField
                        variant="outlined"
                        id="venueAddress"
                        label="Adresse"
                        required
                        value={venue.address}
                        onChange={(e) => setVenue((oldValues) => ({ ...oldValues, address: e.target.value }))}
                    />
                    <TextField
                        variant="outlined"
                        id="venuePostalCode"
                        label="Postnummer"
                        required
                        value={venue.postalCode}
                        onChange={(e) => setVenue((oldValues) => ({ ...oldValues, postalCode: e.target.value }))}
                    />
                    <Divider style={{ marginBottom: '8px', marginTop: '8px' }} />
                    <Typography>Kontakt</Typography>

                    <TextField
                        variant="outlined"
                        id="contactName"
                        label="Navn"
                        required
                        value={venue.contactName}
                        onChange={(e) => setVenue((oldValues) => ({ ...oldValues, contactName: e.target.value }))}
                    />
                    <TextField
                        variant="outlined"
                        id="contactEMail"
                        label="E-post"
                        required
                        value={venue.contactEMail}
                        onChange={(e) => setVenue((oldValues) => ({ ...oldValues, contactEMail: e.target.value }))}
                    />
                    <TextField
                        variant="outlined"
                        id="contactPhone"
                        label="Telefon"
                        required
                        value={venue.contactPhone}
                        onChange={(e) => setVenue((oldValues) => ({ ...oldValues, contactPhone: e.target.value }))}
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Lagre
                    </Button>
                </form>
            </Paper>
        </Dialog>
    );
}
