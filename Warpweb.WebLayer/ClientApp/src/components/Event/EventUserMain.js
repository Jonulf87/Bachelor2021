import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import EventUserList from './EventUserList';

export default function EventUserMain() {



    return (
        <>
            <Grid
                item
                xs={12}
                md={6}
            >
                <EventUserList />
            </Grid>

        </>

    );
}