import { Dialog, Paper, TextField, Button, FormControl, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';

const useStyles = makeStyles((theme) => ({

    root: {
        '& .MuiTextField-root': {
            padding: theme.spacing(1),
            width: "100%",
        },
    },
}));

export default function CreateOrganizer({ handleDialogCreateOrganizerClose, dialogCreateOrganizerOpen, triggerUpdate }) {

    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    }

    const [organizerName, setOrganizerName] = useState("");
    const [organizerNumber, setOrganizerNumber] = useState("");
    const [organizerDescription, setOrganizerDescription] = useState("");

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();

    const dataToBeSent = {
        'name': organizerName,
        'orgNumber': organizerNumber,
        'description': organizerDescription
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            const response = await fetch('api/tenants/addorganizer', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(dataToBeSent)
            });
            if (response.status === 200) {
                triggerUpdate();
                setOrganizerName("");
                setOrganizerNumber("");
                setOrganizerDescription("");
            }
            else if (response.status === 400) {
                const errorResult = await response.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            }
            else {
                const errorResult = await response.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
            handleDialogCreateOrganizerClose();
        }
    }

    return (
        <Dialog
            open={dialogCreateOrganizerOpen}
            onClose={handleDialogCreateOrganizerClose}
        >
            <Paper
                variant="outlined"
                elevation={0}
                style={{ padding: '10px' }}
            >
                <DialogTitle>
                    Ny organisasjon
                </DialogTitle>
                <form className={classes.root}>
                    <TextField
                        variant="outlined"
                        id="organizerName"
                        label="Navn"
                        required
                        value={organizerName}
                        onChange={(e) => setOrganizerName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        id="organizerNumber"
                        label="Organisasjonsnummer"
                        required
                        value={organizerNumber}
                        onChange={(e) => setOrganizerNumber(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        id="organizerDescription"
                        label="Beskrivelse"
                        required
                        value={organizerDescription}
                        onChange={(e) => setOrganizerDescription(e.target.value)}
                    />
                    <FormControl style={{ padding: '8px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            className={classes.button}
                            startIcon={<SaveIcon />}
                            onClick={submitForm}
                        >
                            Lagre
                        </Button>
                    </FormControl>
                </form>
            </Paper>
        </Dialog>
    )
}