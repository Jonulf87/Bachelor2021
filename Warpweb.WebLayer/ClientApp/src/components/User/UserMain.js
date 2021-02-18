import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextareaAutosize } from '@material-ui/core';

export default function PaperSheet({ theme }) {


    const useStyles = makeStyles((theme) => ({
        paper: {
            display: 'flex',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(1),
                width: theme.spacing(TextareaAutosize),
                height: theme.spacing(TextareaAutosize),
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