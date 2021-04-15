import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import VenueInfo from './VenueInfo';
import Paper from '@material-ui/core/Paper';
import VenueAdmin from './VenueAdmin';
import VenueList from './VenueList';
import CreateVenue from "./CreateVenue";
import Grid from '@material-ui/core/Grid';
import { Toolbar, Container, Typography, Button, Collapse, Box} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        //marginLeft: '20%',
        //marginRight: '20%',
        [theme.breakpoints.down('sm')]: {
            marginLeft: 'none',
            marginRight: 'none'
        },
        [theme.breakpoints.up('sm')]: {
            marginLeft: '10%',
            marginRight: '10%',
        },
        [theme.breakpoints.up('lg')]: {
            marginLeft: '20%',
            marginRight: '20%',
        },
    }
}));

export default function VenueMain() {
    const [openCreate, setOpenCreate] = useState(false);

    const classes = useStyles();

    return (
        <>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Paper>
                                <Toolbar>
                                    <Button
                                        disableRipple
                                        disableFocusRipple
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setOpenCreate(!openCreate)} disableElevation
                                    >
                                        {openCreate ? <>Avbryt</> : <>Legg Til Lokale</>}
                                    </Button>
                                </Toolbar>
                                <Collapse in={openCreate} unmountOnExit>
                                    <Box className={classes.root} margin={1}>
                                        <CreateVenue />
                                    </Box>
                                </Collapse>                                
                            </Paper>                            
                        </Grid>
                        <Grid item xs={12}>
                            <VenueList /> 
                        </Grid>
                    </Grid>  
        </>
    );
}
