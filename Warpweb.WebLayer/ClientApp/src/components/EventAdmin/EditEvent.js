import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle, Button, Paper, TextField, MenuItem, Grid, Hidden } from '@material-ui/core';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';
import { useFormik } from 'formik';
import * as yup from 'yup';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            width: '100%',
        },
        '& .MuiFormControl-root': {
            width: '100%',
        },
        '& .MuiFormControlLabel-root': {
            width: '100%',
        },
    },
    paper: {
        padding: '10px',
    },
}));

export default function EditEvent({ eventId, dialogEditEventOpen, handleDialogEditEventClose, updateListTrigger }) {
    const [event, setEvent] = useState('');
    const [organizers, setOrganizers] = useState([]);
    const [venues, setVenues] = useState([]);

    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();
    const eventName = useRef();

    useEffect(() => {
        const getEvent = async () => {
            if (isAuthenticated) {
                const responseEvent = await fetch(`/api/events/getmainevent/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                if (responseEvent.ok) {
                    const resultEvent = await responseEvent.json();
                    setEvent(resultEvent);
                    eventName.current = resultEvent.name;
                } else if (responseEvent.status === 400) {
                    const errorResult = await responseEvent.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                } else {
                    const errorResult = await responseEvent.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        };
        getEvent();
    }, [isAuthenticated]);

    useEffect(() => {
        const getVenues = async () => {
            if (isAuthenticated) {
                const response = await fetch(`/api/venues/organizervenueslist`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setVenues(result);
                } else if (response.status === 400) {
                    const errorResult = await response.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                } else {
                    const errorResult = await response.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        };
        getVenues();
    }, [isAuthenticated]);

    const cacheTestEventName = (asyncValidate) => {
        let _valid = false;
        let _value = '';
        let _timeoutId = 0;

        return async (value) => {
            if (value === undefined || value === eventName.current) {
                clearTimeout(_timeoutId);
                return true;
            }

            if (value !== _value) {
                return new Promise(async (resolve) => {
                    clearTimeout(_timeoutId);
                    _timeoutId = setTimeout(async () => {
                        const response = await asyncValidate(value);
                        _value = value;
                        _valid = response;
                        resolve(response);
                    }, 400);
                });
            }
            return _valid;
        };
    };

    const checkEventNameAsync = async (value) => {
        if (isAuthenticated) {
            const responseCheck = await fetch(`/api/events/checkeventname/${value}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
            });
            const result = await responseCheck.json();
            return !result.isUnavailable;
        }
    };

    const eventNameUnique = useRef(cacheTestEventName(checkEventNameAsync));

    const checkDates = () => {
        if (formik.values.startDateTime < formik.values.endDateTime) {
            return true;
        }
        return false;
    };

    const today = new Date();
    today.setMinutes(today.getMinutes() - 20);

    const createEventSchema = yup.object().shape({
        id: yup.number().required(),
        name: yup
            .string()
            .required('Oppgi navn på arrangementet')
            .test('checkEventName', 'Eventnavn er allerede i bruk', eventNameUnique.current),
        startDateTime: yup.date().min(today, 'Du kan ikke opprette et arrangement i fortiden').required('Oppgi starttidspunkt'),
        endDateTime: yup
            .date()
            .test('checkDates', 'Arrangementet kan ikke slutte før det begynner', checkDates)
            .required('Oppgi slutttidspunkt'),
        organizerId: yup.number().required('Du må oppgi organisasjon'),
        venueId: yup.string(),
        infoComments: yup.string(),
        organizerWebPage: yup.string().url('Du må ha med https:// eller lignende'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: event.id || '',
            name: event.name || '',
            startDateTime: event.startDateTime || new Date(),
            endDateTime: event.endDateTime || new Date(),
            organizerId: event.organizerId || '',
            venueId: event.venueId || '',
            infoComments: event.infoComments || '',
            organizerWebPage: event.organizerWebPage || '',
        },
        onSubmit: async (value, e) => {
            if (isAuthenticated) {
                const response = await fetch('/api/events/updateevent', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                    method: 'PUT',
                    body: JSON.stringify(value),
                });
                if (response.ok) {
                    handleDialogEditEventClose();
                    updateListTrigger();
                } else if (response.status === 400) {
                    const errorResult = await response.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                } else {
                    const errorResult = await response.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        },
        validationSchema: createEventSchema,
    });

    return (
        <>
            <PopupWindow
                open={errorDialogOpen}
                handleClose={handleErrorDialogClose}
                error={error}
                clearError={setError}
                errors={errors}
                clearErrors={setErrors}
            />

            <Dialog open={dialogEditEventOpen} onClose={handleDialogEditEventClose}>
                <Paper className={classes.paper}>
                    <DialogTitle>Nytt arrangement</DialogTitle>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="flex-start" className={classes.root}>
                            <Hidden xsUp xlDown>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="id"
                                        name="id"
                                        label="Id"
                                        value={formik.values.id}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.id && Boolean(formik.errors.id)}
                                        helperText={formik.touched.id && formik.errors.id}
                                    />
                                </Grid>
                            </Hidden>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="name"
                                    name="name"
                                    label="Navn"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid xs={12} item>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        autoOk
                                        ampm={false}
                                        required
                                        id="startDateTime"
                                        label="Starttidspunkt"
                                        openTo="year"
                                        views={['year', 'month', 'date', 'hours', 'minutes']}
                                        disablePast
                                        format="dd.MM.yyyy HH.mm"
                                        placeholder="DD/MM/ÅÅÅÅ"
                                        value={formik.values.startDateTime}
                                        onChange={(date) => {
                                            formik.setFieldValue('startDateTime', date);
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                                {Boolean(formik.errors.startDateTime) && (
                                    <p className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error Mui-required">
                                        {formik.errors.startDateTime}
                                    </p>
                                )}
                            </Grid>
                            <Grid xs={12} item>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        autoOk
                                        ampm={false}
                                        required
                                        id="endDateTime"
                                        label="Sluttidspunkt"
                                        openTo="year"
                                        views={['year', 'month', 'date', 'hours', 'minutes']}
                                        minDate={new Date()}
                                        format="dd.MM.yyyy HH.mm"
                                        placeholder="DD/MM/ÅÅÅÅ"
                                        value={formik.values.endDateTime}
                                        onChange={(date) => {
                                            formik.setFieldValue('endDateTime', date);
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                                {Boolean(formik.errors.endDateTime) && (
                                    <p className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error Mui-required">
                                        {formik.errors.endDateTime}
                                    </p>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="infoComments"
                                    name="infoComments"
                                    label="Info"
                                    value={formik.values.infoComments}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.infoComments && Boolean(formik.errors.infoComments)}
                                    helperText={formik.touched.infoComments && formik.errors.infoComments}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="organizerWebPage"
                                    name="organizerWebPage"
                                    label="Nettside"
                                    value={formik.values.organizerWebPage}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.organizerWebPage && Boolean(formik.errors.organizerWebPage)}
                                    helperText={formik.touched.organizerWebPage && formik.errors.organizerWebPage}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    select
                                    id="venueId"
                                    name="venueId"
                                    label="Lokale"
                                    value={formik.values.venueId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.venueId && Boolean(formik.errors.venueId)}
                                    helperText={formik.touched.venueId && formik.errors.venueId}
                                >
                                    {venues.map((venue) => (
                                        <MenuItem key={venue.id} value={venue.id}>
                                            {venue.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Hidden xlUp xlDown>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        name="organizerId"
                                        id="organizerId"
                                        label="Organisator"
                                        fullWidth
                                        value={formik.values.organizerId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.organizerId && Boolean(formik.errors.organizerId)}
                                        helperText={formik.touched.organizerId && formik.errors.organizerId}
                                    >
                                        {organizers.map((organizer) => (
                                            <MenuItem key={organizer.id} value={organizer.id}>
                                                {organizer.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Hidden>
                            <Grid item xs={12}>
                                <Button color="primary" variant="contained" size="large" type="submit">
                                    Lagre
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Dialog>
        </>
    );
}
