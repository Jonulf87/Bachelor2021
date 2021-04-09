import React, { useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import useAuth from '../../hooks/useAuth';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(3),
            width: '25ch',
        },

        '& .row .cell': {
            display: 'inline',
            maxWidth: '50%'
        }
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
            'VenueName': enteredName,
            'VenueAddress': enteredAddress,
            'PostalCode': enteredPostalCode,
            'ContactName': enteredContactName,
            'ContactEMail': enteredContactEMail,
            'ContactPhone': enteredContactPhone
        }

        const response = await fetch('/api/venues', {
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

            alert("Created");
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
            <Typography gutterBottom variant="h5" component="h5">
                Opprett lokale
            </Typography>
            <ValidatorForm
                className={classes.root}
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
            >
                <div>
                    <div className="row">
                        <div className="cell">
                            <TextValidator
                                onChange={event => {
                                    setEnteredName(event.target.value);
                                }}
                                label="Navn"
                                placeholder="Navn på lokale"
                                name="name"
                                value={enteredName}
                                required
                                validators={['required', 'minStringLength:1', 'trim']}
                                errorMessages={['Navn må oppgis', 'Navn må oppgis', 'Navn må oppgis']}
                                style={{ margin: 8 }}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </div>
                        <div className="cell">
                            <TextValidator
                                onChange={event => {
                                    setEnteredContactName(event.target.value);
                                }}
                                label="Kontaktperson"
                                placeholder="Kontaktperson"
                                name="contactperson"
                                value={enteredContactName}
                                required
                                validators={['required']}
                                errorMessages={['Kontaktperson må oppgis']}
                                style={{ margin: 8 }}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="cell">
                            <TextValidator
                                onChange={event => {
                                    setEnteredContactEMail(event.target.value);
                                }}
                                label="Kontakt epost"
                                placeholder="Kontakt epost"
                                name="contactemail"
                                value={enteredContactEMail}
                                required
                                validators={['required']}
                                errorMessages={['Epost må oppgis']}
                                style={{ margin: 8 }}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </div>
                        <div className="cell">
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
                                style={{ margin: 8 }}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="cell">
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
                                style={{ margin: 8 }}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </div>
                        <div className="cell">
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
                                style={{ margin: 8 }}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                            />
                        </div>
                    
                    </div>
                </div>

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
            </ValidatorForm>
        </>
    );
}
