import React, { useState, useEffect } from 'react';
import { Divider, Grid, Paper, Toolbar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

import CrewMemberList from './CrewMemberList';
import CrewPermissionList from './CrewPermissionList';

const useStyles = makeStyles({
    verticalDivider: {
        height: '90%',
    },
});

export default function CrewMain() {
    const [isReady, setIsReady] = useState(false);
    const [isCrewMember, setIsCrewMember] = useState(false);
    const [crew, setCrew] = useState([]);
    const [crewMembers, setCrewMembers] = useState([]);
    const [crewLeaders, setCrewLeaders] = useState([]);
    const { id } = useParams();

    //styling variabler
    const classes = useStyles();
    const theme = useTheme();
    const DisplayVerticalDivider = useMediaQuery(theme.breakpoints.up('sm'));

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getCrews = async () => {
            if (isAuthenticated) {
                //fetch for if-sjekk nedenfor
                const responseMyCrews = await fetch('/api/crews/mycrews', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                const resultMyCrews = await responseMyCrews.json();

                if (resultMyCrews.some((a) => a.id == id)) {
                    //sjekk om brukeren er med i arbeidslag
                    const responseCrew = await fetch(`/api/crews/getcrew/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const resultCrew = await responseCrew.json();
                    setCrew(resultCrew);

                    const responseCrewMembers = await fetch(`/api/crews/crewmembers/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const resultCrewMembers = await responseCrewMembers.json();
                    setCrewMembers(resultCrewMembers);

                    const responseLeader = await fetch(`/api/crews/crewleaders/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const resultLeader = await responseLeader.json();
                    setCrewLeaders(resultLeader);

                    setIsReady(true);
                    setIsCrewMember(true);
                } else {
                    setIsReady(false);
                    setCrewMembers([]);
                    setCrewLeaders([]);
                }
            } else {
                setIsReady(false);
                setCrewMembers([]);
                setCrewLeaders([]);
                setCrew([]);
            }
        };
        getCrews();
    }, [isAuthenticated, id]);

    return (
        <Paper>
            <Grid container spacing={2} justifyContent="flex-start">
                {isCrewMember ? (
                    <>
                        <Grid item xs={12}>
                            <Toolbar>
                                <Typography variant="h4" component="h2">
                                    {crew.crewName}
                                </Typography>
                            </Toolbar>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                            {isReady && <CrewMemberList crewMembers={crewMembers} crewLeaders={crewLeaders} />}
                        </Grid>

                        <Grid item xs={12} sm={1} lg={1}>
                            {DisplayVerticalDivider ? (
                                <Divider flexItem className={classes.verticalDivider} orientation="vertical" />
                            ) : (
                                <Divider variant="middle" />
                            )}
                        </Grid>
                        <Grid item xs={12} sm={5} lg={4}>
                            {isReady && <CrewPermissionList id={crew.crewId} />}
                        </Grid>
                    </>
                ) : (
                    <Grid item>
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
