import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextareaAutosize } from '@material-ui/core';
import UserDataCard from './UserDataCard';
import UserTicketTable from './UserTicketTable';
import UserCrewTable from './UserCrewTable';

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
            <UserTicketTable />
            <UserCrewTable />
        </>


    );
}