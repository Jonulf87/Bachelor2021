import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Typography, Accordion, AccordionSummary, AccordionDetails,
    CircularProgress, Divider, Grid
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useAuth from '../../hooks/useAuth';

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

export default function ParticipantList() {

    const [participantList, setParticipantList] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const { isAuthenticated, token } = useAuth();
    const classes = useStyles();

    useEffect(() => {
        const getParticipants = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/users/userslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const result = await response.json();
                setParticipantList(result);
                setIsReady(true);
            }
        }
        getParticipants();
    }, [isAuthenticated]);

    // TODO: Liste deltakere knyttet til spesifikt arrangement
    function getParticipantsFromList() {
        return (
            <div className={classes.accordionWrapper}>
                {participantList.map((participant) => (
                    <Accordion
                        key={participant.id}
                        expanded={expanded === participant.id}
                        onChange={(event, isExpanded) => setExpanded(isExpanded ? participant.id : false)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{participant.firstName} {participant.lastName}</Typography>
                        </AccordionSummary>
                        <Divider />
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {/*Personalia container*/}
                                <Grid item xs={6} container>

                                    <Grid item xs={3}>
                                        <Typography><strong>Fullt navn</strong></Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography>{participant.firstName} {participant.lastName}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        )
    };


    return (
        <>
            <Typography>
                <strong>Deltakere</strong>
            </Typography>

            {isReady && (<>
                {getParticipantsFromList()}
            </>)}

            {!isReady && (<CircularProgress />)}
        </>
    );
}
