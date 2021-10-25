import { Button, Dialog, DialogTitle, Grid, Paper, Snackbar, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
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

export default function EditUsername({ dialogEditUsernameOpen, handleDialogEditUsernameClose, setAlertOpen, triggerUpdate }) {
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const classes = useStyles();

    const { isAuthenticated, token } = useAuth();

    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    const cacheTestUserName = (asyncValidate) => {
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

    const checkUserNameAsync = async (value) => {
        const responseCheck = await fetch(`/api/users/checkusername/${value}`, {
            headers: {
                'content-type': 'application/json',
            },
        });
        const result = await responseCheck.json();
        return !result.isUnavailable;
    };

    const usernameUnique = useRef(cacheTestUserName(checkUserNameAsync));

    const usernameSchema = yup.object().shape({
        username: yup.string().required('Fyll inn et brukernavn').test('username', 'Brukernavn er allerede i bruk', usernameUnique.current),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
        },
        onSubmit: async (values, e) => {
            if (isAuthenticated) {
                const response = await fetch('/api/users/updateusername', {
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
                    handleDialogEditUsernameClose();
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
        validationSchema: usernameSchema,
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

            <Dialog open={dialogEditUsernameOpen} onClose={handleDialogEditUsernameClose}>
                <Paper className={classes.paper}>
                    <DialogTitle>Sett nytt brukernavn</DialogTitle>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="flex-start" className={classes.root}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="username"
                                    name="username"
                                    label="Nytt brukernavn"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
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
