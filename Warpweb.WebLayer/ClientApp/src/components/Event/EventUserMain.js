import React, { useState, useEffect } from 'react';
import { List, ListItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EventCard from './EventCard';
import PopupWindow from '../PopupWindow/PopupWindow';

const useStyles = makeStyles({
    root: {
        justifyContent: 'center',
    },
    header: {
        textAlign: 'center',
    },
});

export default function EventUserMain() {
    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [eventsList, setEventsList] = useState([]);
    const [isReady, setIsReady] = useState(false);

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    const classes = useStyles();

    useEffect(() => {
        const getEvents = async () => {
            const responseEvents = await fetch('/api/events/upcomingevents');

            if (responseEvents.ok) {
                const resultEvents = await responseEvents.json();
                setEventsList(resultEvents);
                setIsReady(true);
            } else if (responseEvents.status === 400) {
                const errorResult = await responseEvents.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            } else {
                const errorResult = await responseEvents.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        };
        getEvents();
    }, []);

    return (
        <>
            <Typography className={classes.header} component="h1" variant="h5">
                Kommende Arrangementer
            </Typography>
            <PopupWindow
                open={errorDialogOpen}
                handleClose={handleErrorDialogClose}
                error={error}
                clearError={setError}
                errors={errors}
                clearErrors={setErrors}
            />
            <List>
                {isReady &&
                    eventsList.length > 0 &&
                    eventsList
                        .sort((a, b) => (a.startDateTime > b.startDateTime ? 1 : a.startDateTime < b.startDateTime ? -1 : 0))
                        .map((event) => (
                            <ListItem className={classes.root} key={event.id}>
                                <EventCard {...event} />
                            </ListItem>
                        ))}
            </List>
        </>
    );
}
