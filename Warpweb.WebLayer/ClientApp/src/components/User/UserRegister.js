import { TextField, Button } from '@material-ui/core';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import authService from '../../services/authService';

export default function UserRegister() {


    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [eMail, setEMail] = useState("");
    const [userName, setUserName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [gender, setGender] = useState("");
    const [isAllergic, setIsAllergic] = useState(false);
    const [allergyDescription, setAllergyDescription] = useState("");
    const [comments, setComments] = useState("");
    const [team, setTeam] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState();
    const [isRegistered, setIsRegistered] = useState(false);

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
        'isAlleric': isAllergic,
        'allergyDescription': allergyDescription,
        'comments': comments,
        'team': team,
        'password': password
    }

    const submitForm = async () => {

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
                {error && <pre style={{ color: "red" }}>{error}</pre>}
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
                {/*Input brukernavn*/}
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
                {/*Input email*/}
                <TextField
                    id="eMail"
                    label="Epost"
                    required
                    value={eMail}
                    onChange={(e) => setEMail(e.target.value)}
                />

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={submitForm}
                >
                    Lagre
                </Button>
            </form>
        </>
    );
}