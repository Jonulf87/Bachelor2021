import React from 'react';
import { Grid } from '@material-ui/core';
import UserInfo from './UserInfo';
import UserTickets from './UserTickets';

export default function PaperSheet() {
    return (
        <Grid container spacing={2}>
            <Grid item>
                <UserInfo />
                <UserTickets />
            </Grid>
        </Grid>
    );
}
