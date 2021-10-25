import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Button, Dialog, DialogTitle, FormControl, TextField, MenuItem, Container, Paper, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
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

export default function CreateVenue({ handleDialogCreateVenueClose, dialogCreateVenueOpen, triggerUpdate, venues }) {
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [organizers, setOrganizers] = useState([]);
    const [organizerId, setOrganizerId] = useState(null);

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();

    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    useEffect(() => {
        const getOrganizers = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/tenants/getaorgsadmin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                setOrganizers(result);
                if (result.length === 1) {
                    setOrganizerId(result[0].id);
                }
            }
        };
        getOrganizers();
    }, [isAuthenticated]);

    const checkVenueName = (value) => {
        if (venues.some((a) => a.name === value && a.organizerId === formik.values.organizerId)) {
            return false;
        } else {
            return true;
        }
    };

    const createVenueSchema = yup.object().shape({
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
        initialValues: {
            organizerId: organizerId || '',
            name: '',
            address: '',
            postalCode: '',
            contactName: '',
            contactEMail: '',
            contactPhone: '',
        },
        onSubmit: async (values, e) => {
            if (isAuthenticated) {
                const response = await fetch(`/api/venues/createvenue`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    triggerUpdate();
                    handleDialogCreateVenueClose();
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
        validationSchema: createVenueSchema,
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
            <Dialog open={dialogCreateVenueOpen} onClose={handleDialogCreateVenueClose} className={classes.root}>
                <Paper className={classes.paper}>
                    <DialogTitle>Nytt lokale</DialogTitle>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="flex-start" className={classes.root}>
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
                            {organizers.length > 1 && (
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        variant="outlined"
                                        id="organizerId"
                                        name="organizerId"
                                        label="Organisasjon"
                                        fullWidth
                                        value={formik.values.organizerId}
                                        onChange={formik.handleChange}
                                    >
                                        {organizers.map((organizer) => (
                                            <MenuItem key={organizer.id} value={organizer.id}>
                                                {organizer.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button className={classes.root} variant="contained" color="primary" type="submit">
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
