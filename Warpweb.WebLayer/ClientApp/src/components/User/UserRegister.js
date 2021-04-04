import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { Select, FormControl, InputLabel, TextField, Button, Grid, Checkbox, FormControlLabel, MenuItem } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { intervalToDuration } from 'date-fns/esm/fp';

export default function UserRegister() {

    // Styling
    const useStyles = makeStyles((theme) => ({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
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
    const [dateOfBirth, setDateOfBirth] = useState(new Date("2010-01-01T00:00:00"));
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
        ,]

    const [error, setError] = useState();
    const [isRegistered, setIsRegistered] = useState(false);
    const [showParents, setShowParents] = useState(false);
    const [checkBox, setCheckBox] = useState(false);

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
            console.log(diff.years)

            if (diff.years < 16) {
                setShowParents(true);
                console.log("hei");
            }
            else {
                setShowParents(false);
            }
        }
        checkDateOfBirth();
    }, [dateOfBirth])

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
        }
    }

    if (isRegistered) {
        return <Redirect to={'/login'} />
    }

    return (
        <>
            <form>
                <Grid className={classes.root}
                    container
                    spacing={2}
                >
                    {error && <pre style={{ color: "red" }}>{error}</pre>}
                    <Grid
                        item
                        xs={12}
                    >
                        {/*Input fornavn*/}
                        <TextField
                            variant="outlined"
                            id="firstName"
                            label="Fornavn"
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        {/*Input mellomnavn*/}
                        <TextField
                            variant="outlined"
                            id="middleName"
                            label="Mellomnavn"
                            type="text"
                            required
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                        />
                        {/*Input etternavn*/}
                        <TextField
                            variant="outlined"
                            id="lastName"
                            label="Etternavn"
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Grid>
                    {/*Input brukernavn*/}
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            variant="outlined"
                            id="userName"
                            label="Brukernavn"
                            type="text"
                            required
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        {/*Input passord*/}
                        <TextField
                            variant="outlined"
                            id="password"
                            label="Passord"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>
                    {/*Input email*/}
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            variant="outlined"
                            id="eMail"
                            label="Epost"
                            type="email"
                            required
                            value={eMail}
                            onChange={(e) => setEMail(e.target.value)}
                        />
                        {/*Input telefon*/}
                            <TextField
                                variant="outlined"
                                id="phoneNumber"
                                label="Telefon"
                                type="tel"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                    </Grid>
                    {/*Input adresse*/}
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            variant="outlined"
                            id="address"
                            label="Adresse"
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        {/*Input postnummer*/}
                        <TextField
                            variant="outlined"
                            id="zipCode"
                            label="Postnummer"
                            type="text"
                            required
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                    </Grid>
                    {/*Input kjønn*/}
                    <Grid
                        item
                        xs={12}
                    >
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Kjønn</InputLabel>
                            <Select
                                variant="outlined"
                                labelId="gender"
                                id="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                {genders.map((gender) => (
                                    <MenuItem key={gender.value} value={gender.value}>
                                        {gender.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    {/*Input fødselsdag*/}
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                id="dateOfBirth"
                                label="Fødselsdato"
                                format="dd/MM/yyyy"
                                variant="inline"
                                margin="normal"
                                value={dateOfBirth}
                                onChange={(dateEvent) => setDateOfBirth(dateEvent)}
                            />
                        </MuiPickersUtilsProvider>

                    </Grid>
                    {/*Input forelder*/}
                    {showParents &&
                        <Grid
                            container
                            item
                            xs={12}
                        >
                            <Grid
                                item
                                xs={12}
                            >
                            <TextField
                                variant="outlined"
                                    id="firstName"
                                    label="Foresatte fornavn"
                                    type="text"
                                    required
                                    value={parentFirstName}
                                    onChange={(e) => setParentFirstName(e.target.value)}
                                />

                            <TextField
                                variant="outlined"
                                    id="lastName"
                                    label="Foresatte etternavn"
                                    type="text"
                                    required
                                    value={parentLastName}
                                    onChange={(e) => setParentLastName(e.target.value)}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                            >
                            <TextField
                                variant="outlined"
                                    id="parentPhoneNumber"
                                    label="Foresatte telefon"
                                    type="tel"
                                    required
                                    value={parentPhoneNumber}
                                    onChange={(e) => setParentPhoneNumber(e.target.value)}
                                />
                            <TextField
                                variant="outlined"
                                    id="parentEMail"
                                    label="Foresatte e-post"
                                    type="email"
                                    required
                                    value={parentEMail}
                                    onChange={(e) => setParentEMail(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    }
                    {/*Input allergi*/}
                    <Grid
                        item
                        xs={12}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAllergic}
                                    onChange={(e) => setCheckBox(e.target.checked)}
                                />
                            }
                            label="allergisk"
                        />
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
                    </Grid>

                    {/*Input team/klan*/}
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            variant="outlined"
                            id="team"
                            label="Lag/klan"
                            required
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                        />
                    {/*Input kommentarer*/}
                        <TextField
                            id="comments"
                            variant="outlined"
                            label="Tilleggsinformasjon"
                            multiline
                            required
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={submitForm}
                    >
                        Lagre
                </Button>
                </Grid>
            </form>
        </>
    );
}