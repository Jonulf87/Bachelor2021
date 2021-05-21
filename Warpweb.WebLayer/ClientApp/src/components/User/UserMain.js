import React, { useEffect, useState } from 'react';
import { Grid, Snackbar } from '@material-ui/core';
import UserInfo from './UserInfo';
import UserTickets from './UserTickets';
import { useParams } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
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

    return (
        <>
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
            <Grid container spacing={2}>
                <Grid item>
                    <UserInfo />
                    <UserTickets />
                </Grid>
            </Grid>
        </>
    );
}
