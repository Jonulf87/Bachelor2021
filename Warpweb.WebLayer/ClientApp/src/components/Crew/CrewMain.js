import React, { useState, useEffect } from 'react';
import { Grid, Paper, Toolbar, Typography} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";

import useAuth from '../../hooks/useAuth';

import CrewMemberList from './CrewMemberList';
import CrewPermissionList from './CrewPermissionList';


export default function CrewMain() {

    const [isReady, SetIsReady] = useState(false)
    const [isCrewMember, SetisCrewMember] = useState(false)
    const [crew, setCrew] = useState([])
    const [myCrews, setMyCrews] = useState([])
    const [crewMembers, setCrewMembers] = useState([]);
    const [crewLeaders, setCrewLeaders] = useState([]);
    const {id} = useParams();
 
    const { isAuthenticated, token } = useAuth();
    
    useEffect(() => {
        const getCrews = async () => {
            if (isAuthenticated) {

                const responseCrew = await fetch(`/api/crews/getcrew/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const resultCrew = await responseCrew.json();
                setCrew(resultCrew);
                console.log(resultCrew)

                const responseMyCrews = await fetch('/api/crews/mine', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultMyCrews = await responseMyCrews.json();
                setMyCrews(resultMyCrews);
                console.log(resultMyCrews)
                    //sjekk om brukeren er med i arbeidslag
                    if (resultMyCrews.some(a => a.id === resultCrew.crewId)){
                        const responseCrewMembers = await fetch(`/api/crews/crewmembers/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const resultCrewMembers = await responseCrewMembers.json();
                        setCrewMembers(resultCrewMembers);
                        console.log(resultCrewMembers)

                        const responseLeader = await fetch(`/api/crews/crewleaders/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const resultLeader = await responseLeader.json();
                        setCrewLeaders(resultLeader);
                        console.log(resultLeader)

                        SetIsReady(true);
                        SetisCrewMember(true);
                    } else {
                        SetIsReady(false);
                        setCrewMembers([]);
                        setCrewLeaders([]);
                    }

            } else {
                SetIsReady(false);
                setCrewMembers([]);
                setCrewLeaders([]);
                setCrew([]);
                setMyCrews([]);
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
                { isCrewMember ? (
                    <>
                        <Grid item xs={12}>
                            <Toolbar>
                                <Typography variant="h4" component="h2">
                                    {crew.crewName}
                                </Typography>
                            </Toolbar>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={8}> 
                            {isReady && <CrewMemberList crewMembers={crewMembers} crewLeaders={crewLeaders} />}
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                            {isReady && <CrewPermissionList id={crew.crewId} />}
                        </Grid>
                    </>
                ) : (
                    <Grid item >
                        <Typography align="center" variant="h5" component="h2">
                            Du er ikke medlem i dette Arbeidslaget
                        </Typography>
                        <Typography align="center" variant="h6" component={Link} to="/">
                            Gå til framsiden
                        </Typography>
                    </Grid>                    
                )}
            </Grid>
        </Paper>
    );
}