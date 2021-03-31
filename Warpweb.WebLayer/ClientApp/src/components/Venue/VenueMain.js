import React, { useState, useEffect } from "react";
import VenueInfo from './VenueInfo';
import VenueAdmin from './VenueAdmin';
import VenueTable from './VenueTable';
import Grid from '@material-ui/core/Grid';
import { Container, Typography } from "@material-ui/core";

export default function VenueMain() {

    return (
        <Container maxWidth="xl">
                <VenueTable />  
        </Container>
    );
}
