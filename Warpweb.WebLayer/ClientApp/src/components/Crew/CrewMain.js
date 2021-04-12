import React, { useState, useEffect } from 'react';
import { Divider, Grid, Paper, Toolbar, Typography} from '@material-ui/core';

import CrewInfo from './CrewInfo';
import CrewAdmin from './CrewAdminMenu';
import CrewMemberList from './CrewMemberList';
import CrewPermissionList from './CrewPermissionList';
import CrewLog from './CrewLog';
import CrewNews from './CrewNews'


export default function CrewMain() {
    const [crew, setCrew] = useState([])
    
    return (
        <Paper>
            <Grid
            container
            spacing={2}
            justify="center"
            >
                <Grid item xs={12}>
                    <Toolbar>
                        <Typography variant="h4" component="h2">
                            Crewnavn
                        </Typography>
                    </Toolbar>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}> 
                    <CrewMemberList />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                    <CrewPermissionList />
                </Grid>
                {/*<Grid item xs={12} sm={6} lg={5}>
                    <CrewLog />
                </Grid>
                <Grid item xs={12} sm={6} lg={12}>
                    <CrewNews />
                </Grid>*/}
            </Grid>
        </Paper>

    );
}