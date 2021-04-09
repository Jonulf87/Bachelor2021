import React from 'react';
import { Divider, Grid, Paper, Typography} from '@material-ui/core';

import CrewInfo from './CrewInfo';
import CrewAdmin from './CrewAdminMenu';
import CrewMemberList from './CrewMemberList';


export default function CrewMain() {
    return (
        <>
        <Grid
        container
        spacing={2}
        >
            <Grid item xs={12}>
                <Typography variant="h4" component="h2">
                    Crewnavn
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}> 
                <Paper>
                    <CrewMemberList />
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
                <Paper>Liste over rettigheter</Paper>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
                <Paper>Logg</Paper>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
                <Paper>Nyheter, Annonsering, husker ikke nøyaktig</Paper>
            </Grid>
        </Grid>
        </>

    );
}