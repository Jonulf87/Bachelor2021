import { TextField, Button } from '@material-ui/core';
import React, { useState } from 'react';
import authService from '../api-authorization/AuthorizeService';

export default function UserRegister() {


    let [firstName, setFirstName] = useState("");
    let [middleName, setMiddleName] = useState("");
    let [lastName, setLastName] = useState("");
    let [phoneNumber, setPhoneNumber] = useState("");
    let [address, setAddress] = useState("");
    let [zipCode, setZipCode] = useState("");
    let [eMail, setEMail] = useState("");
    let [userName, setUserName] = useState("");
    let [dateOfBirth, setDateOfBirth] = useState(new Date());
    let [gender, setGender] = useState("");
    let [isAllergic, setIsAllergic] = useState(false);
    let [allergyDescription, setAllergyDescription] = useState("");
    let [comments, setComments] = useState("");
    let [team, setTeam] = useState("");
    let [password, setPassword] = useState("");

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
        const authenticationResult = await authService.isAuthenticated();
        if (authenticationResult) {
            const accessToken = await authService.getAccessToken();
            const response = await fetch('/api/users/register', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(userDataToBeSent)
            });
            const result = await response.json();
            console.log(result);
        }
    }


    return (
        <>
            <form>
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