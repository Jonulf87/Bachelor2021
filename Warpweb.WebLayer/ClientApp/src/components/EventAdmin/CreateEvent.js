import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Dialog, DialogTitle, Button, Paper, TextField, MenuItem, Grid } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import PopupWindow from '../PopupWindow/PopupWindow';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { DateTimePicker } from '@mui/lab';

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

export default function CreateEvent({ dialogOpen, handleDialogClose, triggerUpdate }) {
    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const { isAuthenticated, token, refreshToken } = useAuth();
    const classes = useStyles();
    const history = useHistory();
    const { setCurrentEvent, setCurrentEventChangeCompleteTrigger } = useCurrentEvent();
    const [organizerId, setOrganizerId] = useState('');
    //Her følger noen variabler som trengs for å vise rette ting og greier og saker
    const [organizers, setOrganizers] = useState([]);
    const [venues, setVenues] = useState([]);

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    //Henter organizere brukeren er knyttet til
    useEffect(() => {
        const getOrganizers = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/tenants/getaorgsadmin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setOrganizers(result);

                    if (result.length === 1) {
                        setOrganizerId(result[0].id);
                    }
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
        getOrganizers();
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
            if (value === undefined) {
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
        organizerWebPage: yup.string().url('Du må ha med https://'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            startDateTime: new Date(),
            endDateTime: new Date(),
            organizerId: organizerId,
            venueId: '',
            infoComments: '',
            organizerWebPage: '',
        },
        onSubmit: async (value, e) => {
            if (isAuthenticated) {
                const response = await fetch('/api/events/createmainevent', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(value),
                });
                if (response.ok) {
                    triggerUpdate();
                    refreshToken(0, () => {
                        setCurrentEvent(formik.values.name);
                        setCurrentEventChangeCompleteTrigger((oldValue) => !oldValue);
                        history.push('/crewadmin');
                    });
                    handleDialogClose();
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
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <Paper className={classes.paper}>
                    <DialogTitle>Nytt arrangement</DialogTitle>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} alignItems="flex-start" className={classes.root}>
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
                                {Boolean(formik.errors.startDateTime) && (
                                    <p className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error Mui-required">
                                        {formik.errors.startDateTime}
                                    </p>
                                )}
                            </Grid>
                            <Grid xs={12} item>
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
                            <Grid item xs={12}>
                                {organizers.length > 1 && (
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
                                )}
                            </Grid>
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
