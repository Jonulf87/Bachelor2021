import React, { useState, useEffect } from "react";
import authService from '../api-authorization/AuthorizeService';
import VenueInfo from './VenueInfo';
import VenueAdmin from './VenueAdmin';
import VenueTable from './VenueTable';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";






export default function VenueMain() {
    //const [isReady, setIsReady] = useState(false);
    const [venueList, setVenueList] = useState([]);
    const [venue, setVenue] = useState(3);
    const [isReady, setIsReady] = useState(false);


    
    const handleClick = (e) => {
        const inId = parseInt(e);
        const newRow = venueList.find(obj => {
            return obj.id === inId
        });
        setVenue(newRow);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} >
                <Typography variant="h2">Lokaler</Typography>
            </Grid> 
            <Grid item xs={12}>
                <VenueAdmin />
            </Grid>
            <Grid item xs={9}>
                <VenueTable
                venueList={venueList}
                onClick={handleClick}
                isReady={isReady}
                >
                    <VenueInfo/>
                </VenueTable>
            </Grid>          
        </Grid>
    );
}
