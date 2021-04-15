import React, { useEffect, useState } from 'react';
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
    Collapse
} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { intervalToDuration } from 'date-fns/esm/fp';
import PopupWindow from '../PopupWindow/PopupWindow';

export default function UserRegister() {

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
    const [dateOfBirth, setDateOfBirth] = useState(new Date("1990-01-01T00:00:00"));
    const [gender, setGender] = useState("");
    const [isAllergic, setIsAllergic] = useState(false);
    const [allergyDescription, setAllergyDescription] = useState("");
    const [comments, setComments] = useState("");
    const [team, setTeam] = useState("");
    const [password, setPassword] = useState("");

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

    const classes = useStyles();

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

    const submitForm = async () => {

        const userDataToBeSent = {
            'firstName': firstName,
            'middleName': middleName,
            'lastName': lastName,
            'phoneNumber': phoneNumber,
            'address': address,
            'zipCode': zipCode,
            'eMail': eMail,
            'userName': userName,
            'dateOfBirth': dateOfBirth,
            'gender': gender,
            'isAllergic': isAllergic,
            'allergyDescription': allergyDescription,
            'comments': comments,
            'team': team,
            'password': password,
            'parentFirstName': parentFirstName,
            'parentLastName': parentLastName,
            'parentPhoneNumber': parentPhoneNumber,
            'parentEMail': parentEMail
        }

        const response = await fetch('/api/users/register', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(userDataToBeSent)
        });
        if (response.ok) {
            setIsRegistered(true);
        }
        else {
            setError(await response.text());
            setOpen(true);
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        submitForm();
    };

    if (isRegistered) {
        return <Redirect to={'/login?userName=' + userName} />
    }

    return (
        <Container maxWidth="sm" >
            <Paper
                elevation={0}
                variant="outlined"
                className={classes.paper}
            >
                <ValidatorForm
                    autoComplete="off"
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <Grid alignItems="center" className={classes.root} container spacing={2} >

                        <PopupWindow open={open} onClose={() => setOpen(false)} text={error} />

                        <Grid item xs={12}>
                            <Typography variant="h6" component="h3">Fullt Navn</Typography>{/*usikker på om disse skal brukes of evt hvordan grupperes */}
                        </Grid>
                        <Grid item xs={12} lg={4} >
                            <TextValidator
                                variant="outlined"
                                id="firstName"
                                label="Fornavn"
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                validators={['matchRegexp:^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-]+$', 'minStringLength:1', 'trim']}
                                errorMessages={['Navn må oppgis', 'Ugyldig navn', 'Ugyldig navn', 'Ugyldig navn']}
                            />
                        </Grid>
                        <Grid item xs={12} lg={4} >
                            <TextValidator
                                variant="outlined"
                                id="middleName"
                                label="Mellomnavn"
                                type="text"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                validators={['matchRegexp:^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-]*$']}
                                errorMessages={['Ugyldig mellomnavn']}
                            />
                        </Grid>
                        <Grid item xs={12} lg={4} >
                            <TextValidator
                                variant="outlined"
                                id="lastName"
                                label="Etternavn"
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                validators={['required', 'matchRegexp:^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-]+$', 'minStringLength:1', 'trim']}
                                errorMessages={['Etternavn må oppgis', 'Ugyldig etternavn', 'Ugyldig etternavn', 'Ugyldig etternavn']}
                            />
                        </Grid>
                        <Grid item container xs={12}>
                            <Typography variant="h6" component="h3">Brukerinfo</Typography>
                        </Grid>
                        <Grid item xs={12}>{/*Input epost*/}
                            <TextValidator
                                variant="outlined"
                                id="eMail"
                                label="Epost"
                                type="email"
                                required
                                value={eMail}
                                onChange={(e) => setEMail(e.target.value)}
                                validators={['required', 'isEmail']}
                                errorMessages={['Epost må oppgis', 'Ugyldig epost']}
                            />
                        </Grid>

                        <Grid item xs={12}>{/*Input brukernavn*/}
                            <TextValidator
                                variant="outlined"
                                id="userName"
                                label="Brukernavn"
                                type="text"
                                required
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                validators={['required']}
                                errorMessages={['Brukernavn må oppgis']}
                            />
                        </Grid>
                        <Grid item xs={12}>{/*Input passord*/}
                            <TextValidator
                                variant="outlined"
                                id="password"
                                label="Passord"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                validators={['required', 'minStringLength:10', 'matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.{10,})']}
                                errorMessages={['Passord må oppgis', 'Passord må bestå av minst 10 tegn', 'Passord må bestå av minst 10 tegn']}
                            // matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*_])(?=.{14,}) - Regex for 14 tegn - sifre, både store og små bokstaver og symboler
                            />
                        </Grid>
                        <Grid item xs={12} >{/*Input telefon*/}
                            <TextValidator
                                variant="outlined"
                                id="phoneNumber"
                                label="Telefon"
                                type="tel"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                validators={['required', 'matchRegexp:^[0-9]{8}$']}
                                errorMessages={['Telefonnummer må oppgis', 'Ugyldig telefonnummer']}
                            />
                        </Grid>{/*Input adresse og postnummer*/}
                        <Grid item xs={12} md={9}>
                            <TextValidator
                                variant="outlined"
                                id="address"
                                label="Adresse"
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                validators={['required']}
                                errorMessages={['Adresse må oppgis']}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextValidator
                                variant="outlined"
                                id="zipCode"
                                label="Postnummer"
                                type="text"
                                required
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                validators={['required', 'matchRegexp:^[0-9]{4}$']}
                                errorMessages={['Postnummer må oppgis', 'Postnummer må inneholde 4 sifre']}
                            />
                        </Grid>
                        <Grid item xs={12} >{/*Input kjønn*/}
                            <FormControl variant="outlined">
                                <InputLabel id="gender">Kjønn</InputLabel>
                                <Select
                                    labelId="gender"
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    label="Kjønn"
                                >
                                    {genders.map((gender) => (
                                        <MenuItem key={gender.value} value={gender.value}>
                                            {gender.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} >{/*Input fødselsdag*/}
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    id="dateOfBirth"
                                    label="Fødselsdato"
                                    format="dd/MM/yyyy"
                                    inputVariant="outlined"
                                    margin="normal"
                                    value={dateOfBirth}
                                    onChange={(dateEvent) => setDateOfBirth(dateEvent)}
                                />
                            </MuiPickersUtilsProvider>

                        </Grid>
                        {/*Input forelder*/}
                        {showParents &&
                            <>
                                <Grid item xs={12} >
                                    <TextValidator
                                        variant="outlined"
                                        id="firstName"
                                        label="Foresatte fornavn"
                                        type="text"
                                        required
                                        value={parentFirstName}
                                        onChange={(e) => setParentFirstName(e.target.value)}
                                        validators={['matchRegexp:^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-]+$', 'minStringLength:1', 'trim']}
                                        errorMessages={['Navn må oppgis', 'Ugyldig navn', 'Ugyldig navn', 'Ugyldig navn']}

                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <TextValidator
                                        variant="outlined"
                                        id="lastName"
                                        label="Foresatte etternavn"
                                        type="text"
                                        required
                                        value={parentLastName}
                                        onChange={(e) => setParentLastName(e.target.value)}
                                        validators={['required', 'matchRegexp:^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð \'-]+$', 'minStringLength:1', 'trim']}
                                        errorMessages={['Etternavn må oppgis', 'Ugyldig etternavn', 'Ugyldig etternavn', 'Ugyldig etternavn']}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <TextValidator
                                        variant="outlined"
                                        id="parentPhoneNumber"
                                        label="Foresatte telefon"
                                        type="tel"
                                        required
                                        value={parentPhoneNumber}
                                        onChange={(e) => setParentPhoneNumber(e.target.value)}
                                        validators={['required', 'matchRegexp:^[0-9]{8}$']}
                                        errorMessages={['Telefonnummer må oppgis', 'Ugyldig telefonnummer']}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <TextValidator
                                        variant="outlined"
                                        id="parentEMail"
                                        label="Foresatte e-post"
                                        type="email"
                                        required
                                        value={parentEMail}
                                        onChange={(e) => setParentEMail(e.target.value)}
                                    />
                                </Grid>
                            </>
                        }
                        {/*Input allergi*/}
                        <Grid item xs={12} >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isAllergic}
                                        onChange={(e) => setCheckBox(e.target.checked)}
                                    />
                                }
                                label="allergisk"
                            />
                        </Grid>
                        <Collapse component={Grid} item xs={12} in={isAllergic}>

                            <TextField
                                variant="outlined"
                                id="allergyDescription"
                                label="Allergibeskrivelse"
                                required
                                multiline
                                disabled={!isAllergic}
                                value={allergyDescription}
                                onChange={(e) => setAllergyDescription(e.target.value)}
                            />

                        </Collapse>
                        <Grid item xs={12} > {/*Input team/klan*/}
                            <TextField
                                variant="outlined"
                                id="team"
                                label="Lag/klan"
                                value={team}
                                onChange={(e) => setTeam(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} >{/*Input kommentarer*/}
                            <TextField
                                id="comments"
                                variant="outlined"
                                label="Tilleggsinformasjon"
                                multiline
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                type="submit"
                            >
                                Lagre
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </Paper>
        </Container>
    );
}