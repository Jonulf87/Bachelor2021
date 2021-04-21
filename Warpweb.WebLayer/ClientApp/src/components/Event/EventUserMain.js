import React, { useState, useEffect } from 'react';
import { List, ListItem } from '@material-ui/core';
import EventCard from './EventCard';

export default function EventUserMain() {

    const [eventsList, setEventsList] = useState([]);
    const [isReady, setIsReady] = useState(false);


    useEffect(() => {
        const getEvents = async () => {

            const response = await fetch('/api/events/eventslist');
            const result = await response.json();
            setEventsList(result);
            setIsReady(true);
        }
        getEvents();
    }, []);

    return (
        <List>
            {isReady && eventsList.map((event) => (

                <ListItem key={event.id}>
                    <EventCard {...event} />
                </ListItem>

            ))}
        </List>
    );
}