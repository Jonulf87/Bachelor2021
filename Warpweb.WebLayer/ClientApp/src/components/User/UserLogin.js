import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography } from '@material-ui/core';

import { Link, Redirect } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';

export default function UserLogin({ fromTicket }) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [loginErrors, setLoginErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const { login } = useAuth();

    const logInSubmit = async (e) => {
        e.preventDefault();
        const response = await login(userName, password);

        if (response.token) {
            setLoginSuccess(true);
        } else {
            setLoginErrors(response.errors);
            setErrorDialogOpen(true);
        }
    };

    if (loginSuccess) {
        if (!fromTicket) {
            return <Redirect to={'/user/4'} />;
        }
    }

    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    return (
        <>
            <PopupWindow
                open={errorDialogOpen}
                handleClose={handleErrorDialogClose}
                error={error}
                clearError={setError}
                errors={errors}
                clearErrors={setErrors}
                loginErrors={loginErrors}
            />
            <Container maxWidth="xs">
                <form onSubmit={logInSubmit}>
                    <Grid container spacing={2} alignContent="center">
                        {/*Input brukernavn/email*/}
                        <Grid item xs={12}>
                            <Typography component="span" variant="h5">
                                Logg inn
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                id="userName"
                                label="Brukernavn"
                                required
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/*Input passord*/}
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                id="password"
                                label="Passord"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            {/*Logginn knapp*/}
                            <Button variant="contained" color="primary" size="large" type="submit">
                                Logg inn
                            </Button>
                        </Grid>
                        <Grid item xs={8}>
                            {fromTicket ? (
                                <Typography variant="body1">
                                    Ingen bruker? <Link to="/register/1">Registrer deg her</Link>
                                </Typography>
                            ) : (
                                <Typography variant="body1">
                                    Ingen bruker? <Link to="/register">Registrer deg her</Link>
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </>
    );
}
