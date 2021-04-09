import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails,
    CircularProgress, Divider, Grid, Button
} from '@material-ui/core';

import useAuth from '../../hooks/useAuth';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useCurrentEvent from '../../hooks/useCurrentEvent';

const useStyles = makeStyles((theme) =>
    createStyles({

        accordionWrapper: {
            width: '100%',
            '&> :nth-child(even)': {
                '&> div:first-child': {
                    backgroundColor: 'lightgray'
                },

            },
            '&> :nth-child(odd)': {
                '&> div:first-child': {
                    backgroundColor: 'white'
                },
            },
        },
    }),
);

export default function EventList() {

    let [eventsList, setEventsList] = useState([]);
    const [isReady, setIsReady] = useState(false);

    const { isAuthenticated, token, refreshToken } = useAuth();
    const { setCurrentEvent, setCurrentEventChangeCompleteTrigger } = useCurrentEvent();
    

    let [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const getEvents = async () => {

            const response = await fetch('/api/events/eventslist');
            const result = await response.json();
            setEventsList(result);
            setIsReady(true);
        }

        getEvents();

    }, []);

    const setSelectedEvent = async () => {
        if (isAuthenticated) {
            const response = await fetch('/api/events/setcurrentevent', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(expanded)
            });
            setCurrentEvent(eventsList.find(a => a.id === expanded).name);
            refreshToken(0, () => {
                setCurrentEventChangeCompleteTrigger(oldValue => !oldValue);
            });
        }
    }

    function getEventsFromList() {

        return (
            <div className={classes.accordionWrapper}>
                {eventsList.map((mainevent) => (
                    <Accordion
                        key={mainevent.id}
                        expanded={expanded === mainevent.id}
                        onChange={(event, isExpanded) => setExpanded(isExpanded ? mainevent.id : false)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{mainevent.name}</Typography>
                        </AccordionSummary>
                        <Divider />
                        <AccordionDetails>
                            <Grid container>
                                {/*Event details container*/}
                                <Grid item xs={6} container>
                                    <Grid item xs={3}>
                                        <Typography><strong>Startdato</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{mainevent.startDateTime}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid item xs={6} container>
                                    <Grid item xs={3}>
                                        <Typography><strong>Sluttdato</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{mainevent.endDateTime}</Typography>
                                    </Grid>
                                </Grid>
                                {mainevent.venueName &&

                                    <Grid item xs={6} container>
                                        <Grid item xs={3}>
                                            <Typography><strong>Lokale</strong></Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography>{mainevent.venueName}</Typography>
                                        </Grid>
                                    </Grid>
                                }

                                <Grid item xs={6} container>
                                    <Grid item xs={3}>
                                        <Typography><strong>Arrangør</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{mainevent.organizerName}</Typography>
                                    </Grid>
                                </Grid>

                                {isAuthenticated &&
                                    (<Grid item xs={12}>
                                        <Button variant="contained" color="primary" onClick={setSelectedEvent} >Velg arrangement</Button>
                                    </Grid>)
                                }
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        )
    };

    const classes = useStyles();

    return (
        <>
            <Typography>
                <strong>Arrangementsoversikt</strong>
            </Typography>

            {isReady && (<>
                {getEventsFromList()}
            </>)}

            {!isReady && (<CircularProgress />)}
        </>
    );
}