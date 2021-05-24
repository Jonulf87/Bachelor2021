import { Button, Dialog, DialogTitle, Grid, makeStyles, Paper, Snackbar, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import React, { useState, useRef } from 'react';
import * as yup from 'yup';
import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';

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

export default function EditUserEMail({ dialogEditUserEMailOpen, handleDialogEditUserEMailClose, setAlertOpen, triggerUpdate }) {
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const classes = useStyles();

    const { isAuthenticated, token } = useAuth();

    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    const cacheTestEMail = (asyncValidate) => {
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

    const checkEmailAsync = async (value) => {
        const responseCheck = await fetch(`/api/users/checkemail/${value}`, {
            headers: {
                'content-type': 'application/json',
            },
        });
        const result = await responseCheck.json();
        return !result.isUnavailable;
    };

    const emailUnique = useRef(cacheTestEMail(checkEmailAsync));

    const eMailSchema = yup.object().shape({
        eMail: yup
            .string()
            .email('Fyll inn gyldig e-post')
            .required('Fyll inn e-post')
            .test('checkEMail', 'E-post er allerede i bruk', emailUnique.current),
    });

    const formik = useFormik({
        initialValues: {
            eMail: '',
        },
        onSubmit: async (values, e) => {
            if (isAuthenticated) {
                const response = await fetch('/api/users/updateemail', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                    method: 'PUT',
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    setAlertOpen(true);
                    triggerUpdate();
                    handleDialogEditUserEMailClose();
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
        validationSchema: eMailSchema,
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

            <Dialog open={dialogEditUserEMailOpen} onClose={handleDialogEditUserEMailClose}>
                <Paper className={classes.paper}>
                    <DialogTitle>Sett ny e-post adresse</DialogTitle>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="flex-start" className={classes.root}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="eMail"
                                    name="eMail"
                                    label="Ny e-post"
                                    value={formik.values.eMail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.eMail && Boolean(formik.errors.eMail)}
                                    helperText={formik.touched.eMail && formik.errors.eMail}
                                ></TextField>
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
