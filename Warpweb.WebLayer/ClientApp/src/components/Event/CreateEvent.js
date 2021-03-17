import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Grid, Button, Typography, Paper, TextField, MenuItem } from '@material-ui/core';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Form } from 'reactstrap';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import authService from '../api-authorization/AuthorizeService';

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
    let [name, setName] = useState();
    let [startDate, setStartDate] = useState();
    let [startTime, setStartTime] = useState();
    let [endDate, setEndDate] = useState();
    let [endTime, setEndTime] = useState();
    let [organizerId, setOrganizerId] = useState(null);
    let [venueId, setVenueId] = useState(null);

    //Her følger noen variabler som trengs for å vise rette ting og greier og saker
    let [organizers, setOrganizers] = useState([]);
    let [venues, setVenues] = useState([]);
    let [isOrganizerReady, setIsOrganizerReady] = useState(false);
    let [isVenueReady, setIsVenueReady] = useState(false);


    //const handleChangeOrganizer = (event) => {
    //    setOrganizer(event.target.value);
    //};

    //const handleChangeVenue = (event) => {
    //    setVenue(event.target.value);
    //};

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

    useEffect(() => {
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
        getVenues();
    }, []);

    return (
        <Paper variant="outlined" elevation={2}>
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <Typography className={classes.typography} gutterBottom variant="h5" component="h2">
                        Opprett arrangement
                </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Form>
                        <Grid item xs={12}>
                            <TextField className={classes.textField} id="eventName" label="Navn på arrangement" fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    className={classes.keyboardDatePicker}
                                    id="startDatePicker"
                                    label="Startdato"
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
                                    value={startTime}
                                    onChange={(timeEvent) => setStartTime(timeEvent)}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    className={classes.keyboardDatePicker}
                                    id="endDatePicker"
                                    label="Sluttdato"
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
                                    value={endTime}
                                    onChange={(timeEvent) => setEndTime(timeEvent)}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                defaultValue=""
                                className={classes.textField}
                                id="organizer"
                                label="Organisator"
                                fullWidth
                            >
                                {organizers.map((organizer) => (
                                    <MenuItem key={organizer.id} value={organizer.id}>
                                        {organizer.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                defaultValue=""
                                className={classes.textField}
                                id="venue"
                                label="Lokale"
                                fullWidth
                            >
                                {venues.map((venue) => (
                                    <MenuItem key={venue.id} value={venue.id}>
                                        {venue.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Form>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                    >
                        Lagre
                </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}
