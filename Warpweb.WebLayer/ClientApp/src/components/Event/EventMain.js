import React, { useState } from 'react';
import EventInfo from './EventInfo';
import EventAdmin from './EventAdmin';
import EventList from './EventList';
import CreateEvent from './CreateEvent';
import useAuth from '../../hooks/useAuth';

export default function EventMain() {

    let [venuePosted, setVenuePosted] = useState();

    const { roles } = useAuth();

    const createEvent = () => {
        console.log(roles);

        if (roles && roles.some(role => role === 'Admin')) {
            return (<CreateEvent setVenuePosted={setVenuePosted} />)
        }

        return null;
    }

    return (
        <>

            
            <EventInfo />
            <EventList venuePosted={venuePosted} />

            {createEvent()}
        </>

    );
}