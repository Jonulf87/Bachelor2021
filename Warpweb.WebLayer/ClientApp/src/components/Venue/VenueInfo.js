import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";
import useAuth from "../../hooks/useAuth";

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

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getVenue = async () => {

            if (isAuthenticated) {
                const response = await fetch(`/api/venues/${venueId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
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
