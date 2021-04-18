﻿import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Dialog, DialogTitle, Button, Paper, TextField, MenuItem, FormControl } from '@material-ui/core';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Form } from 'reactstrap';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import useAuth from '../../hooks/useAuth';
import useCurrentEvent from '../../hooks/useCurrentEvent';

const useStyles = makeStyles((theme) => ({

    root: {
        '& .MuiTextField-root': {
            padding: theme.spacing(1),
            width: "100%",
        },
    },
}));

export default function CreateEvent({ dialogOpen, handleDialogClose, triggerUpdate }) {

    const classes = useStyles();

    //Her følger variablene til VM for mainEvent til posting
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date('2020-05-05T11:54:00'));
    const [endDate, setEndDate] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date('2020-01-01T12:00:00'))
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
                const result = await response.json();
                setOrganizers(result);
                if (result.length === 1) {
                    setOrganizerId(result[0].id);
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
                const result = await response.json();
                setVenues(result);
            }
        }
        getVenues();
    }, [isAuthenticated]);


    const mainEventDataToBeSent = {
        'name': name,
        'startDate': startDate,
        'startTime': startTime,
        'endDate': endDate,
        'endTime': endTime,
        'organizerId': organizerId,
        'venueId': venueId
    }

    // NB - Må sjekke at det er gjort valg i skjema før innsending
    const submitForm = async () => {
        if (isAuthenticated) {
            await fetch('/api/events/createmainevent', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(mainEventDataToBeSent)
            });
            triggerUpdate();
            refreshToken(0, () => {
                setCurrentEvent(name);
                setCurrentEventChangeCompleteTrigger(oldValue => !oldValue);
                history.push('/crewadmin');
            });
            handleDialogClose();
        }
    }




    return (
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
        >
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
                        <KeyboardDatePicker
                            className={classes.keyboardDatePicker}
                            id="startDatePicker"
                            label="Startdato"
                            format="dd/MM/yyyy"
                            variant="inline"
                            margin="normal"
                            value={startDate}
                            onChange={(dateEvent) => setStartDate(dateEvent)}
                        />
                        <KeyboardTimePicker
                            className={classes.keyboardTimePicker}
                            id="startTimePicker"
                            label="Startklokkeslett"
                            variant="inline"
                            margin="normal"
                            ampm={false}
                            value={startTime}
                            onChange={(timeEvent) => setStartTime(timeEvent)}
                        />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            className={classes.keyboardDatePicker}
                            id="endDatePicker"
                            label="Sluttdato"
                            format="dd/MM/yyyy"
                            variant="inline"
                            margin="normal"
                            value={endDate}
                            onChange={(dateEvent) => setEndDate(dateEvent)}

                        />
                        <KeyboardTimePicker
                            className={classes.keyboardTimePicker}
                            id="endTimePicker"
                            label="Sluttklokkeslett"
                            variant="inline"
                            margin="normal"
                            ampm={false}
                            value={endTime}
                            onChange={(timeEvent) => setEndTime(timeEvent)}
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