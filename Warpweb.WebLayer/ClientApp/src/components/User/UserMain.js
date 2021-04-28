import React from 'react';
import UserInfo from './UserInfo';
import { Grid } from '@material-ui/core';

export default function PaperSheet() {

    return (
        <Grid
            container
            spacing={2}
        >
            <Grid item

            >
                <UserInfo />
            </Grid>
        </Grid>
    );
}
