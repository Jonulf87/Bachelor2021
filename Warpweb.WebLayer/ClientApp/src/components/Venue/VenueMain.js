import React from 'react';
import VenueInfo from './VenueInfo';
import VenueAdmin from './VenueAdmin';
import VenueTable from './VenueTable';

export default function VenueMain() {
    return (
        <>  
            <VenueInfo />
            <VenueAdmin />
            <VenueTable />
        </>

    );
}
