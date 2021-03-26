import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import authService from '../api-authorization/AuthorizeService';

export default function UserLogin() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");


    const logInSubmit = async () => {

        const userDataToBeSent = {
            'userName': userName,
            'password': password
        }

        const response = await fetch('/api/users/login', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(userDataToBeSent)
        });

        if (response.ok) {
            await authService.completeSignIn("/user")
        }
        else {
            setError(await response.text())
        }
    }

    return (
        <>
            <form>
                {/*Input brukernavn/email*/}
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
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/*Logginn knapp*/}
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={logInSubmit}
                >
                    Logg inn
                </Button>
            </form>
        </>
    )
}