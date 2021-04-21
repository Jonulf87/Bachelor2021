import { Card, CardContent, Divider, Grid, Typography, Button } from '@material-ui/core';
import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { format, parseISO } from 'date-fns';
import useAuth from '../../hooks/useAuth';
import { Redirect, useHistory } from 'react-router-dom';


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

export default function EventCard({ id, name, endDate, endTime, startDate, startTime, infoComments, venueName, organizerName, organizerWebPage }) {

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();
    const ref = useRef(null);
    const history = useHistory();

    const handleClick = (e) => {
        e.preventDefault();

        if (isAuthenticated) {
            history.push(`/crewadmin/${ref.current.value}`);
        }
        else {
            history.push(`/login/${ref.current.value}`);
        }
        
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
                            {format(parseISO(startDate), 'dd.MM.yyyy')} {format(parseISO(startTime), 'HH:mm')}
                            {format(parseISO(endDate), 'dd.MM.yyyy')} {format(parseISO(endTime), 'HH:mm')}
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
                        <form
                            onSubmit={handleClick}

                        >
                            <input
                                hidden
                                value={id}
                                ref={ref}
                            >
                            </input>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Kjøp billett
                                        </Button>
                        </form>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}