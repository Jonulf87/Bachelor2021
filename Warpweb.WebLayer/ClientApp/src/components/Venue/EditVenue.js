import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, Divider, Grid, Hidden, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';
import { useFormik } from 'formik';
import * as yup from 'yup';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            width: '100%',
        },
        '& .MuiFormControl-root': {
            width: '100%',
        },
        '& .MuiFormControlLabel-root': {
            width: '100%',
        },
    },
    paper: {
        padding: '10px',
    },
}));

export default function EditVenue({ venueId, dialogEditVenueOpen, handleDialogEditVenueClose, triggerUpdate, venues }) {
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

    const checkVenueName = (value) => {
        if (venues.some((a) => a.name === value && a.organizerId === formik.values.organizerId)) {
            return false;
        } else {
            return true;
        }
    };

    const editVenueSchema = yup.object().shape({
        organizerId: yup.number().required('Du må være tilknyttet en organisasjon'),
        name: yup.string().required('Du må oppgi et navn').test('checkName', 'Navnet er allerede registrert', checkVenueName),
        address: yup.string().required('Du må oppgi en adresse'),
        postalCode: yup
            .string()
            .matches(/^\d{4}$/, 'Fyll inn gyldig postnummer')
            .required('Fyll inn postnummer'),
        contactName: yup.string().required('Du må oppgi et navn'),
        contactEMail: yup.string().email('Ikke en gyldig e-post').required('Fyll inn e-post'),
        contactPhone: yup
            .string()
            .matches(/^((\+|00)47[-]?)?\d{8}$/, 'Fyll inn gyldig norsk telefonnummer')
            .required('Fyll inn telefonnummer'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            organizerId: venue?.organizerId || '',
            name: venue?.name || '',
            address: venue?.address || '',
            postalCode: venue?.postalCode || '',
            contactName: venue?.contactName || '',
            contactEMail: venue?.contactEMail || '',
            contactPhone: venue?.contactPhone || '',
        },
        onSubmit: async (values, e) => {
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
                    handleDialogEditVenueClose();
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
        },
        validationSchema: editVenueSchema,
    });

    return (
        <>
            <PopupWindow
                open={errorDialogOpen}
                handleClose={handleErrorDialogClose}
                error={error}
                clearError={setError}
                errors={errors}
                clearErrors={setErrors}
            />
            <Dialog open={dialogEditVenueOpen} onClose={handleDialogEditVenueClose}>
                <Paper className={classes.paper}>
                    <DialogTitle>Endre lokale</DialogTitle>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="flex-start" className={classes.root}>
                            <Hidden xsUp xlDown>
                                <Grid item xs={12}>
                                    <TextField
                                        hidden
                                        required
                                        id="organizerId"
                                        name="organizerId"
                                        label="OrgId"
                                        value={formik.values.organizerId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.organizerId && Boolean(formik.errors.organizerId)}
                                        helperText={formik.touched.organizerId && formik.errors.organizerId}
                                    />
                                </Grid>
                            </Hidden>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="name"
                                    name="name"
                                    label="Navn"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="address"
                                    name="address"
                                    label="adresse"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="postalCode"
                                    name="postalCode"
                                    label="Postnummer"
                                    value={formik.values.postalCode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                                    helperText={formik.touched.postalCode && formik.errors.postalCode}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="contactName"
                                    name="contactName"
                                    label="Kontaktperson"
                                    value={formik.values.contactName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.contactName && Boolean(formik.errors.contactName)}
                                    helperText={formik.touched.contactName && formik.errors.contactName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="contactEMail"
                                    name="contactEMail"
                                    label="E-post kontakt"
                                    value={formik.values.contactEMail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.contactEMail && Boolean(formik.errors.contactEMail)}
                                    helperText={formik.touched.contactEMail && formik.errors.contactEMail}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="contactPhone"
                                    name="contactPhone"
                                    label="Telefon kontakt"
                                    value={formik.values.contactPhone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.contactPhone && Boolean(formik.errors.contactPhone)}
                                    helperText={formik.touched.contactPhone && formik.errors.contactPhone}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" type="submit">
                                    Lagre
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Dialog>
        </>
    );
}
