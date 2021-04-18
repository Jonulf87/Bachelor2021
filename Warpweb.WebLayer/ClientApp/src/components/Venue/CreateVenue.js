import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Grid, Toolbar } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import useAuth from '../../hooks/useAuth';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            width: '100%',
        },/*
        [theme.breakpoints.down('sm')]: {
            '& .MuiTextField-root': {
                width: '100%',
            },
        },
        [theme.breakpoints.up('sm')]: {
            '& .MuiTextField-root': {
                width: '25rem',
            },
        },*/

    }
}));

export default function CreateVenue() {

    const classes = useStyles();

    const [isSending, setIsSending] = useState(false);

    // Create constants for each field
    const [enteredName, setEnteredName] = useState('');
    const [enteredAddress, setEnteredAddress] = useState('');
    const [enteredPostalCode, setEnteredPostalCode] = useState('');
    const [enteredContactName, setEnteredContactName] = useState('');
    const [enteredContactEMail, setEnteredContactEMail] = useState('');
    const [enteredContactPhone, setEnteredContactPhone] = useState('');

    // Get organizer ID of current event
    const { currentEvent } = useCurrentEvent();
    const { isAuthenticated, token } = useAuth();

    const sendRequest = async () => {
        // Check that we are already sending data
        // If sending - don`t do it again
        if (isSending) {
            return;
        }

        if (!isAuthenticated) {
            alert("Not authorized");
            return;
        }

        // Set sending flag to true
        setIsSending(true);

        // Create data object
        const data = {
            'name': enteredName,
            'address': enteredAddress,
            'postalCode': enteredPostalCode,
            'contactName': enteredContactName,
            'contactEMail': enteredContactEMail,
            'contactPhone': enteredContactPhone,
            'organizerId': currentEvent.organizerId
        }

        console.log(data);

        const response = await fetch(`/api/venues`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (response.status !== 200) {
            alert(response);
        } else {
            const result = await response.json();

            setEnteredName('');
            setEnteredAddress('');
            setEnteredPostalCode('');
            setEnteredContactName('');
            setEnteredContactEMail('');
            setEnteredContactPhone('');
        }

        setIsSending(false);
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log("submit");
        sendRequest();
    };

    return (
        <>
            <Toolbar>
                <Typography variant="h5" component="h3">
                    Opprett lokale
                </Typography>
            </Toolbar>
            <ValidatorForm
                className={classes.root}
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >
                <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" component="h4">
                                Lokaleinfo
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                onChange={event => {
                                    setEnteredName(event.target.value);
                                }}
                                label="Navn"
                                name="name"
                                value={enteredName}
                                required
                                validators={['required', 'minStringLength:1', 'trim']}
                                errorMessages={['Navn må oppgis', 'Navn må oppgis', 'Navn må oppgis']}
                            />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <TextValidator
                                onChange={event => {
                                    setEnteredAddress(event.target.value);
                                }}
                                label="Adresse"
                                placeholder="Adresse"
                                name="address"
                                value={enteredAddress}
                                required
                                validators={['required']}
                                errorMessages={['Adresse må oppgis']}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextValidator
                                onChange={event => {
                                    setEnteredPostalCode(event.target.value);
                                }}
                                label="Postnr"
                                placeholder="Postnr"
                                name="postalCode"
                                value={enteredPostalCode}
                                required
                                validators={['required', 'matchRegexp:^[0-9]{4}$']}
                                errorMessages={['Postnummer må oppgis', 'Postnummer må inneholde 4 sifre']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" component="h4">
                                Kontaktinfo
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                onChange={event => {
                                    setEnteredContactName(event.target.value);
                                }}
                                label="Kontaktperson"
                                name="contactperson"
                                value={enteredContactName}
                                required
                                validators={['required']}
                                errorMessages={['Kontaktperson må oppgis']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                onChange={event => {
                                    setEnteredContactEMail(event.target.value);
                                }}
                                label="Kontakt epost"
                                name="contactemail"
                                value={enteredContactEMail}
                                required
                                validators={['required']}
                                errorMessages={['Epost må oppgis']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                onChange={event => {
                                    setEnteredContactPhone(event.target.value);
                                }}
                                label="Kontakt tlf."
                                placeholder="Kontakt tlf."
                                name="contactphone"
                                value={enteredContactPhone}
                                required
                                validators={['required']}
                                errorMessages={['Telefonnummer må oppgis']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                className={classes.button}
                                startIcon={<SaveIcon />}
                                disabled={isSending}
                            >
                                Lagre
                            </Button>
                        </Grid>   
                </Grid>                
            </ValidatorForm>
        </>
    );
}
