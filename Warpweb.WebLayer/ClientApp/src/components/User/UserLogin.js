import React, { useState } from 'react';
import { TextField, Button, Grid, Container,Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import PopupWindow from '../PopupWindow/PopupWindow';


//component spesifik styling
const useStyles = makeStyles((theme) => ({
    
}));

export default function UserLogin() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [loginSuccess, setLoginSuccess] = useState(false);
    const [open, setOpen] = useState(false);

    const [errors, setErrors] = useState([]);

    const classes = useStyles();

    const { login } = useAuth();

    const logInSubmit = async () => {

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
        return (<Redirect to={'/user'} />)
    }

    return (
        <>
            <PopupWindow open={open} onClose={() => setOpen(false)} text={errors.map(error => (<p key="">{error}</p>))} />
            <Container className={classes.container} maxWidth="xs">
            <form>
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
                    <Grid item xs={12}>
                        {/*Logginn knapp*/}
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={logInSubmit}
                        >
                            Logg inn
                        </Button>
                    </Grid>
                </Grid>
                </form>
            </Container>
        </>
    )
}