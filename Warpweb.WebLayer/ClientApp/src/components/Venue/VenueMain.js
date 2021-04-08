import React, { useState, useEffect } from "react";
import VenueInfo from './VenueInfo';
import VenueAdmin from './VenueAdmin';
import VenueList from './VenueList';
import CreateVenue from "./CreateVenue";
import Grid from '@material-ui/core/Grid';
import { Container, Typography, Button, Collapse, Box} from "@material-ui/core";

export default function VenueMain() {
    const [openCreate, setOpenCreate] = useState(false);
    return (
        <Container maxWidth="xl">
            <Typography gutterBottom variant="h5" component="h2">
                Lokaleoversikt
            </Typography>
            <Button variant="contained" color="primary" onClick={() => setOpenCreate(!openCreate)} disableElevation>
                Legg til
            </Button>
            <Collapse in={openCreate} unmountOnExit>
                <Box margin={1}>
                    <CreateVenue />
                </Box>
            </Collapse>
            <VenueList />  
        </Container>
    );
}
