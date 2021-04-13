import React, { useState, useEffect } from 'react';

import { Typography, List, ListItem, ListItemText, ListSubheader, Toolbar } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

export default function CrewPermissionList({ id }) {
    const [crewPermissions, setCrewPermissions] = useState([])
    
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getPolicies = async () => {

            if (isAuthenticated) {
                const response = await fetch(`/api/security/allpolicies/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const result = await response.json();
                setCrewPermissions(result);
                console.log(result)
            }
        }
        getPolicies();
    }, [isAuthenticated])

    return (
        <>
            <Toolbar>
                <Typography variant="h6" component="h3" noWrap>
                    Tilgangsområder
                </Typography>
            </Toolbar>
            <List>
                {/*lister bare alle mulige permission for øyeblikket*/}
                {crewPermissions.map((permission) => (
                <ListItem>
                    <ListItemText>
                        {permission.name}
                    </ListItemText>
                </ListItem>
                ))}
            </List>
        </>
    );
}