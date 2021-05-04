import React from 'react';
import SeatMapAdminMenu from './SeatMapAdminMenu';
import SeatMapFloor from './SeatMapFloor';
import { Grid } from '@material-ui/core';

export default function SeatMapMain() {



    return (
        <>
            <Grid
                container
                spacing={2}

            >
                <Grid
                    item
                    xs={12}
                    lg={6}
                >
                    <SeatMapFloor />
                </Grid>
                <Grid
                    item
                    xs={12}
                    lg={6}
                >
                    <SeatMapAdminMenu />
                </Grid>
            </Grid>
        </>

    );
}
