import React, { useState, useEffect } from 'react';

import { Container, Typography, List, ListItem, ListItemText } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

export default function CrewPermissionList({ id }) {
    const [crewPermissions, setCrewPermissions] = useState([]);

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getPolicies = async () => {
            if (isAuthenticated) {
                const response = await fetch(`/api/security/allpolicies/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                const result = await response.json();
                setCrewPermissions(result);
            }
        };
        getPolicies();
    }, [isAuthenticated, id]);

    return (
        <Container>
            <Typography variant="h6" component="h3" noWrap>
                Tilgangsområder
            </Typography>
            <List>
                {crewPermissions.some((a) => a.value === 6 && a.crewHasPermission === true) && (
                    <ListItem alignItems="flex-start">
                        <ListItemText primary="Lokaler" />
                    </ListItem>
                )}
                {crewPermissions.some((a) => a.value === 2 && a.crewHasPermission === true) && (
                    <ListItem alignItems="flex-start">
                        <ListItemText primary="Biletter" secondary="" />
                    </ListItem>
                )}
                {crewPermissions.some((a) => a.value === 3 && a.crewHasPermission === true) && (
                    <ListItem>
                        <ListItemText primary="Setekart" />
                    </ListItem>
                )}
                {crewPermissions.some((a) => a.value === 1 && a.crewHasPermission === true) && (
                    <ListItem>
                        <ListItemText primary="Arbeidslag" />
                    </ListItem>
                )}
                {crewPermissions.some((a) => a.value === 7 && a.crewHasPermission === true) && (
                    <ListItem>
                        <ListItemText primary="Deltagere" />
                    </ListItem>
                )}
                {crewPermissions.some((a) => a.value === 4 && a.crewHasPermission === true) && (
                    <ListItem>
                        <ListItemText primary="Brukere" />
                    </ListItem>
                )}
                {crewPermissions.some((a) => a.value === 5 && a.crewHasPermission === true) && (
                    <ListItem>
                        <ListItemText primary="Rapporter" />
                    </ListItem>
                )}
                {crewPermissions.some((a) => a.value === 0 && a.crewHasPermission === true) && (
                    <ListItem>
                        <ListItemText primary="Innsjekk" />
                    </ListItem>
                )}
            </List>
        </Container>
    );
}
