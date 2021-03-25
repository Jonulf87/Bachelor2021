﻿import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Grid, Button, Typography, Paper, TextField, MenuItem } from '@material-ui/core';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Form } from 'reactstrap';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import authService from '../api-authorization/AuthorizeService';
import { set } from 'date-fns/esm';
import main from '../MainPage/MainPage';
import CreateVenue from '../Venue/CreateVenue';

const useStyles = makeStyles((theme) => ({

    root: {
        display: 'flex',
        flexWrap: 'wrap',

    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: 10
    },
    keyboardDatePicker: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: 10
    },
    keyboardTimePicker: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: 10
    },
    typography: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: 10
    },
    button: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: 10
    }

}));

export default function CreateEvent() {

    const classes = useStyles();

    //Her følger variablene til VM for mainEvent til posting
    let [name, setName] = useState("");
    let [startDateTime, setStartDateTime] = useState(new Date('2019-01-01T15:30:00'));
    let [endDateTime, setEndDateTime] = useState(new Date('2020-01-01T15:30:00'));
    let [organizerId, setOrganizerId] = useState("");
    let [venueId, setVenueId] = useState("");

    //Her følger noen variabler som trengs for å vise rette ting og greier og saker
    let [organizers, setOrganizers] = useState([]);
    let [venues, setVenues] = useState([]);
    let [isOrganizerReady, setIsOrganizerReady] = useState(false);
    let [isVenueReady, setIsVenueReady] = useState(false);
    let [createVenue, setCreateVenue] = useState(false);
    let [venuePosted, setVenuePosted] = useState(false);

    //Henter organizere brukeren er knyttet til
    useEffect(() => {
        const getOrganizers = async () => {
            const authenticationResult = await authService.isAuthenticated();
            if (authenticationResult) {
                const accessToken = await authService.getAccessToken();
                const response = await fetch(`/api/tenant`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const result = await response.json();
                setOrganizers(result);
                setIsOrganizerReady(true);
            }
        }
        getOrganizers();
    }, []);


    const getVenues = async () => {
        const authenticationResult = await authService.isAuthenticated();
        if (authenticationResult) {
            const accessToken = await authService.getAccessToken();
            const response = await fetch(`/api/venues/VenuesList`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const result = await response.json();
            setVenues(result);
            setIsVenueReady(true);
        }
    }

    //Henter Venues knyttet til organizeren brukeren er knyttet til
    //Flyttes til egen komponent. Kanskje ikke allikevel
    useEffect(() => {
        getVenues();
    }, []);





    const mainEventDataToBeSent = {
        'name': name,
        'startDateTime': startDateTime,
        'endDateTime': endDateTime,
        'organizerId': organizerId
    }

    // NB - Må sjekke at det er gjort valg i skjema før innsending
    const submitForm = async () => {
        const authenticationResult = await authService.isAuthenticated();
        if (authenticationResult) {
            const accessToken = await authService.getAccessToken();
            const response = await fetch('/api/events/createMainEvent', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(mainEventDataToBeSent)
            });
            // Tror det skal holde med å droppe .json() fra response
            const result = await response.json();
            console.log(result);
            console.log("Startdate = " + mainEventDataToBeSent.StartDate + " StartTime = " + mainEventDataToBeSent.StartTime)
        }
    }

    let createVenueDiv = (
        <Grid
            item
            xs={6}
        >
            <CreateVenue />
        </Grid>
    )

    let stopButton = (
        <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<SaveIcon />}
            onClick={() => setCreateVenue(false)}
        >
            stopp
        </Button>
        )


    return (
        <Paper variant="outlined" elevation={2}>
            <Grid
                container
                className={classes.root}
            >
                <Grid item xs={12}>
                    <Typography className={classes.typography} gutterBottom variant="h5" component="h2">
                        Opprett arrangement
                    </Typography>
                </Grid>
                <Grid
                    container
                    item
                    xs={6}
                    direction="row"
                    justify="flex-start"
                >
                    <Grid item xs={12}>
                        <Form>
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField
                                        className={classes.textField}
                                        id="eventName"
                                        label="Navn på arrangement"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            className={classes.keyboardDatePicker}
                                            id="startDatePicker"
                                            label="Startdato"
                                            format="yyyy/MM/dd"
                                            variant="inline"
                                            margin="normal"
                                            value={startDateTime}
                                            onChange={(dateEvent) => setStartDateTime(dateEvent)}

                                        />
                                        <KeyboardTimePicker
                                            className={classes.keyboardTimePicker}
                                            id="startTimePicker"
                                            label="Startklokkeslett"
                                            variant="inline"
                                            margin="normal"
                                            value={startDateTime}
                                            onChange={(timeEvent) => setStartDateTime(timeEvent)}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            className={classes.keyboardDatePicker}
                                            id="endDatePicker"
                                            label="Sluttdato"
                                            format="yyyy/MM/dd"
                                            variant="inline"
                                            margin="normal"
                                            value={endDateTime}
                                            onChange={(dateEvent) => setEndDateTime(dateEvent)}

                                        />
                                        <KeyboardTimePicker
                                            className={classes.keyboardTimePicker}
                                            id="endTimePicker"
                                            label="Sluttklokkeslett"
                                            variant="inline"
                                            margin="normal"
                                            value={endDateTime}
                                            onChange={(timeEvent) => setEndDateTime(timeEvent)}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>

                                {/*Dropdown for Lokaler*/}
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        className={classes.textField}
                                        id="venue"
                                        label="Lokale"
                                        fullWidth
                                        value={venueId}
                                        defaultValue=""
                                        onChange={(e) => setVenueId(e.target.value)}
                                    >
                                        {venues.map((venue) => (
                                            <MenuItem key={venue.id} value={venue.id} >
                                                {venue.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                

                                {/*Dropdown for arrangører*/}
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        className={classes.textField}
                                        id="organizer"
                                        label="Organisator"
                                        fullWidth
                                        value={organizerId}
                                        defaultValue=""
                                        onChange={(e) => setOrganizerId(e.target.value)}
                                    >
                                        {organizers.map((organizer) => (
                                            <MenuItem key={organizer.id} value={organizer.id} >
                                                {organizer.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={2}>
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
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        className={classes.button}
                                        startIcon={<SaveIcon />}
                                        onClick={() => setCreateVenue(true) }
                                    >
                                        Legg til nytt lokale
                                    </Button>
                                </Grid>
                                {createVenue ? stopButton : null}
                            </Grid>
                        </Form>
                    </Grid>
                </Grid>

                { createVenue ? createVenueDiv : null}
                
            </Grid>
        </Paper>
    );
}
