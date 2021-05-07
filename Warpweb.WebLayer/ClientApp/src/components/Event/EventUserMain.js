import React, { useState, useEffect } from 'react';
import { List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EventCard from './EventCard';
import { CallMissedSharp } from '@material-ui/icons';

const useStyles = makeStyles({
    root: {
        justifyContent: "center"
    },
});

export default function EventUserMain() {
    const [eventsList, setEventsList] = useState([]);
    const [isReady, setIsReady] = useState(false);

    const classes = useStyles();

    useEffect(() => {
        const getEvents = async () => {

            const responseEvents = await fetch('/api/events/upcomingevents');
            const resultEvents = await responseEvents.json();
            setEventsList(resultEvents);
            setIsReady(true);
        }
        getEvents();
    }, []);

    return (
        <List
        >
            {isReady && eventsList.sort((a, b) => (a.startDateTime > b.startDateTime) ? 1 : (a.startDateTime < b.startDateTime) ? -1 : 0).map((event) => (
                <ListItem className={classes.root} key={event.id}>
                    <EventCard {...event} />
                </ListItem>

            ))}
        </List>
    );
}