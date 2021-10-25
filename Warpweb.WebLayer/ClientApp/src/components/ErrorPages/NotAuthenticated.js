import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';

export default function NotAuthenticated() {
    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item>
                <Typography align="center" variant="h4">
                    Du må være logget inn for å se denne siden
                </Typography>
                <br />
                <Typography align="center" variant="h6" component={Link} to="/login">
                    Logg inn
                </Typography>
                <br />
                <Typography align="center" variant="h6" component={Link} to="/">
                    Gå til framsiden
                </Typography>
            </Grid>
        </Grid>
    );
}
