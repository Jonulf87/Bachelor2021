import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Dialog, DialogTitle, Button, Paper, TextField, MenuItem, FormControl } from '@material-ui/core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Form } from 'reactstrap';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import useAuth from '../../hooks/useAuth';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import PopupWindow from '../PopupWindow/PopupWindow';

const useStyles = makeStyles((theme) => ({

    root: {
        '& .MuiTextField-root': {
            padding: theme.spacing(1),
            width: "100%",
        },
    },
}));

export default function CreateEvent({ dialogOpen, handleDialogClose, triggerUpdate }) {

    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    }

    const classes = useStyles();

    //Her følger variablene til VM for mainEvent til posting
    const [name, setName] = useState("");
    const [startDateTime, setStartDateTime] = useState(new Date());
    const [endDateTime, setEndDateTime] = useState(new Date())
    const [organizerId, setOrganizerId] = useState("");
    const [venueId, setVenueId] = useState("");

    //Her følger noen variabler som trengs for å vise rette ting og greier og saker
    const [organizers, setOrganizers] = useState([]);
    const [venues, setVenues] = useState([]);

    const { isAuthenticated, token, refreshToken } = useAuth();

    const history = useHistory();
    const { setCurrentEvent, setCurrentEventChangeCompleteTrigger } = useCurrentEvent();

    //Henter organizere brukeren er knyttet til
    useEffect(() => {
        const getOrganizers = async () => {

            if (isAuthenticated) {
                const response = await fetch('/api/tenants/getaorgsadmin', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    setOrganizers(result);

                    if (result.length === 1) {
                        setOrganizerId(result[0].id);
                    }
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

            }
        }
        getOrganizers();
    }, [isAuthenticated]);

    useEffect(() => {
        const getVenues = async () => {

            if (isAuthenticated) {
                const response = await fetch(`/api/venues/venueslist`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    setVenues(result);
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
            }
        }
        getVenues();
    }, [isAuthenticated]);


    const mainEventDataToBeSent = {
        'name': name,
        'startDateTime': startDateTime,
        'endDateTime': endDateTime,
        'organizerId': organizerId,
        'venueId': venueId
    }

    // NB - Må sjekke at det er gjort valg i skjema før innsending
    const submitForm = async () => {
        if (isAuthenticated) {
            const response = await fetch('/api/events/createmainevent', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(mainEventDataToBeSent)
            });
            if (response.ok) {
                triggerUpdate();
                refreshToken(0, () => {
                    setCurrentEvent(name);
                    setCurrentEventChangeCompleteTrigger(oldValue => !oldValue);
                    history.push('/crewadmin');
                });
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
            handleDialogClose();
        }
    }


    return (
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
        >
            <PopupWindow open={errorDialogOpen} handleClose={handleErrorDialogClose} error={error} clearError={setError} errors={errors} clearErrors={setErrors} />

            <Paper
                variant="outlined"
                elevation={0}
                style={{ padding: '10px' }}
            >
                <DialogTitle>
                    Nytt arrangement
                </DialogTitle>
                <Form className={classes.root}>
                    <TextField
                        className={classes.textField}
                        id="eventName"
                        label="Navn på arrangement"
                        required
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            className={classes.keyboardTimePicker}
                            id="startTimePicker"
                            label="Start dato og klokkeslett"
                            variant="dialog"
                            margin="normal"
                            ampm={false}
                            format="dd.MM.yyyy HH:mm"
                            value={startDateTime}
                            onChange={(timeEvent) => setStartDateTime(timeEvent)}
                            KeyboardButtonProps={{
                                "aria-label": "Endre start dato og tid",
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            className={classes.keyboardTimePicker}
                            id="endTimePicker"
                            label="Slutt dato og klokkeslett"
                            variant="dialog"
                            margin="normal"
                            ampm={false}
                            format="dd.MM.yyyy HH:mm"
                            value={endDateTime}
                            onChange={(timeEvent) => setEndDateTime(timeEvent)}
                            KeyboardButtonProps={{
                                "aria-label": "Endre slutt dato og tid",
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    {/*Dropdown for Lokaler*/}
                    <TextField
                        select
                        variant="outlined"
                        className={classes.textField}
                        id="venue"
                        label="Lokale"
                        fullWidth
                        value={venueId}
                        onChange={(e) => setVenueId(e.target.value)}
                    >
                        {venues.map((venue) => (
                            <MenuItem key={venue.id} value={venue.id} >
                                {venue.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/*Dropdown for arrangører*/}

                    {organizers.length > 1 && (

                        <TextField
                            select
                            variant="outlined"
                            className={classes.textField}
                            id="organizer"
                            label="Organisator"
                            fullWidth
                            value={organizerId}
                            onChange={(e) => setOrganizerId(e.target.value)}
                        >
                            {organizers.map((organizer) => (
                                <MenuItem key={organizer.id} value={organizer.id} >
                                    {organizer.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
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
                </Form>
            </Paper>
        </Dialog>
    );
}
