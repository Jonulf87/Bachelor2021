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
import { CrewVm, CrewMemberVm, CrewListVm } from './CrewTypes';
import axios from 'axios';

const useStyles = makeStyles({
    verticalDivider: {
        height: '90%',
    },
});

const CrewMain: React.FC = () => {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [isCrewMember, setIsCrewMember] = useState<boolean>(false);
    const [crew, setCrew] = useState<CrewVm | null>(null);
    const [crewMembers, setCrewMembers] = useState<CrewMemberVm[]>([]);
    const [crewLeaders, setCrewLeaders] = useState<CrewMemberVm[]>([]);
    const { id } = useParams();

    //styling variabler
    const classes = useStyles();
    const theme = useTheme();
    const DisplayVerticalDivider = useMediaQuery(theme.breakpoints.up('sm'));

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const getCrews = async () => {
            if (isAuthenticated) {
                //fetch for if-sjekk nedenfor
                const resultMyCrews = await axios.get<CrewListVm[]>('/api/crews/mycrews');

                if (id && resultMyCrews.data.some((a) => a.id === parseInt(id))) {
                    //sjekk om brukeren er med i arbeidslag
                    const resultCrew = await axios.get<CrewVm>(`/api/crews/getcrew/${id}`);
                    setCrew(resultCrew.data);

                    const resultCrewMembers = await axios.get<CrewMemberVm[]>(`/api/crews/crewmembers/${id}`);
                    setCrewMembers(resultCrewMembers.data);

                    const resultLeader = await axios.get<CrewMemberVm[]>(`/api/crews/crewleaders/${id}`);
                    setCrewLeaders(resultLeader.data);

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
                setCrew(null);
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
                                    {crew?.crewName}
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
                            {isReady && <CrewPermissionList id={crew?.crewId} />}
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
};

export default CrewMain;
