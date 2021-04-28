import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, Button, Paper, TextField, MenuItem} from '@material-ui/core';
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
        }
    }
}))

export default function EditEvent({ event, dialogEditEventOpen, handleDialogEditEventClose, updateListTrigger }) {

    const [changedEvent, setChangedEvent] = useState(event);
    const [organizers, setOrganizers] = useState([]);
    const [venues, setVenues] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

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

    const submitForm = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            const response = await fetch('/api/events', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(changedEvent)
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
                        value={changedEvent.name}
                        onChange={(e) => setChangedEvent(oldValues => ({ ...oldValues, name: e.target.value }))}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            className={classes.keyboardTimePicker}
                            id="startDateTimePicker"
                            label="Start dato og klokkeslett"
                            variant="dialog"
                            margin="normal"
                            ampm={false}
                            format="dd.MM.yyyy HH:mm"
                            value={changedEvent.startDateTime}
                            onChange={(e) => setChangedEvent(oldValues => ({ ...oldValues, startDateTime: e }))}
                            KeyboardButtonProps={{
                                "aria-label": "Endre start dato og tid",
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            className={classes.keyboardTimePicker}
                            id="endDateTimePicker"
                            label="Slutt dato og klokkeslett"
                            variant="dialog"
                            margin="normal"
                            ampm={false}
                            format="dd.MM.yyyy HH:mm"
                            value={changedEvent.endDateTime}
                            onChange={(e) => setChangedEvent(oldValues => ({ ...oldValues, endDateTime: e }))}
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
                        value={changedEvent.venueId}
                        onChange={(e) => setChangedEvent(oldValues => ({ ...oldValues, venueId: e.target.value }))}
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
                            value={changedEvent.organizerId}
                            onChange={(e) => setChangedEvent(oldValues => ({ ...oldValues, descriptionName: e.target.value }))}
                        >
                            {organizers.map((organizer) => (
                                <MenuItem key={organizer.id} value={organizer.id} >
                                    {organizer.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                    <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                    >
                        Lagre
                    </Button>
                </form>
            </Paper>
        </Dialog>
    )
}