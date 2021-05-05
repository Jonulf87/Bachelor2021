import { Card, CardActions, CardContent, Divider, Typography, Button, CardHeader, Link, Grid } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { format, parseISO } from 'date-fns';
import useAuth from '../../hooks/useAuth';
import { Redirect, useHistory } from 'react-router-dom';
import usePurchase from '../../hooks/usePurchase';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import useSeatMapAdmin from '../../hooks/useSeatMapAdmin';

import 'date-fns';
import { nb } from 'date-fns/locale';



const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
        [theme.breakpoints.up('sm')]: {
            width: 400,
        },
        [theme.breakpoints.up('md')]: {
            minWidth: 580,
        },
    }
}));

export default function EventCard({ id, name, startDateTime, endDateTime, infoComments, venueName, organizerName, organizerWebPage }) {

 
    const classes = useStyles();
    const history = useHistory();
    const { setSelectedMainEventId, userTickets } = usePurchase();
    const { setSelectedEvent, currentEvent } = useCurrentEvent();
    const { setRows } = useSeatMapAdmin();

    const handleClick = () => {
        if (userTickets.some(a => a.mainEventName === name && currentEvent !== name)) {
            setSelectedEvent(id);
            setRows([]);
        }
        else {
            setSelectedMainEventId(id)
            history.push(`/userticket`);
        }
    }

    const buttonSelector = () => {
        
        if (userTickets.some(a => a.mainEventName === name) && currentEvent !== name) {
            return (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClick()}
                >
                    Sett som aktivt arrangement
                </Button>
            )
        }
        else if (userTickets.some(a => a.mainEventName === name) && currentEvent === name) {
            return (
                <Button
                    variant="contained"
                    onClick={() => handleClick()}
                    disabled
                >
                    Aktivt arrangement
                 </Button>
            )
        }
        else {
            return (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClick()}
                >
                    Kjøp billett
                </Button>
            )
        }
    }

    return (

        <Card
        className={classes.root}
        >
            <CardHeader
            title={name}
            subheader={`Arrangør: ${organizerName}`}
            />
            <CardContent>
                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <Typography
                            variant="body1"
                        >
                            {format(parseISO(startDateTime), 'dd.LLLL yyyy', {locale: nb })} til&nbsp;{format(parseISO(endDateTime), 'dd.LLLL yyyy', {locale: nb })}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >
                        <Typography
                                variant="body1"
                            >
                            {venueName}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                    >
                        <Link
                            href={organizerWebPage}
                            variant="body2"
                            target="_blank"
                        >
                            {organizerName}s Nettside
                        </Link>
                        <Typography
                            variant="body2"
                        >
                            {infoComments}
                        </Typography>
                    </Grid>

                            
                            
                </Grid>        
            </CardContent>
            <CardActions>
                {buttonSelector()}
            </CardActions>
        </Card>
    )
}
