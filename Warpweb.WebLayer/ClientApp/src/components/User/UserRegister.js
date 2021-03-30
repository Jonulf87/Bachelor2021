import { TextField, Button, Grid, Checkbox, FormControlLabel } from '@material-ui/core';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { intervalToDuration } from 'date-fns/esm/fp';

export default function UserRegister() {

    //statevariabler til posting av bruker
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [eMail, setEMail] = useState("");
    const [userName, setUserName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(new Date('01-01-2000'));
    const [gender, setGender] = useState("");
    const [isAllergic, setIsAllergic] = useState(false);
    const [allergyDescription, setAllergyDescription] = useState("");
    const [comments, setComments] = useState("");
    const [team, setTeam] = useState("");
    const [password, setPassword] = useState("");

    //staevariabler til posting av foresatte
    const [parentFirstName, setParentFirstName] = useState("");
    const [parentLastName, setParentLastName] = useState("");
    const [parentPhoneNumber, setParentPhoneNumber] = useState("");
    const [parentEMail, setParentEMail] = useState("");

    const [error, setError] = useState();
    const [isRegistered, setIsRegistered] = useState(false);
    const [showParents, setShowParents] = useState(false);
    const [checkBox, setCheckBox] = useState(false);

    useEffect(() => {
        const checkicheck = () => {
            if (checkBox) {
                setIsAllergic(true);
            }
            else {
                setIsAllergic(false);
            }
        }
        checkicheck();
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
            'gender': gender, //gutt, jente, annet, ønsker ikke å oppgi
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
                <Grid
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
                            id="firstName"
                            label="Fornavn"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        {/*Input mellomnavn*/}
                        <TextField
                            id="middleName"
                            label="Mellomnavn"
                            required
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                        />
                        {/*Input etternavn*/}
                        <TextField
                            id="lastName"
                            label="Etternavn"
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
                            id="userName"
                            label="Brukernavn"
                            required
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        {/*Input passord*/}
                        <TextField
                            id="password"
                            label="Passord"
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
                            id="eMail"
                            label="Epost"
                            required
                            value={eMail}
                            onChange={(e) => setEMail(e.target.value)}
                        />
                    </Grid>
                    {/*Input adresse*/}
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            id="address"
                            label="Adresse"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        {/*Input postnummer*/}
                        <TextField
                            id="zipCode"
                            label="Postnummer"
                            required
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                    </Grid>
                    {/*Input telefon*/}
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            id="phoneNumber"
                            label="Telefon"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </Grid>
                    {/*Input kjønn*/}
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            id="gender"
                            label="Kjønn"
                            required
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        />
                    </Grid>
                    {/*Input fødselsdag*/}
                    <Grid
                        item
                        xs={12}
                    >
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
                            xs={4}
                        >
                            <Grid
                                item
                                xs={6}
                            >
                                <TextField
                                    id="firstName"
                                    label="Foresatte fornavn"
                                    required
                                    value={parentFirstName}
                                    onChange={(e) => setParentFirstName(e.target.value)}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={6}
                            >
                                <TextField
                                    id="lastName"
                                    label="Foresatte etternavn"
                                    required
                                    value={parentLastName}
                                    onChange={(e) => setParentLastName(e.target.value)}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={6}
                            >
                                <TextField
                                    id="parentPhoneNumber"
                                    label="Foresatte telefon"
                                    required
                                    value={parentPhoneNumber}
                                    onChange={(e) => setParentPhoneNumber(e.target.value)}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={6}
                            >
                                <TextField
                                    id="parentEMail"
                                    label="Foresatte s-post"
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
                            id="team"
                            label="Lag/klan"
                            required
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                        />
                    </Grid>
                    {/*Input email*/}
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            id="comments"
                            label="Tilleggsinformasjon"
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