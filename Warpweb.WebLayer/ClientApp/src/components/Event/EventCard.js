import { Card, CardActions, CardContent, Divider, Typography, Button, CardHeader, Link, Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import useAuth from '../../hooks/useAuth';
import { Redirect, useHistory } from 'react-router-dom';
import usePurchase from '../../hooks/usePurchase';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import useSeatMapAdmin from '../../hooks/useSeatMapAdmin';

import { format, parseISO } from 'date-fns';
import 'date-fns';
import { nb } from 'date-fns/locale';
import PopupWindow from '../PopupWindow/PopupWindow';

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
        [theme.breakpoints.up('sm')]: {
            width: 400,
        },
        [theme.breakpoints.up('md')]: {
            minWidth: 580,
        },
    },
}));

export default function EventCard({ id, name, startDateTime, endDateTime, infoComments, venueName, organizerName, organizerWebPage }) {
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const classes = useStyles();
    const history = useHistory();
    const [orgsUserIsAdminAt, setOrgsUserIsAdimAt] = useState([]);
    const [userIsInCrew, setUserIsInCrew] = useState(false);
    const { setSelectedMainEventId, userTickets, setShoppingCart } = usePurchase();
    const { setSelectedEvent, currentEvent } = useCurrentEvent();
    const { setRows } = useSeatMapAdmin();
    const { isOrgAdmin, isAuthenticated, token } = useAuth();

    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    useEffect(() => {
        const getOrgsUserIsAdminAt = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/tenants/getaorgsadmin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setOrgsUserIsAdimAt(result);
                } else if (response.status === 400) {
                    setOrgsUserIsAdimAt([]);
                    const errorResult = await response.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                } else {
                    setOrgsUserIsAdimAt([]);
                    const errorResult = await response.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        };
        getOrgsUserIsAdminAt();
    }, [isOrgAdmin]);

    useEffect(() => {
        const checkUserCrewStatus = async () => {
            if (isAuthenticated) {
                const body = {
                    eventId: id,
                };
                const response = await fetch(`/api/crews/checkusercrewmemberatevent`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(body),
                    method: 'POST',
                });
                if (response.ok) {
                    const result = await response.json();
                    setUserIsInCrew(result);
                } else if (response.status === 400) {
                    setUserIsInCrew(false);
                    const errorResult = await response.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                } else {
                    setUserIsInCrew(false);
                    const errorResult = await response.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        };
        checkUserCrewStatus();
    }, [isAuthenticated]);

    const handleClick = () => {
        if (orgsUserIsAdminAt.some((a) => a.name === organizerName) || userIsInCrew) {
            setSelectedEvent(id);
        }
    };

    const handlePurchaseClick = () => {
        setShoppingCart([]);
        setSelectedMainEventId(id);
        history.push(`/userticket`);
    };

    const buttonSelector = () => {
        if ((orgsUserIsAdminAt.some((a) => a.name === organizerName) || userIsInCrew) && currentEvent !== name) {
            return (
                <Button variant="contained" color="primary" onClick={() => handleClick()}>
                    Sett som aktivt arrangement
                </Button>
            );
        } else if ((orgsUserIsAdminAt.some((a) => a.name === organizerName) || userIsInCrew) && currentEvent === name) {
            return (
                <Button variant="contained" color="primary" disabled>
                    Aktivt arrangement
                </Button>
            );
        } else {
            return (
                <Button variant="contained" color="primary" onClick={() => handlePurchaseClick()}>
                    Kjøp billett
                </Button>
            );
        }
    };

    return (
        <>
            <PopupWindow
                open={errorDialogOpen}
                handleClose={handleErrorDialogClose}
                error={error}
                clearError={setError}
                errors={errors}
                clearErrors={setErrors}
            />
            <Card className={classes.root}>
                <CardHeader title={name} subheader={`Arrangør: ${organizerName}`} />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">
                                {format(parseISO(startDateTime), 'dd.LLLL yyyy', { locale: nb })} til&nbsp;
                                {format(parseISO(endDateTime), 'dd.LLLL yyyy', { locale: nb })}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">{venueName}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2">{infoComments}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                {/*href={organizerWebPage}*/}
                <CardActions>
                    {buttonSelector()}
                    <Button variant="outlined" href={organizerWebPage} target="_blank" rel="noopener noreferrer">
                        {organizerName}s Nettside
                    </Button>
                </CardActions>
            </Card>
        </>
    );
}
