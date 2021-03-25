import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import TicketTypeAdminForm from './TicketTypeAdminForm';
import TicketTypeList from './TicketTypeList';


export default function TicketMain() {

    return (
        <>
            <Grid
                container
            >
                {/*Grid container som inneholder admin for billettyper*/}
                <Grid
                    container
                    item
                    xs={12}
                >
                    <Grid
                        container
                        item
                        xs={4}
                    >
                        <TicketTypeAdminForm />
                    </Grid>
                    <Grid
                        item
                        xs={8}
                    >
                        <TicketTypeList />
                    </Grid>
                </Grid>

                {/*Grid container som inneholder admin for kampanjer*/}
                <Grid
                    container
                    item
                    xs={6}
                >
                </Grid>

                {/*Grid container som inneholder en liste over alle solgte billetter. expandable*/}
                <Grid>
                </Grid>
            </Grid>
        </>
    );
}