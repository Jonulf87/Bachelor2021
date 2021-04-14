import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import queryString from 'query-string';

import { Link, Redirect } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';


//component spesifik styling
const useStyles = makeStyles((theme) => ({

}));

export default function UserLogin(props) {

    let queryParams = queryString.parse(props.location.search)

    const [userName, setUserName] = useState(queryParams.userName ? queryParams.userName : "");

    const [password, setPassword] = useState("");

    const [loginSuccess, setLoginSuccess] = useState(false);
    const [open, setOpen] = useState(false);

    const [errors, setErrors] = useState([]);

    const classes = useStyles();

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
        return (<Redirect to={'/user'} />)
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
            <Container className={classes.container} maxWidth="xs">
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
                            <Typography variant="body1" >Ingen bruker? <Link to="/register">Registrer deg her</Link></Typography>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </>
    )
}