import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';

import {
    Select,
    FormControl,
    InputLabel,
    TextField,
    Button,
    Grid,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Typography,
    Paper,
    Container,
    Collapse,
    Toolbar,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useParams } from 'react-router-dom';

import { intervalToDuration } from 'date-fns/esm/fp';
import PopupWindow from '../PopupWindow/PopupWindow';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { DatePicker } from '@mui/lab';

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

export default function UserRegister() {
    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [isRegistered, setIsRegistered] = useState(false);
    const [showParents, setShowParents] = useState(false);

    const { ticket } = useParams();
    const classes = useStyles();

    //Metode for error popup vindu
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

    const checkEmailAsync = async (value) => {
        const responseCheck = await fetch(`/api/users/checkemail/${value}`, {
            headers: {
                'content-type': 'application/json',
            },
        });
        const result = await responseCheck.json();
        return !result.isUnavailable;
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

    const emailUnique = useRef(cacheTestEMail(checkEmailAsync));
    const userNameUnique = useRef(cacheTestUserName(checkUserNameAsync));

    const registerSchema = yup.object().shape({
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
        eMail: yup
            .string()
            .email('Fyll inn gyldig e-post')
            .required('Fyll inn e-post')
            .test('checkEMail', 'E-post er allerede i bruk', emailUnique.current),
        userName: yup
            .string()
            .required('Fyll inn et brukernavn')
            .test('checkUserName', 'Brukernavn er allerede i bruk', userNameUnique.current),
        password: yup.string().min(12, 'Minimum 12 karakterer i passordet').required('Oppgi et passord'),
        passwordCheck: yup
            .string()
            .oneOf([yup.ref('password')], 'Passordene er ikke like')
            .required('Gjenta passord'),
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
        initialValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            zipCode: '',
            eMail: '',
            userName: '',
            dateOfBirth: null,
            gender: 'Vil ikke oppgi',
            isAllergic: false,
            allergyDescription: '',
            comments: '',
            team: '',
            password: '',
            passwordCheck: '',
            parentFirstName: '',
            parentLastName: '',
            parentPhoneNumber: '',
            parentEMail: '',
        },
        onSubmit: async (values, e) => {
            console.log(values);
            const response = await fetch('/api/users/register', {
                headers: {
                    'content-type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(values),
            });
            //If setninger for error popupvindu
            if (response.ok) {
                setIsRegistered(true);
            } else if (response.status === 400) {
                const errorResult = await response.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            } else {
                const errorResult = await response.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        },
        validationSchema: registerSchema,
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

    useEffect(() => {
        const showParents = () => {
            const diff = intervalToDuration({
                start: new Date(formik.values.dateOfBirth),
                end: new Date(),
            });
            if (diff.years < 16) {
                setShowParents(true);
            } else {
                setShowParents(false);
            }
        };
        showParents();
    }, [formik.values.dateOfBirth]);

    if (isRegistered) {
        if (ticket === 1) {
            return <Redirect to={'/userticket/2'} />;
        } else {
            return <Redirect to={'/login'} />;
        }
    }
    //I topp ligger error popupvinduet.
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

            <Container maxWidth="sm">
                <Paper elevation={3} className={classes.paper}>
                    <Toolbar>
                        <Typography variant="h4" component="h1">
                            Opprett bruker
                        </Typography>
                    </Toolbar>

                    <form onSubmit={formik.handleSubmit} noValidate>
                        <Grid container spacing={2} alignItems="flex-start" className={classes.root}>
                            <Grid item xs={12}>
                                <Typography variant="h6" component="h2">
                                    Kontoinformasjon
                                </Typography>
                            </Grid>
                            <Grid xs={12} item>
                                <TextField
                                    required
                                    id="eMail"
                                    name="eMail"
                                    label="E-post"
                                    value={formik.values.eMail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.eMail && Boolean(formik.errors.eMail)}
                                    helperText={formik.touched.eMail && formik.errors.eMail}
                                />
                            </Grid>
                            <Grid xs={12} item>
                                <TextField
                                    required
                                    id="userName"
                                    name="userName"
                                    label="Brukernavn"
                                    value={formik.values.userName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.userName && Boolean(formik.errors.userName)}
                                    helperText={formik.touched.userName && formik.errors.userName}
                                />
                            </Grid>
                            <Grid xs={12} item>
                                <TextField
                                    required
                                    type="password"
                                    id="password"
                                    name="password"
                                    label="Passord"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid xs={12} item>
                                <TextField
                                    required
                                    type="password"
                                    id="passwordCheck"
                                    name="passwordCheck"
                                    label="Gjenta passord"
                                    value={formik.values.passwordCheck}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.passwordCheck && Boolean(formik.errors.passwordCheck)}
                                    helperText={formik.touched.passwordCheck && formik.errors.passwordCheck}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" component="h2">
                                    Personopplysninger
                                </Typography>
                            </Grid>
                            <Grid xs={12} lg={4} item>
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
                            <Grid xs={12} lg={4} item>
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
                            <Grid xs={12} lg={4} item>
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
                            <Grid xs={12} item>
                                <FormControl>
                                    <InputLabel id="gender">Kjønn</InputLabel>
                                    <Select
                                        labelId="gender"
                                        id="gender"
                                        name="gender"
                                        label="Kjønn"
                                        value={formik.values.gender}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        {genders.map((gender) => (
                                            <MenuItem key={gender.value} value={gender.value}>
                                                {gender.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12} item>
                                <DatePicker
                                    autoOk
                                    required
                                    id="dateOfBirth"
                                    label="Fødselsdato"
                                    openTo="year"
                                    views={['year', 'month', 'date']}
                                    disableFuture
                                    format="dd/MM/yyyy"
                                    placeholder="DD/MM/ÅÅÅÅ"
                                    margin="normal"
                                    value={formik.values.dateOfBirth}
                                    onChange={(dob) => {
                                        formik.setFieldValue('dateOfBirth', dob);
                                    }}
                                    helperText={showParents && 'Deltagere under 16 år må oppgi foresatt'}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" component="h2">
                                    Kontaktinfo
                                </Typography>
                            </Grid>
                            <Grid xs={12} item>
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
                            <Grid xs={12} lg={8} item>
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
                            <Grid xs={12} lg={4} item>
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
                            <Grid item xs={12}></Grid>
                            {showParents && (
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" component="h2">
                                            Foresatt informasjon
                                        </Typography>
                                    </Grid>
                                    <Grid xs={12} item>
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
                                    <Grid xs={12} item>
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
                                    <Grid xs={12} item>
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
                                    <Grid xs={12} item>
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
                                            inputProps={{ 'aria-label': 'Har du allergier?' }}
                                            checked={formik.values.isAllergic}
                                            onChange={formik.handleChange}
                                            name="isAllergic"
                                            id="isAllergic"
                                        />
                                    }
                                    label="Jeg er allergisk"
                                />
                            </Grid>
                            {formik.values.isAllergic && (
                                <Grid xs={12} item>
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
                            <Grid xs={12} item>
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
                            <Grid xs={12} item>
                                <TextField
                                    id="team"
                                    name="team"
                                    label="Lag"
                                    value={formik.values.team}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>
                            <Grid xs={12} item>
                                <Button color="primary" variant="contained" size="large" type="submit">
                                    Registrer meg!
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </>
    );
}
