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

    // Create constants for each field
    const [enteredName, setEnteredName] = useState('');
    const [enteredContactId, setEnteredContactId] = useState('');
    const [enteredAddress, setEnteredAddress] = useState('');
    const [enteredPostalCode, setEnteredPostalCode] = useState('');
    const [enteredArea, setEnteredArea] = useState('');
    const [enteredCapacity, setEnteredCapacity] = useState('');

    // Create an object that can hold errors for the fields
    const [errors, setErrors] = useState({});

    // Create validators for the fields
    const validators = {
        enteredName: value => {
            if (!value || value.replace(/ +(?= )/g, '').trim() === "") {
                setErrors({ ...errors, name: "Navn må oppgis" });
                return false;
            } else {
                setErrors({ ...errors, name: "" });
                return true;
            }
        },
        enteredContactId: () => { },
        enteredAddress: () => { },
        enteredPostalCode: value => {
            if (!value || !/^\d{4}$/.test(value)) {
                setErrors({ ...errors, postalCode: "Postnummer må oppgis" });
                return false;
            } else {
                setErrors({ ...errors, postalCode: "" });
                return true;
            }
        },
        enteredArea: value => {
            if (!value || !/^\d+$/.test(value)) {
                setErrors({ ...errors, area: "Areal må oppgis" });
                return false;
            } else {
                setErrors({ ...errors, area: "" });
                return true;
            }
        },
        enteredCapacity: value => {
            if (!value || !/^\d+$/.test(value)) {
                setErrors({ ...errors, capacity: "Kapasitet må oppgis" });
                return false;
            } else {
                setErrors({ ...errors, capacity: "" });
                return true;
            }
        }
    }

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

        // Check all fields
        // If any validator returns false (error) then stop
        let errorCount = 0;
        for (const field in validators) {
            console.log(field);
            if (!validators[field](eval(field))) errorCount++;
        }
        if (errorCount > 0) return;

        // Set sending flag to true
        setIsSending(true);

        // Create data object
        const data = {
            'VenueName': enteredName,
            'VenueAddress': enteredAddress,
            'PostalCode': enteredPostalCode,
            'VenueAreaAvailable': enteredArea,
            'VenueCapacity': enteredCapacity,
            'ContactId': enteredContactId
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
            setEnteredContactId('');
            setEnteredAddress('');
            setEnteredPostalCode('');
            setEnteredArea('');
            setEnteredCapacity('');
        }

        setIsSending(false);
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log("submit");
    };

    return (
        <>
            <Typography gutterBottom variant="h5" component="h5">
                Opprett lokale
                </Typography>
            <form className={classes.root} autoComplete="off" noValidate onSubmit={handleSubmit}>
                <div>
                    <div>
                        <TextField
                            onChange={event => {
                                setEnteredName(event.target.value);
                                validators.enteredName(event.target.value);
                            }}
                            value={enteredName}
                            required
                            id="name"
                            name="name"
                            label="Navn"
                            style={{ margin: 8 }}
                            placeholder="Navn på lokale"
                            error={ Boolean(errors.name) }
                            helperText={ errors.name }
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
                            required
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
                            required
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
                                validators.enteredPostalCode(event.target.value);
                            }}
                            value={enteredPostalCode}
                            required
                            id="postalCode"
                            name="postalCode"
                            label="Postnr"
                            style={{ margin: 8 }}
                            placeholder="Postnummer"
                            error={Boolean(errors.postalCode)}
                            helperText={errors.postalCode}
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
                                validators.enteredArea(event.target.value);
                            }}
                            value={enteredArea}
                            required
                            id="area"
                            name="area"
                            type="Number"
                            label="Areal"
                            style={{ margin: 8 }}
                            placeholder="Tilgjengelig areal"
                            error={Boolean(errors.area)}
                            helperText={errors.area}
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
                                validators.enteredCapacity(event.target.value);
                            }}
                            value={enteredCapacity}
                            required
                            id="capacity"
                            name="capacity"
                            type="Number"
                            label="Kapasitet"
                            style={{ margin: 8 }}
                            placeholder="Kapasitet (plasser)"
                            error={Boolean(errors.capacity)}
                            helperText={errors.capacity}
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
