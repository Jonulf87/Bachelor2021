import React, { useState, useEffect } from 'react';

import { Typography, List, ListItem, ListItemText, ListSubheader, Toolbar } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

export default function CrewPermissionList() {
    const [crewPermissions, setCrewPermissions] = useState(["Lokaleadmin","Billettadmin", "Innsjekkingsadmin"])
    
    const { isAuthenticated, token } = useAuth();

    /*useEffect(() => {
        const getcrewPermissions = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/security/....', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();
                setCrewPermissions(result);
            }
        }
        getcrewPermissions();

    }, [isAuthenticated]);*/

    return (
        <>
            <Toolbar>
                <Typography variant="h6" component="h3" noWrap>
                    Tilgangsområder
                </Typography>
            </Toolbar>
            <List
            >
                {crewPermissions.map((persmission) => (
                <ListItem key={persmission}>
                    <ListItemText primary={persmission} />
                </ListItem>
                ))}
            </List>
        </>
    );
}