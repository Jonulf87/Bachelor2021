import { Button, Dialog, DialogTitle, Grid, makeStyles, Paper, Snackbar, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import React, { useState } from 'react';
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

export default function EditUserPassword({ dialogEditUserPasswordOpen, handleDialogEditUserPasswordClose, setAlertOpen }) {
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const classes = useStyles();

    const { isAuthenticated, token } = useAuth();

    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    const passwordSchema = yup.object().shape({
        oldPassword: yup.string().min(12, 'Minimum 12 karakterer i passordet').required('Du må fylle i det gamle passordet ditt'),
        newPassword: yup.string().min(12, 'Minimum 12 karakterer i passordet').required('Oppgi et gyldig passord'),
        checkNewPassword: yup
            .string()
            .oneOf([yup.ref('newPassword')], 'Passordene er ikke like')
            .required('Gjenta passord'),
    });

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            checkNewPassword: '',
        },
        onSubmit: async (values, e) => {
            if (isAuthenticated) {
                const response = await fetch('/api/users/updatepassword', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                    method: 'PUT',
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    setAlertOpen(true);
                    handleDialogEditUserPasswordClose();
                } else if (response.status === 400) {
                    const errorResult = await response.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                } else {
                    const errorResult = await response.json();
                    setError(errorResult.Message);
                    setErrorDialogOpen(true);
                }
            }
        },
        validationSchema: passwordSchema,
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

            <Dialog open={dialogEditUserPasswordOpen} onClose={handleDialogEditUserPasswordClose}>
                <Paper className={classes.paper}>
                    <DialogTitle>Sett nytt passord</DialogTitle>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="flex-start" className={classes.root}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="oldPassword"
                                    name="oldPassword"
                                    label="Gammelt passord"
                                    value={formik.values.oldPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                                    helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                                ></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="newPassword"
                                    name="newPassword"
                                    label="Nytt passord"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                                ></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="checkNewPassword"
                                    name="checkNewPassword"
                                    label="Gjenta nytt passord"
                                    value={formik.values.checkNewPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.checkNewPassword && Boolean(formik.errors.checkNewPassword)}
                                    helperText={formik.touched.checkNewPassword && formik.errors.checkNewPassword}
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
