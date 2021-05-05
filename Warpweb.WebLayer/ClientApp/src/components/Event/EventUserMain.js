import React, { useState, useEffect } from 'react';
import { List, ListItem } from '@material-ui/core';
import EventCard from './EventCard';

export default function EventUserMain() {

    const [eventsList, setEventsList] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const getEvents = async () => {

            const responseEvents = await fetch('/api/events/eventslist');
            const resultEvents = await responseEvents.json();
            setEventsList(resultEvents);
            setIsReady(true);
        }
        getEvents();
    }, []);

    return (
        <List
            style={{maxWidth: 'fit-content', margin: 'auto'}}
        >
            {isReady && eventsList.map((event) => (

                <ListItem key={event.id}>
                    <EventCard {...event} />
                </ListItem>

            ))}
        </List>
    );
}