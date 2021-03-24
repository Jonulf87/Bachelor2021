﻿import React, { useState } from 'react';
import EventInfo from './EventInfo';
import EventAdmin from './EventAdmin';
import EventList from './EventList';
import CreateEvent from './CreateEvent';

export default function EventMain() {

    let [venuePosted, setVenuePosted] = useState();
    return (
        <>

            
            <EventInfo />
            <EventList venuePosted={venuePosted}/>
            <CreateEvent setVenuePosted={setVenuePosted} />
        </>

    );
}