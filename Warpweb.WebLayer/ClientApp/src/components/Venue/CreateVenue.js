import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, FormControl, TextField, MenuItem, Container } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import useAuth from '../../hooks/useAuth';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            minWidth: 300,
            maxWidth: "100%",
        },
        '& .MuiContainer-root': {
            padding: '10px',
            display: 'grid',
            justifyContent: 'center',
        },
    }
}));

export default function CreateVenue({ handleDialogCreateVenueClose, dialogCreateVenueOpen, triggerUpdate }) {

    const [isSending, setIsSending] = useState(false);

    // Create constants for each field
    const [enteredName, setEnteredName] = useState('');
    const [enteredAddress, setEnteredAddress] = useState('');
    const [enteredPostalCode, setEnteredPostalCode] = useState('');
    const [enteredContactName, setEnteredContactName] = useState('');
    const [enteredContactEMail, setEnteredContactEMail] = useState('');
    const [enteredContactPhone, setEnteredContactPhone] = useState('');

    const [organizers, setOrganizers] = useState([]);
    const [organizerId, setOrganizerId] = useState('');

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getOrganizers = async () => {

            if (isAuthenticated) {
                const response = await fetch('/api/tenants/getaorgsadmin', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                setOrganizers(result);
                if (result.length === 1) {
                    setOrganizerId(result[0].id);
                }
            }
        }
        getOrganizers();
    }, [isAuthenticated]);

    const submitForm = async (e) => {

        e.preventDefault();
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
            'organizerId': organizerId
        }

        const response = await fetch(`/api/venues/createvenue`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (response.status !== 200) {
            alert(response.body);
        } else {

            triggerUpdate();

            setEnteredName('');
            setEnteredAddress('');
            setEnteredPostalCode('');
            setEnteredContactName('');
            setEnteredContactEMail('');
            setEnteredContactPhone('');
            setOrganizerId('');
        }

        handleDialogCreateVenueClose();
        setIsSending(false);
    };


    return (
        <Dialog
            open={dialogCreateVenueOpen}
            onClose={handleDialogCreateVenueClose}
            className={classes.root}
        >
            <Container>
                <DialogTitle>
                    Nytt lokale
                </DialogTitle>

                <ValidatorForm
                    autoComplete="off"
                    noValidate
                    onSubmit={submitForm}
                >
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

                    {organizers.length > 1 && (
                        <TextField
                            select
                            variant="outlined"
                            id="organizerId"
                            label="Organisasjon"
                            fullWidth
                            value={organizerId}
                            onChange={(e) => setOrganizerId(e.target.value)}
                        >
                            {organizers.map((organizer) => (
                                <MenuItem key={organizer.id} value={organizer.id}>
                                    {organizer.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    <FormControl style={{ padding: '8px' }} >
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
                    </FormControl>
                </ValidatorForm>
            </Container>
        </Dialog>
    );
}
