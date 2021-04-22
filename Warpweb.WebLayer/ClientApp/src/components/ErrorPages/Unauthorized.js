import React from 'react';
import { Link } from 'react-router-dom';
import {Grid, Typography } from '@material-ui/core';


export default function Unauthorized() {
    return (
        <Grid container justify="center" alignItems="center">
            <Grid item>
                <Typography align="center" variant="h4" component="h2">
                    Du har ikke ikke tilgang til denne siden
                </Typography>
                <Typography align="center" variant="h6" component={Link} to="/">
                    Gå til framsiden
                </Typography>
            </Grid>
        </Grid>
    )
}