import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Paper, Typography } from '@material-ui/core';


export default function PageNotFound() {
    return (
        <Grid container justify="center" alignItems="center">
            <Grid item>
                <Typography align="center" variant="h4" component="h2">
                    Denne siden finnes ikke
                </Typography>
                <Typography align="center" variant="h6" component={Link} to="/">
                    Gå til framsiden
                </Typography>
            </Grid>
        </Grid>
    )
}