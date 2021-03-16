import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { Grid, Button, Typography, CardContent, Card, TextField, MenuItem } from '@material-ui/core';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Form } from 'reactstrap';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import authService from '../api-authorization/AuthorizeService';

// Mock venues
const venues = [
    {
        value: 'John Dee',
    },
    {
        value: 'Rockefeller',
    },
    {
        value: 'Spektrum',
    },
];

// Mock organizers
const organizers = [
    {
        value: 'WarpCrew',
    },
    {
        value: 'CarpCrew',
    },
    {
        value: 'WrapCrew',
    },
];

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function CreateEvent() {

    const classes = useStyles();
    const [venue, setVenue] = useState('Tom');

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
    let [isReady, setIsReady] = useState(false);


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
                setIsReady(true);
            }
        }
        getOrganizers();
    }, []);

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography gutterBottom variant="h5" component="h2">
                    Opprett arrangement
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Form>
                    <TextField id="eventName" label="Navn på arrangement" />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>

                        <KeyboardDatePicker
                            id="startDatePicker"
                            label="Startdato"
                            variant="inline"
                            value={startDate}
                            onChange={(dateEvent) => setStartDate(dateEvent)}

                        />
                        <KeyboardTimePicker
                            id="startTimePicker"
                            label="Startklokkeslett"
                            variant="inline"
                            value={startTime}
                            onChange={(timeEvent) => setStartTime(timeEvent)}
                        />

                        <KeyboardDatePicker
                            id="endDatePicker"
                            label="Sluttdato"
                            variant="inline"
                            value={endDate}
                            onChange={(dateEvent) => setEndDate(dateEvent)}

                        />
                        <KeyboardTimePicker
                            id="endTimePicker"
                            label="Sluttklokkeslett"
                            variant="inline"
                            value={endTime}
                            onChange={(timeEvent) => setEndTime(timeEvent)}
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        select
                        id="organizer"
                        label="Organisator"
                    >
                        {organizers.map((organizer) => (
                            <MenuItem key={organizer.id} value={organizer.id}>
                                {organizer.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Form>
            </Grid>
        </Grid>
    );
}
