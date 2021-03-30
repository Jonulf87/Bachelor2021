import React, { useState, useEffect } from "react";
import VenueInfo from './VenueInfo';
import VenueAdmin from './VenueAdmin';
import VenueTable from './VenueTable';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";

export default function VenueMain() {
    const [venueList, setVenueList] = useState([]);
    const [venue, setVenue] = useState(3);


    
    const handleClick = (e) => {
        const inId = parseInt(e);
        const newRow = venueList.find(obj => {
            return obj.id === inId
        });
        setVenue(newRow);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={10}>
                <VenueTable
                venueList={venueList}
                onClick={handleClick}
                >
                    
                </VenueTable>
            </Grid>          
        </Grid>
    );
}
