import React, { useState, useEffect } from "react";
import VenueInfo from './VenueInfo';
import Paper from '@material-ui/core/Paper';
import VenueAdmin from './VenueAdmin';
import VenueList from './VenueList';
import CreateVenue from "./CreateVenue";
import Grid from '@material-ui/core/Grid';
import { Toolbar, Container, Typography, Button, Collapse, Box} from "@material-ui/core";

export default function VenueMain() {
    const [openCreate, setOpenCreate] = useState(false);

    return (
        <>
            <Paper>   
            <Toolbar>
                <Button disableRipple disableFocusRipple variant="text" color="primary" onClick={() => setOpenCreate(!openCreate)} disableElevation>
                    {openCreate ? <>Avbryt</> : <>Legg Til Lokale</>}
                </Button>
            </Toolbar>
            <Grid container spacing={2}>
                <Grid container item xs={12}>    
                    <Collapse in={openCreate} unmountOnExit>
                        <Box margin={1}>
                            <CreateVenue />
                        </Box>
                    </Collapse>
                </Grid>
                <Grid item xs={12}>
                        <VenueList /> 

                </Grid>
            </Grid>
            </Paper>
        </>
    );
}
