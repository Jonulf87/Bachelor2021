import React, { useEffect, useState } from 'react';
import { Container, Grid, Snackbar } from '@mui/material';
import UserInfo from './UserInfo';
import UserTickets from './UserTickets';
import { useParams } from 'react-router-dom';
import { Alert } from '@mui/material';
import useAuth from '../../hooks/useAuth';

export default function PaperSheet() {
    const { loggedin } = useParams();
    const { isAuthenticated } = useAuth();
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        if (parseInt(loggedin) === 4) {
            setOpenAlert(true);
        }
    }, [loggedin, isAuthenticated]);

    return <>
        <Snackbar
            open={openAlert}
            autoHideDuration={5000}
            onClose={() => setOpenAlert(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert severity="success" color="success" variant="filled">
                Du har logget inn
            </Alert>
        </Snackbar>

        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} lg={6}>
                <UserInfo />
            </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} lg={6}>
                <UserTickets />
            </Grid>
        </Grid>
    </>;
}
