import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { Select, FormControl, InputLabel, TextField, Button, Grid, Checkbox, FormControlLabel, MenuItem, Typography, Paper, Container, Collapse } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useParams } from 'react-router-dom';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { intervalToDuration } from 'date-fns/esm/fp';
import PopupWindow from '../PopupWindow/PopupWindow';
import useAuth from '../../hooks/useAuth';
import { Field, useFormik } from 'formik';
import * as yup from 'yup';

export default function UserRegister() {

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
                body: JSON.stringify(values)
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
        }
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

    //statevariabler til posting av bruker
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [eMail, setEMail] = useState("");
    const [userName, setUserName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [gender, setGender] = useState("");
    const [isAllergic, setIsAllergic] = useState(false);
    const [allergyDescription, setAllergyDescription] = useState("");
    const [comments, setComments] = useState("");
    const [team, setTeam] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    //statevariabler til posting av foresatte
    const [parentFirstName, setParentFirstName] = useState("");
    const [parentLastName, setParentLastName] = useState("");
    const [parentPhoneNumber, setParentPhoneNumber] = useState("");
    const [parentEMail, setParentEMail] = useState("");

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
    const [checkBox, setCheckBox] = useState(false);
    const [open, setOpen] = useState(false);
    const [debouncedUserName, setDebouncedUserName] = useState(userName);
    const [userNameUnavailable, setUserNameUnavailable] = useState(false);

    const { ticket } = useParams();
    const { isAuthenticated, token } = useAuth();

    const classes = useStyles();

    useEffect(() => {
        const debounce = setTimeout(() => {
            setDebouncedUserName(userName);
        }, 400);

        return () => {
            clearTimeout(debounce);
        }
    }, [userName]);

    useEffect(() => {
        if (!debouncedUserName) {
            return;
        }
        const checkUserName = async () => {


            const responseCheck = await fetch(`/api/users/checkusername/${debouncedUserName}`, {
                headers: {
                    'content-type': 'application/json'
                }
            })
            const result = await responseCheck.json();
            setUserNameUnavailable(result.isUnavailable);
        }
        checkUserName();
    }, [debouncedUserName])

    useEffect(() => {
        const checkIsAllergic = () => {
            if (checkBox) {
                setIsAllergic(true);
            }
            else {
                setIsAllergic(false);
            }
        }
        checkIsAllergic();
    }, [checkBox])



    useEffect(() => {
        const checkDateOfBirth = () => {

            const diff = intervalToDuration({
                start: new Date(dateOfBirth),
                end: new Date()
            })

            if (diff.years < 16) {
                setShowParents(true);
            }
            else {
                setShowParents(false);
            }
        }
        checkDateOfBirth();
    }, [dateOfBirth]);


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
                    <TextField
                        id="firstName"
                        name="firstName"
                        label="Fornavn"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    
                    <TextField
                        id="middleName"
                        name="middleName"
                        label="Mellomnavn"
                        value={formik.values.middleName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <TextField
                        id="lastName"
                        name="lastName"
                        label="Etternavn"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <TextField
                        id="eMail"
                        name="eMail"
                        label="E-post"
                        value={formik.values.eMail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <TextField
                        id="userName"
                        name="userName"
                        label="Brukernavn"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <TextField
                        id="password"
                        name="password"
                        label="Passord"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <TextField
                        id="passwordCheck"
                        name="passwordCheck"
                        label="Gjenta passord"
                        value={formik.values.passwordCheck}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <TextField
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Telefon"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <TextField
                        id="address"
                        name="address"
                        label="Adresse"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <TextField
                        id="zipCode"
                        name="zipCode"
                        label="Postnr"
                        value={formik.values.zipCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
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
                            onChange={formik.handleChange}
                            onBLur={formik.handleBlur}
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        id="parentFirstName"
                        name="parentFirstName"
                        label="Foresatte fornavn"
                        value={formik.values.parentFirstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <TextField
                        id="parentLastName"
                        name="parentLastName"
                        label="Foresatte etternavn"
                        value={formik.values.parentLastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <TextField
                        id="parentPhoneNumber"
                        name="parentPhoneNumber"
                        label="Foresatte telefon"
                        value={formik.values.parentPhoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <TextField
                        id="parentEMail"
                        name="parentEMail"
                        label="Foresatte E-post"
                        value={formik.values.parentEMail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <Typography>
                        har du noen allergier?
                    </Typography>
                </form>
            </Paper>
        </Container>
    );
}