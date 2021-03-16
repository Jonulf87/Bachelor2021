import React from 'react';
import EventInfo from './EventInfo';
import EventAdmin from './EventAdmin';
import EventList from './EventList';

export default function EventMain() {
    return (
        <>

            
            <EventInfo />
            <EventList />
            <EventAdmin />
        </>

    );
}