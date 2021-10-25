import {
    Button,
    Container,
    Dialog,
    DialogTitle,
    FormControl,
    Grid,
    Paper,
    TextField,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
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

export default function CreateTicketType({ dialogOpen, handleDialogClose, triggerUpdate, ticketTypes }) {
    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const { isAuthenticated, token } = useAuth();
    const classes = useStyles();

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    const checkTicketTypeName = (value) => {
        if (ticketTypes.some((a) => a.descriptionName === value)) {
            return false;
        } else {
            return true;
        }
    };

    const createTicketSchema = yup.object().shape({
        descriptionName: yup
            .string()
            .required('Fyll inn navn på bilettype')
            .test('checkName', 'Billettype allerede registrert', checkTicketTypeName),
        basePrice: yup.number().required('Oppgi grunnpris'),
        amountAvailable: yup.number().required('Oppgi antall tilgjengelig billetter av typen'),
    });

    const formik = useFormik({
        initialValues: {
            descriptionName: '',
            basePrice: '',
            amountAvailable: '',
        },
        onSubmit: async (values, e) => {
            if (isAuthenticated) {
                const response = await fetch('/api/tickettypes/createtickettype', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(values),
                });

                if (response.ok) {
                    triggerUpdate();
                    handleDialogClose();
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
            <Dialog open={dialogOpen} onClose={handleDialogClose} className={classes.root}>
                <Paper className={classes.paper}>
                    <DialogTitle>Ny billettype</DialogTitle>

                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="flex-start" className={classes.root}>
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
