import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Paper, Typography } from '@mui/material';

export default function PageNotFound() {
    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item>
                <Typography align="center" variant="h4">
                    Denne siden finnes ikke
                </Typography>
                <br />
                <Typography align="center" variant="body1" component={Link} to="/">
                    Gå til framsiden
                </Typography>
            </Grid>
        </Grid>
    );
}
