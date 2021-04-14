import React, { useState, useEffect } from 'react';
import { Divider, Grid, Paper, Toolbar, Typography} from '@material-ui/core';
import { useParams } from "react-router-dom";

import useAuth from '../../hooks/useAuth';

import CrewInfo from './CrewInfo';
import CrewAdmin from './CrewAdminMenu';
import CrewMemberList from './CrewMemberList';
import CrewPermissionList from './CrewPermissionList';
import CrewLog from './CrewLog';
import CrewNews from './CrewNews'


export default function CrewMain() {

    const [crew, setCrew] = useState([])
    const [isReady, setIsReady] = useState(false);
    const {id} = useParams();
 
    const { isAuthenticated, token } = useAuth();
    
    useEffect(() => {
        const getCrews = async () => {
            if (isAuthenticated) {

                const response = await fetch(`/api/crews/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setCrew(result);
                setIsReady(true)
                
            }
        }
        getCrews();
    }, [isAuthenticated, id])
    
    return (
        <Paper
            variant="outlined"
        >
            <Grid
            container
            spacing={2}
            justify="center"
            >
                <Grid item xs={12}>
                    <Toolbar>
                        <Typography variant="h4" component="h2">
                            {crew.crewName}
                        </Typography>
                    </Toolbar>
                </Grid>
                <Grid item xs={12} sm={12} lg={8}> 
                    {isReady && <CrewMemberList id={crew.crewId} />}
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    {isReady && <CrewPermissionList id={crew.crewId} />}
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                    <CrewNews />
                </Grid>
            </Grid>
        </Paper>

    );
}