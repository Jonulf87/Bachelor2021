import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography } from '@material-ui/core';

import { Link, Redirect } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';




export default function UserLogin({ fromTicket }) {

    const [userName, setUserName] = useState( "");
    const [password, setPassword] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState([]);

    const { login } = useAuth();

    const logInSubmit = async (e) => {
        e.preventDefault();
        const response = await login(userName, password);

        if (response.token) {
            setLoginSuccess(true);
        }
        else {
            setErrors(response.errors);
            setOpen(true);
        }
    }

    if (loginSuccess) {
        if (!fromTicket) {
            return (<Redirect to={'/user'} />)
        }
    }

    const showErrors = (errors) => {
        if (Array.isArray(errors)) {
            return errors.map(error => (<p key="">{error}</p>));
        }
        else {
            return "Ugyldig brukernavn eller passord";
        }
    }


    return (
        <>
            <PopupWindow open={open} onClose={() => setOpen(false)} text={showErrors(errors)} />
            <Container maxWidth="xs">
                <form onSubmit={logInSubmit}>
                    <Grid container spacing={2} alignContent="center">
                        {/*Input brukernavn/email*/}
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
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                type="submit"
                            >
                                Logg inn
                        </Button>
                        </Grid>
                        <Grid item xs={8}>
                            {fromTicket ?
                                (<Typography variant="body1" >Ingen bruker? <Link to="/register/1">Registrer deg her</Link></Typography>)
                                :
                                (<Typography variant="body1" >Ingen bruker? <Link to="/register">Registrer deg her</Link></Typography>)
                            }
                            
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </>
    )
}