import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import authService from '../../services/authService';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            //maxWidth: 500,
            padding: 10,
            marginBottom: 10,
        },
    }),
);

export default function VenueInfo(props) {
    const [venue, setVenue] = useState([]);
    const venueId = props.venue;

    useEffect(() => {
        const getVenue = async () => {

                const authenticationResult = await authService.isAuthenticated();

                if (authenticationResult) {
                    const accessToken = await authService.getAccessToken();
                    const response = await fetch(`/api/venues/${venueId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    const result = await response.json();
                    setVenue(result);
                }
            

        }
        getVenue();
    }, []);

    const classes = useStyles();
    
    return (
        <Grid container>
            <Grid item xs={4}>
                <Typography><strong>Id</strong></Typography>
            </Grid>
            <Grid item xs={8}>
                {venue.venueId}
            </Grid>
            <Grid item xs={4}>
                <Typography><strong>Navn</strong></Typography>
            </Grid>
            <Grid item xs={8}>
                {venue.venueName}
            </Grid>
            <Grid item xs={4}>
                <Typography><strong>Adresse</strong></Typography>
            </Grid>
            <Grid item xs={8}>
                {venue.venueAddress}
            </Grid>
            <Grid item xs={4}>
                <Typography><strong>Postnummer</strong></Typography>
            </Grid>
            <Grid item xs={8}>
                {venue.postalCode}
            </Grid>
            <Grid item xs={4}>
                <Typography><strong>Areal</strong></Typography>
            </Grid>
            <Grid item xs={8}>
                {venue.venueAreaAvailable}
            </Grid>
            <Grid item xs={4}>
                <Typography><strong>Kapaitet</strong></Typography>
            </Grid>
            <Grid item xs={8}>
                {venue.venueCapacity}
            </Grid>
            <Grid item xs={4}>
                <Typography><strong>Kontakt</strong></Typography>
            </Grid>
            <Grid item xs={8}>
                {venue.contactId}
            </Grid>
            
            
        </Grid>

    );
}
