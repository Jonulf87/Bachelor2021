﻿import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';




export default function PaperSheet({ theme }) {


    const useStyles = makeStyles((theme) => ({
        paper: {
            display: 'flex',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(1),
                width: theme.spacing(16),
                height: theme.spacing(16),
            },
        },
    }));

    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Typography paragraph>
                Her står det noe veldig langt og omfattende noe, jajamensann dette var en lang setning gitt.

            </Typography>
        </Paper>
    );
}