import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, Button, Paper, TextField, MenuItem } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            padding: theme.spacing(1),
            width: '100%'
        },
        '& .MuiButtonBase-root': {
            padding: '7px',
            margin: '12px'
        }
    }
}))

export default function EditEvent({ eventId, dialogEditEventOpen, handleDialogEditEventClose, updateListTrigger }) {

    const [event, setEvent] = useState("");
    const [organizers, setOrganizers] = useState([]);
    const [venues, setVenues] = useState([]);
    const [organizerId, setOrganizerId] = useState("");
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getEvent = async () => {
            if (isAuthenticated) {
                const responseEvent = await fetch(`/api/events/getmainevent/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultEvent = await responseEvent.json();
                setEvent(resultEvent);
            }
        }
        getEvent();

    }, [isAuthenticated])

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
                // Skjer noe her?
                const response = await fetch(`/api/venues/organizervenueslist`, {
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

    const submitForm = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            const response = await fetch('/api/events', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(event)
            });
            if (response.ok) {
                handleDialogEditEventClose();
                updateListTrigger();
            } else {
                response.text().then(function (text) {
                    setError(text);
                    setOpen(true);
                });
            }
        }
    }


    return (
        <Dialog
            open={dialogEditEventOpen}
            onClose={handleDialogEditEventClose}
        >
            <Paper>
                <DialogTitle>
                    Endre arrangement
                </DialogTitle>
                <form
                    className={classes.root}
                    onSubmit={submitForm}
                >
                    <PopupWindow open={open} onClose={() => setOpen(false)} text={error} />
                    <TextField
                        className={classes.textField}
                        id="eventName"
                        label="Navn på arrangement"
                        required
                        fullWidth
                        variant="outlined"
                        value={event.name}
                        onChange={(e) => setEvent(oldValues => ({ ...oldValues, name: e.target.value }))}
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
                            value={event.startDateTime}
                            onChange={(e) => setEvent(oldValues => ({ ...oldValues, startDateTime: e }))}
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
                            value={event.endDateTime}
                            onChange={(e) => setEvent(oldValues => ({ ...oldValues, endDateTime: e }))}
                            KeyboardButtonProps={{
                                "aria-label": "Endre slutt dato og tid",
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        select
                        variant="outlined"
                        className={classes.textField}
                        id="venue"
                        label="Lokale"
                        fullWidth
                        value={event.venueId || ""}
                        onChange={(e) => setEvent(oldValues => ({ ...oldValues, venueId: e.target.value }))}
                    >
                        {venues.map((venue) => (
                            <MenuItem key={venue.id} value={venue.id} >
                                {venue.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    {organizers.length > 1 && (

                        <TextField
                            select
                            variant="outlined"
                            className={classes.textField}
                            id="organizer"
                            label="Organisator"
                            fullWidth
                            value={event.organizerId}
                            onChange={(e) => setEvent(oldValues => ({ ...oldValues, descriptionName: e.target.value }))}
                        >
                            {organizers.map((organizer) => (
                                <MenuItem key={organizer.id} value={organizer.id} >
                                    {organizer.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                    <TextField
                        className={classes.textField}
                        id="eventComment"
                        label="Kommentarer"
                        fullWidth
                        variant="outlined"
                        value={event.infoComments}
                        onChange={(e) => setEvent(oldValues => ({ ...oldValues, infoComments: e.target.value }))}
                    />
                    <TextField
                        className={classes.textField}
                        id="organizerWebsite"
                        label="Arrangementets nettside"
                        required
                        fullWidth
                        variant="outlined"
                        value={event.organizerWebsite}
                        onChange={(e) => setEvent(oldValues => ({ ...oldValues, organizerWebsite: e.target.value }))}
                    />
                    <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                        size="large"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                    >
                        Lagre
                    </Button>
                </form>
            </Paper>
        </Dialog>
    )
}