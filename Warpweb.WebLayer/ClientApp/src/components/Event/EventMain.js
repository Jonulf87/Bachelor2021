import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import EventInfo from './EventInfo';
import EventAdmin from './EventAdmin';
import EventList from './EventList';
import CreateEvent from './CreateEvent';
import useAuth from '../../hooks/useAuth';

export default function EventMain() {

    const [venuePosted, setVenuePosted] = useState();

    const { isOrgAdmin } = useAuth();

    return (
        <>
            {/*<EventInfo />*/}
            <Grid
                item
                xs={12}
                md={6}
            >
                <EventList venuePosted={venuePosted} />
            </Grid>
            <Grid
                item
                xs={12}
                md={6}
            >
                {isOrgAdmin && <CreateEvent setVenuePosted={setVenuePosted} />}
            </Grid>
        </>

    );
}