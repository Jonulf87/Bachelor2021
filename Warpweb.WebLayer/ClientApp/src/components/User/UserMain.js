import React from 'react';
import UserInfo from './UserInfo';
import UserTicketTable from './UserTicketTable';
import UserCrewTable from './UserCrewTable';
import { Grid } from '@material-ui/core';

export default function PaperSheet() {

    return (
        <Grid
            container
            spacing={2}
        >
            <Grid
                item
                xs={6}
            >
                <UserInfo />
            </Grid>
            <Grid
                container
                item
                xs={6}
            >
                <Grid
                    item
                    xs={12}
                >
                    <UserCrewTable />
                </Grid>
                <Grid
                    item
                    xs={12}
                >
                    <UserTicketTable />
                </Grid>
            </Grid>
        </Grid>
    );
}
