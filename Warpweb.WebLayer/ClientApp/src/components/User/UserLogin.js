import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function UserLogin() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [loginSuccess, setLoginSuccess] = useState(false);

    const [errors, setErrors] = useState([]);

    const { login } = useAuth();


    const logInSubmit = async () => {

        const response = await login(userName, password);

        if (response.token) {
            setLoginSuccess(true);
        }
        else {
            setErrors(response.errors)
        }
    }

    if (loginSuccess) {
        return (<Redirect to={'/user'}/>)
    }

    return (
        <>
            {errors.map(error => (<p>{error}</p>))}
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