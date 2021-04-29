import React, { useState, useEffect } from 'react';

import { Typography, List, ListItem, ListItemText, ListSubheader, Paper, Toolbar } from '@material-ui/core';
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
            }
        }
        getPolicies();
    }, [isAuthenticated, id])

    return (
        <>
            <Toolbar>
                <Typography variant="h6" component="h3" noWrap>
                    Tilgangsområder
                </Typography>
            </Toolbar>
            <List>
                {crewPermissions.map((permission) => {
                    return permission.crewHasPermission &&
                        <ListItem key={permission.name}>
                            <ListItemText>
                                {permission.name}
                            </ListItemText>
                        </ListItem>
                })}
            </List>
        </>
    );
}