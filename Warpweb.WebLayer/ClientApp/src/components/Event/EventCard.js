﻿import { Card, CardContent, Divider, Grid, Typography, Button } from '@material-ui/core';
import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { format, parseISO } from 'date-fns';
import useAuth from '../../hooks/useAuth';
import { Redirect, useHistory } from 'react-router-dom';
import usePurchase from '../../hooks/usePurchase';


const useStyles = makeStyles({
    root: {
        minWidth: 800,
    },

    title: {
        fontSize: 20,
        marginBottom: 12
    },
    divider: {
        minWidth: "100%",
        height: "1px"
    },
    verticalDivider: {
        height: "100%",

    },
    contentBox: {
        minHeight: "200px",
        paddingTop: "20px"
    }
});

export default function EventCard({ id, name, startDateTime, endDateTime, infoComments, venueName, organizerName, organizerWebPage }) {

    const classes = useStyles();
    const history = useHistory();
    const { setSelectedMainEventId } = usePurchase();

    const handleClick = () => {
        setSelectedMainEventId(id)
        history.push(`/userticket`);
    }

    return (

        <Card
            className={classes.root}
        >
            <CardContent>
                <Grid
                    container
                    alignItems="stretch"
                    justify="center"
                    direction="column"
                >
                    <Grid
                        itemxs={12}
                    >
                        <Typography
                            className={classes.title}
                        >
                            {name}
                        </Typography>
                        <Divider className={classes.divider} />
                    </Grid>
                    <Grid
                        item
                        container
                        className={classes.contentBox}
                    >
                        <Grid
                            item
                            xs={5}
                        >
                            <Typography>
                                Praktisk info:
                            </Typography>
                            {format(parseISO(startDateTime), 'dd.MM.yyyy HH:mm')}
                            {format(parseISO(endDateTime), 'dd.MM.yyyy HH:mm')}
                            {venueName}
                            {organizerName}
                            {organizerWebPage}
                        </Grid>
                        <Grid
                            item
                            xs={1}
                        >
                            <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
                        </Grid>
                        <Grid
                            item
                            xs={6}
                        >
                            {infoComments}
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleClick()}
                        >
                            Kjøp billett
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
