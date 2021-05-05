import React, { useEffect } from 'react';
import SeatMapAdminMenu from './SeatMapAdminMenu';
import SeatMapAdminFloor from './SeatMapAdminFloor';
import { Grid } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import useSeatMapAdmin from '../../hooks/useSeatMapAdmin';

export default function SeatMapAdminMain() {

    const { isAuthenticated } = useAuth();
    const { getSeatMap } = useSeatMapAdmin();

    useEffect(() => {
        getSeatMap();
    }, [isAuthenticated])

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
                    <SeatMapAdminFloor />
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
