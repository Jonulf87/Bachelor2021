﻿import React, { useState, useEffect } from 'react';
import { List, ListItem } from '@material-ui/core';
import EventCard from './EventCard';

export default function EventUserMain() {

    const [eventsList, setEventsList] = useState([]);
    const [isReady, setIsReady] = useState(false);

    //const setSelectedEvent = async () => { //For å velge arrangement. 
    //    if (isAuthenticated) {
    //        await fetch('/api/events/setcurrentevent', {
    //            headers: {
    //                'Authorization': `Bearer ${token}`,
    //                'content-type': 'application/json'
    //            },
    //            method: 'PUT',
    //            body: JSON.stringify(expanded)
    //        });

    //        setCurrentEvent(eventsList.find(a => a.id === expanded).name);
    //        refreshToken(0, () => {
    //            setCurrentEventChangeCompleteTrigger(oldValue => !oldValue);
    //        });
    //    }
    //}

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