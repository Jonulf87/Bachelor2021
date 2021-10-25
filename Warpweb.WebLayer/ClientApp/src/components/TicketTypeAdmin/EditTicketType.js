import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, Paper, TextField, Grid, Hidden } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
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

export default function EditTicketType({
    ticketTypeId,
    dialogEditTicketTypeOpen,
    handleDialogEditTicketTypeClose,
    updateListTrigger,
    ticketTypes,
}) {
    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [ticketType, setTicketType] = useState('');
    const { isAuthenticated, token } = useAuth();
    const classes = useStyles();

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    useEffect(() => {
        const getTicketType = async () => {
            if (isAuthenticated) {
                const responseTicketType = await fetch(`/api/tickettypes/type/${ticketTypeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });

                if (responseTicketType.ok) {
                    const resultTicketType = await responseTicketType.json();
                    setTicketType(resultTicketType);
                } else if (responseTicketType.status === 400) {
                    const errorResult = await responseTicketType.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                } else {
                    const errorResult = await responseTicketType.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        };
        getTicketType();
    }, [isAuthenticated]);

    const checkTicketTypeName = (value) => {
        if (ticketTypes.some((a) => a.descriptionName === value)) {
            return false;
        } else {
            return true;
        }
    };

    const createTicketSchema = yup.object().shape({
        id: yup.number().required(`Du må ha ID'en til bilettypen`),
        descriptionName: yup
            .string()
            .required('Fyll inn navn på bilettype')
            .test('checkName', 'Billettype allerede registrert', checkTicketTypeName),
        basePrice: yup.number().required('Oppgi grunnpris'),
        amountAvailable: yup.number().required('Oppgi antall tilgjengelig billetter av typen'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: ticketType?.id || '',
            descriptionName: ticketType?.descriptionName || '',
            basePrice: ticketType?.basePrice || '',
            amountAvailable: ticketType?.amountAvailable || '',
        },
        onSubmit: async (values, e) => {
            if (isAuthenticated) {
                const response = await fetch('api/tickettypes/updatetickettype', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                    method: 'PUT',
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    updateListTrigger();
                } else if (response.status === 400) {
                    const errorResult = await response.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                } else {
                    const errorResult = await response.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
                handleDialogEditTicketTypeClose();
            }
        },
        validationSchema: createTicketSchema,
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
            <Dialog open={dialogEditTicketTypeOpen} onClose={handleDialogEditTicketTypeClose}>
                <Paper className={classes.paper}>
                    <DialogTitle>Ny billettype</DialogTitle>

                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="flexStart" className={classes.root}>
                            <Hidden xsUp xlDown>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="id"
                                        name="id"
                                        value={formik.values.id}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.id && Boolean(formik.errors.id)}
                                        helperText={formik.touched.id && formik.errors.id}
                                    />
                                </Grid>
                            </Hidden>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="descriptionName"
                                    name="descriptionName"
                                    label="Navn billettype"
                                    value={formik.values.descriptionName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.descriptionName && Boolean(formik.errors.descriptionName)}
                                    helperText={formik.touched.descriptionName && formik.errors.descriptionName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="basePrice"
                                    name="basePrice"
                                    label="Grunnpris"
                                    type="number"
                                    value={formik.values.basePrice}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.basePrice && Boolean(formik.errors.basePrice)}
                                    helperText={formik.touched.basePrice && formik.errors.basePrice}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="amountAvailable"
                                    name="amountAvailable"
                                    label="Antall"
                                    type="number"
                                    value={formik.values.amountAvailable}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.amountAvailable && Boolean(formik.errors.amountAvailable)}
                                    helperText={formik.touched.amountAvailable && formik.errors.amountAvailable}
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
