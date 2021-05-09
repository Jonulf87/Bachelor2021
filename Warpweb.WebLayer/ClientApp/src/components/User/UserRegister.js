import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { Select, FormControl, InputLabel, TextField, Button, Grid, Checkbox, FormControlLabel, MenuItem, Typography, Paper, Container, Collapse } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { intervalToDuration } from 'date-fns/esm/fp';
import PopupWindow from '../PopupWindow/PopupWindow';
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function UserRegister() {


    const registerSchema = yup.object().shape({
        firstName: yup.string().min(2, 'For kort').max(50, 'For langt').required('Du må fylle inn navn'),
        middleName: yup.string(),
        lastName: yup.string().min(2, 'For kort').max(50, 'For langt').required('Du må fylle inn navn'),
        phoneNumber: yup.string().matches(/^((\+|00)47[-]?)?\d{8}$/, 'Fyll inn gyldig norsk telefonnummer'),
        address: yup.string(),
        zipCode: yup.string().matches(/^\d{4}$/, 'Fyll inn gyldig postnummer'),
        eMail: yup.string().email('Fyll inn gyldig e-post'),
        userName: yup.string().required('Fyll inn et brukernavn').test('checkUserName', 'Brukernavn er allerede i bruk',
            async (value) => {
                const responseCheck = await fetch(`/api/users/checkusername/${value}`, {
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                const result = await responseCheck.json();
                return !result.isUnavailable;
            }),
        password: yup.string().min(12, 'Minimum 12 karakterer i passordet').required(),
        passwordCheck: yup.string().oneOf([yup.ref('password')], 'Passordene er ikke like').required(),
        dateOfBirth: yup.date().nullable().required(),
        parentFirstName: yup.string().when('dateOfBirth', {
            is: () => {
                const diff = intervalToDuration({
                    start: new Date(formik.values.dateOfBirth),
                    end: new Date()
                });
                if (diff.years < 16) {
                    return true;
                }
                else {
                    return false;
                }
            },
            then: yup.string().required(),
            otherwise: yup.string()
        })

    });

    //const diff = intervalToDuration({
    //            start: new Date(dateOfBirth),
    //            end: new Date()
    //        })

    //        if (diff.years < 16) {
    //            setShowParents(true);
    //        }
    //        else {
    //            setShowParents(false);
    //        }


    const formik = useFormik({
        initialValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            phoneNumber: "",
            address: "",
            zipCode: "",
            eMail: "",
            userName: "",
            dateOfBirth: null,
            gender: "",
            isAllergic: false,
            allergyDescription: "",
            comments: "",
            team: "",
            password: "",
            passwordCheck: "",
            parentFirstName: "",
            parentLastName: "",
            parentPhoneNumber: "",
            parentEMail: ""
        },
        onSubmit: async (values) => {
            const response = await fetch('/api/users/register', {
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    ...values, 
                })
            });
            if (response.ok) {
                setIsRegistered(true);
            }
            else {
                const result = await response.json();
                const errorMessages = Object.keys(result.errors).reduce((accumulator, currentValue) => {
                    return accumulator + " " + currentValue + ": " + result.errors[currentValue];
                }, "");
                setError(errorMessages);
                setOpen(true);
            }
        },
        validationSchema: registerSchema 
    })

    // Styling
    const useStyles = makeStyles((theme) => ({
        root: {
            '& .MuiTextField-root': {
                width: "100%",

            },
            '& .MuiFormControl-root': {
                width: "100%",
            },
            '& .MuiFormControlLabel-root': {

                width: "100%"
            },
        },
        paper: {
            padding: "10px"
        }
    }));


    //Kjønn: gutt, jente, annet, ønsker ikke å oppgi
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
        }, {
            value: 'Vil ikke oppgi',
            label: 'Vil ikke oppgi',
        },
    ]

    const [error, setError] = useState();
    const [isRegistered, setIsRegistered] = useState(false);
    const [showParents, setShowParents] = useState(false);
    const [open, setOpen] = useState(false);

    const { ticket } = useParams();

    const classes = useStyles();


    //useEffect(() => {
    //    const checkDateOfBirth = () => {

    //        const diff = intervalToDuration({
    //            start: new Date(dateOfBirth),
    //            end: new Date()
    //        })

    //        if (diff.years < 16) {
    //            setShowParents(true);
    //        }
    //        else {
    //            setShowParents(false);
    //        }
    //    }
    //    checkDateOfBirth();
    //}, [formik.values.dateOfBirth]);


    if (isRegistered) {
        if (ticket == 1) {
            return <Redirect to={'/userticket/2'} />
        }
        else {
            return <Redirect to={'/login'} />
        }
    }

    return (
        <Container maxWidth="sm" >
            <Paper
                elevation={3}
                className={classes.paper}
            >
                <form>
                    <Grid
                        container
                        spacing={2}
                        alignItems="flex-start"
                        className={classes.root}
                    >

                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
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
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
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
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
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
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
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
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
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
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
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
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
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
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
                                id="phoneNumber"
                                name="phoneNumber"
                                label="Telefon"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
                                id="address"
                                name="address"
                                label="Adresse"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
                                id="zipCode"
                                name="zipCode"
                                label="Postnr"
                                value={formik.values.zipCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
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
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    autoOk
                                    required
                                    id="dateOfBirth"
                                    label="Fødselsdato"
                                    openTo="year"
                                    views={["year", "month", "date"]}
                                    disableFuture
                                    format="dd/MM/yyyy"
                                    placeholder="DD/MM/ÅÅÅÅ"
                                    margin="normal"
                                    value={formik.values.dateOfBirth}
                                    onChange={(dob) => { formik.setFieldValue('dateOfBirth', dob) }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
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
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
                                id="parentLastName"
                                name="parentLastName"
                                label="Foresatte etternavn"
                                value={formik.values.parentLastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
                                id="parentPhoneNumber"
                                name="parentPhoneNumber"
                                label="Foresatte telefon"
                                value={formik.values.parentPhoneNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
                                id="parentEMail"
                                name="parentEMail"
                                label="Foresatte E-post"
                                value={formik.values.parentEMail}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <FormControlLabel
                                control={<Checkbox
                                    checked={formik.values.isAllergic}
                                    onChange={formik.handleChange}
                                    name="isAllergic"
                                    id="isAllergic"
                                />}
                                label="Jeg er allergisk"
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
                                id="allergyDescription"
                                name="allergyDescription"
                                label="Beskrivelse allergi"
                                value={formik.values.allergyDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            lg={4}
                            item
                        >
                            <TextField
                                id="comments"
                                name="comments"
                                label="Kommentarer"
                                value={formik.values.comments}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}