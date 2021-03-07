import React from 'react';
import VenueInfo from './VenueInfo';
import VenueAdmin from './VenueAdmin';
import VenueTable from './VenueTable';
import Grid from '@material-ui/core/Grid';


function createData(id, name, location, sqMeters, maxCapacity) {
    return { id, name, location, sqMeters, maxCapacity };
}

const rows = [
    createData(1, 'Vallhall arena', 'Oslo', '10000', '1337'),
    createData(2, 'Randaberg Camping', 'Randaberg', '423', '52'),
    createData(3, 'Vikingskipet', 'Lillehammer', '9001', '24000'),
    createData(4, 'P35', 'Pilestredet', '10000', '0'),
];

export default function VenueMain() {


    return (
        <Grid container spacing={3}>
            <Grid item xs={9}>
                <VenueInfo venues={rows}/>
            </Grid>
            <Grid item xs={9}>
                <VenueTable venues={rows} />
            </Grid>
            <Grid item xs={3}>
                <VenueAdmin />
            </Grid>           
        </Grid>
    );
}
