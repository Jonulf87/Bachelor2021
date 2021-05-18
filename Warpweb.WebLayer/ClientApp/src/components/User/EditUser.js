import React, { useEffect, useState, useRef } from 'react';
import { Button, Dialog, DialogTitle, Grid, makeStyles, Paper, TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { intervalToDuration } from 'date-fns/esm/fp';
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

export default function EditUser({ dialogEditUserOpen, handleDialogEditUserClose, triggerUpdate }) {
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [showParents, setShowParents] = useState(false);
    const [user, setUser] = useState(null);

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();

    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    useEffect(() => {
        const getUser = async () => {
            if (isAuthenticated) {
                const response = await fetch(`/api/users/currentuser`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                const result = await response.json();
                setUser(result);
            }
        };
        getUser();
    }, [isAuthenticated]);

    const editSchema = yup.object().shape({
        firstName: yup.string().min(2, 'For kort').max(50, 'For langt').required('Du må fylle inn navn'),
        middleName: yup.string(),
        lastName: yup.string().min(2, 'For kort').max(50, 'For langt').required('Du må fylle inn navn'),
        phoneNumber: yup
            .string()
            .matches(/^((\+|00)47[-]?)?\d{8}$/, 'Fyll inn gyldig norsk telefonnummer')
            .required('Fyll inn telefonnummer'),
        address: yup.string().required('Fyll inn adresse'),
        zipCode: yup
            .string()
            .matches(/^\d{4}$/, 'Fyll inn gyldig postnummer')
            .required('Fyll inn postnummer'),
        dateOfBirth: yup.date().nullable().required('Fyll inn fødselsdato'),
        parentFirstName: yup.string().when('dateOfBirth', {
            is: () => {
                const diff = intervalToDuration({
                    start: new Date(formik.values.dateOfBirth),
                    end: new Date(),
                });
                if (diff.years < 16) {
                    return true;
                } else {
                    return false;
                }
            },
            then: yup.string().required('Fyll inn navn på foresatt'),
            otherwise: yup.string(),
        }),
        parentLastName: yup.string().when('dateOfBirth', {
            is: () => {
                const diff = intervalToDuration({
                    start: new Date(formik.values.dateOfBirth),
                    end: new Date(),
                });
                if (diff.years < 16) {
                    return true;
                } else {
                    return false;
                }
            },
            then: yup.string().required('Fyll inn navn på foresatt'),
            otherwise: yup.string(),
        }),
        parentPhoneNumber: yup.string().when('dateOfBirth', {
            is: () => {
                const diff = intervalToDuration({
                    start: new Date(formik.values.dateOfBirth),
                    end: new Date(),
                });
                if (diff.years < 16) {
                    return true;
                } else {
                    return false;
                }
            },
            then: yup
                .string()
                .matches(/^((\+|00)47[-]?)?\d{8}$/, 'Fyll inn gyldig norsk telefonnummer')
                .required('Fyll inn telefonnummer til foresatt'),
            otherwise: yup.string(),
        }),
        parentEMail: yup.string().when('dateOfBirth', {
            is: () => {
                const diff = intervalToDuration({
                    start: new Date(formik.values.dateOfBirth),
                    end: new Date(),
                });
                if (diff.years < 16) {
                    return true;
                } else {
                    return false;
                }
            },
            then: yup.string().email('Fyll inn gyldig e-post').required('Fyll e-post til foresatt'),
            otherwise: yup.string(),
        }),
        isAllergic: yup.bool(),
        allergyDescription: yup.string().when('isAllergic', {
            is: true,
            then: yup.string().required('Fyll inn allergien din for din og vår sikkerhets skyld'),
            otherwise: yup.string(),
        }),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: user?.firstName || '',
            middleName: user?.middleName || '',
            lastName: user?.lastName || '',
            phoneNumber: user?.phoneNumber || '',
            address: user?.address || '',
            zipCode: user?.zipCode || '',
            dateOfBirth: user?.dateOfBirth || null,
            gender: user?.gender || 'Vil ikke oppgi',
            isAllergic: user?.isAllergic || false,
            allergyDescription: user?.allergyDescription || '',
            comments: user?.comments || '',
            team: user?.team || '',
            parentFirstName: user?.parentFirstName || '',
            parentLastName: user?.parentLastName || '',
            parentPhoneNumber: user?.parentPhoneNumber || '',
            parentEMail: user?.parentEMail || '',
        },
        onSubmit: async (values, e) => {
            console.log(values);
            const response = await fetch('/api/users/updateuser', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify(values),
            });
            //If setninger for error popupvindu
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
            handleDialogEditUserClose();
        },
        validationSchema: editSchema,
    });

    const genders = [
        {
            value: 'Gutt',
            label: 'Gutt',
        },
        {
            value: 'Jente',
            label: 'Jente',
        },
        {
            value: 'Annet',
            label: 'Annet',
        },
        {
            value: 'Vil ikke oppgi',
            label: 'Vil ikke oppgi',
        },
    ];

    return (
        <>
            <Dialog open={dialogEditUserOpen} onClose={handleDialogEditUserClose}>
                <PopupWindow
                    open={errorDialogOpen}
                    handleClose={handleErrorDialogClose}
                    error={error}
                    clearError={setError}
                    errors={errors}
                    clearErrors={setErrors}
                />
                <Paper className={classes.paper}>
                    <DialogTitle>Oppdater personalia:</DialogTitle>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="flex-start" className={classes.root}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="firstName"
                                    name="firstName"
                                    label="Fornavn"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="middleName"
                                    name="middleName"
                                    label="Mellomnavn"
                                    value={formik.values.middleName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.middleName && Boolean(formik.errors.middleName)}
                                    helperText={formik.touched.middleName && formik.errors.middleName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="lastName"
                                    name="lastName"
                                    label="Etternavn"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    label="Telefon"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="address"
                                    name="address"
                                    label="Adresse"
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
                                    id="zipCode"
                                    name="zipCode"
                                    label="Postnummer"
                                    value={formik.values.zipCode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                                    helperText={formik.touched.zipCode && formik.errors.zipCode}
                                />
                            </Grid>
                            {user?.parentPhoneNumber && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="parentFirstName"
                                            name="parentFirstName"
                                            label="Foresatte fornavn"
                                            value={formik.values.parentFirstName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.parentFirstName && Boolean(formik.errors.parentFirstName)}
                                            helperText={formik.touched.parentFirstName && formik.errors.parentFirstName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="parentLastName"
                                            name="parentLastName"
                                            label="Foresatte etternavn"
                                            value={formik.values.parentLastName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.parentLastName && Boolean(formik.errors.parentLastName)}
                                            helperText={formik.touched.parentLastName && formik.errors.parentLastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="parentPhoneNumber"
                                            name="parentPhoneNumber"
                                            label="Foresatte telefon"
                                            value={formik.values.parentPhoneNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.parentPhoneNumber && Boolean(formik.errors.parentPhoneNumber)}
                                            helperText={formik.touched.parentPhoneNumber && formik.errors.parentPhoneNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="parentEMail"
                                            name="parentEMail"
                                            label="Foresatte E-post"
                                            value={formik.values.parentEMail}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.parentEMail && Boolean(formik.errors.parentEMail)}
                                            helperText={formik.touched.parentEMail && formik.errors.parentEMail}
                                        />
                                    </Grid>
                                </>
                            )}
                            <Grid xs={12} item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.isAllergic}
                                            onChange={formik.handleChange}
                                            name="isAllergic"
                                            id="isAllergic"
                                        />
                                    }
                                    label="Jeg er allergisk"
                                />
                            </Grid>
                            {user?.isAllergic && (
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="allergyDescription"
                                        name="allergyDescription"
                                        label="Beskrivelse allergi"
                                        value={formik.values.allergyDescription}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.allergyDescription && Boolean(formik.errors.allergyDescription)}
                                        helperText={formik.touched.allergyDescription && formik.errors.allergyDescription}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <TextField
                                    id="team"
                                    name="team"
                                    label="Lag"
                                    value={formik.values.team}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="comments"
                                    name="comments"
                                    label="Kommentarer"
                                    value={formik.values.comments}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText="noe vi bør vite før du deltar på et arrangement?"
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
