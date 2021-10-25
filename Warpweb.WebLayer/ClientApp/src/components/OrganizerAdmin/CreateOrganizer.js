import React, { useState, useRef } from 'react';
import { Dialog, Paper, TextField, Button, Grid, DialogTitle } from '@mui/material';
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

export default function CreateOrganizer({ handleDialogCreateOrganizerClose, dialogCreateOrganizerOpen, triggerUpdate }) {
    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();

    const cacheTestOrgNumber = (asyncValidate) => {
        let _valid = false;
        let _value = '';
        let _timeoutId = 0;

        return async (value) => {
            if (value === undefined) {
                clearTimeout(_timeoutId);
                return true;
            }
            if (value !== _value) {
                return new Promise(async (resolve) => {
                    clearTimeout(_timeoutId);
                    _timeoutId = setTimeout(async () => {
                        const response = await asyncValidate(value);
                        _value = value;
                        _valid = response;
                        resolve(response);
                    }, 400);
                });
            }
            return _valid;
        };
    };

    const checkOrgNumberAsync = async (value) => {
        const responseCheck = await fetch(`/api/tenants/checkorgnumber/${value}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'application/json',
            },
        });
        const result = await responseCheck.json();
        return !result.isUnavailable;
    };

    const orgNumberUnique = useRef(cacheTestOrgNumber(checkOrgNumberAsync));

    const createOrgSchema = yup.object().shape({
        name: yup.string().required('Oppgi et navn'),
        orgNumber: yup
            .string()
            .matches(/^\d{11}$/, 'Org.nummer skal inneholde 11 siffer')
            .test('orgNumberCheck', 'Org. nummeret er allerede registrert', orgNumberUnique.current)
            .required('Oppgi organisasjonsnummer'),
        description: yup.string().required('Fyll inn en beskrivelse av organisasjonen'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            orgNumber: '',
            description: '',
        },
        onSubmit: async (values, e) => {
            if (isAuthenticated) {
                const response = await fetch('api/tenants/addorganizer', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(values),
                });
                if (response.status === 200) {
                    triggerUpdate();
                    handleDialogCreateOrganizerClose();
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
        validationSchema: createOrgSchema,
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
            <Dialog open={dialogCreateOrganizerOpen} onClose={handleDialogCreateOrganizerClose}>
                <Paper className={classes.paper}>
                    <DialogTitle>Ny organisasjon</DialogTitle>
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
                                    id="orgNumber"
                                    name="orgNumber"
                                    label="Organisasjonsnummer"
                                    value={formik.values.orgNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.orgNumber && Boolean(formik.errors.orgNumber)}
                                    helperText={formik.touched.orgNumber && formik.errors.orgNumber}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="description"
                                    name="description"
                                    label="Beskrivelse"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
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
