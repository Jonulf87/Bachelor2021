import React, { useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Card, CardContent, Typography, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(3),
            width: '25ch',
        }
    }
}));

export default function CreateVenue() {

    const classes = useStyles();

    const [isSending, setIsSending] = useState(false);
    const [enteredName, setEnteredName] = useState('');
    const [enteredContactId, setEnteredContactId] = useState('');
    const [enteredAddress, setEnteredAddress] = useState('');
    const [enteredPostalCode, setEnteredPostalCode] = useState('');
    const [enteredArea, setEnteredArea] = useState('');
    const [enteredCapacity, setEnteredCapacity] = useState('');

    const { isAuthenticated, token } = useAuth();

    const sendRequest = async () => {
        // don't send again while we are sending
        if (isSending) {
            return;
        }

        // Check all fields


        // update state
        setIsSending(true);

        const data = {
            'VenueName': enteredName,
            'VenueAddress': enteredAddress,
            'PostalCode': enteredPostalCode,
            'VenueAreaAvailable': enteredArea,
            'VenueCapacity': enteredCapacity,
            'ContactId': enteredContactId
        }

        if (isAuthenticated) {
            const response = await fetch('/api/venues', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (response.status !== 200) {
                alert("Error");
            } else {
                const result = await response.json();

                alert("Created");
                setEnteredName('');
                setEnteredContactId('');
                setEnteredAddress('');
                setEnteredPostalCode('');
                setEnteredArea('');
                setEnteredCapacity('');
            }
        } else {
            alert("Not authorized");
        }

        setIsSending(false);
    };

    return (
        <>
            <Typography gutterBottom variant="h5" component="h5">
                Opprett lokale
                </Typography>
            <form className={classes.root} noValidate autoComplete="off">
                <div>
                    <div>
                        <TextField
                            onChange={event => {
                                setEnteredName(event.target.value);
                            }}
                            value={enteredName}
                            id="name"
                            name="name"
                            label="Navn"
                            style={{ margin: 8 }}
                            placeholder="Navn på lokale"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                        />

                        <TextField
                            onChange={event => {
                                setEnteredContactId(event.target.value);
                            }}
                            value={enteredContactId}
                            id="contactperson"
                            name="contactperson"
                            label="Kontaktperson"
                            style={{ margin: 8 }}
                            placeholder="Kontakterson"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                        />

                    </div>
                    <div>
                        <TextField
                            onChange={event => {
                                setEnteredAddress(event.target.value);
                            }}
                            value={enteredAddress}
                            id="address"
                            name="address"
                            label="Adresse"
                            style={{ margin: 8 }}
                            placeholder="Gateadresse"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                        />

                        <TextField
                            onChange={event => {
                                setEnteredPostalCode(event.target.value);
                            }}
                            value={enteredPostalCode}
                            id="postalcode"
                            name="postalcode"
                            label="Postnr"
                            style={{ margin: 8 }}
                            placeholder="Postnummer"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                        />
                    </div>
                    <div>
                        <TextField
                            onChange={event => {
                                setEnteredArea(event.target.value);
                            }}
                            value={enteredArea}
                            id="area"
                            name="area"
                            type="Number"
                            label="Areal"
                            style={{ margin: 8 }}
                            placeholder="Tilgjengelig areal"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                        />

                        <TextField
                            onChange={event => {
                                setEnteredCapacity(event.target.value);
                            }}
                            value={enteredCapacity}
                            id="capacity"
                            name="capacity"
                            type="Number"
                            label="Kapasitet"
                            style={{ margin: 8 }}
                            placeholder="Kapasitet (plasser)"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                        />
                    </div>
                </div>
            </form>
            <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<SaveIcon />}
                disabled={isSending}
                onClick={sendRequest}
            >
                Lagre
                </Button>
        </>
    );
}
