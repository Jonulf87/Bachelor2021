import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TextareaAutosize } from '@material-ui/core';
import UserDataCard from './UserDataCard';
import UserTicketCard from './UserTicketCard';
import UserCrewCard from './UserCrewCard';

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
        <>
            <UserDataCard />
            <UserTicketCard />
            <UserCrewCard />
        </>


    );
}