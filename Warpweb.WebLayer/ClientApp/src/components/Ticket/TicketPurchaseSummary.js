import { Card, CardContent, Grid, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function TicketPurchaseSummary() {

    const [userdata, setUserData] = useState(null);
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getUserData = async () => {
            const responseUser = await fetch('/api/users/currentuser', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            });
            const resultUser = await responseUser.json();
            setUserData(resultUser);
        }
        getUserData();
    }, [isAuthenticated])

    return (
        <Grid
            container
            spacing={2}
        >
            <Grid
                item
                xs={6}
            >
                <Card>
                    <CardContent>
                        <Typography>

                        </Typography>
                    </CardContent>
                    
                </Card>
            </Grid>
            <Grid
                item
                xs={6}
            >
                <Paper>
                    2
                </Paper>
            </Grid>
            <Grid
                item
                xs={12}
            >
                <Paper>
                    3
                </Paper>
            </Grid>
        </Grid>
    )
}