import React, { useState, useEffect } from 'react';

import { Divider, Typography, List, ListItem, ListItemText, ListSubheader, Toolbar } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

export default function CrewMmberList() {
    const [crewMembers, setCrewMembers] = useState([])
    
    const { isAuthenticated, token } = useAuth();

    /*useEffect(() => {
        const getCrewMembers = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/crews/....', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();
                setCrewMembers(result);
            }
        }
        getCrewMembers();

    }, [isAuthenticated]);*/

    return (
        <>
            <Toolbar>
                <Typography variant="h6" component="h3" noWrap>
                    Krumedlemmer
                </Typography>
            </Toolbar>
           
            <List
            subheader={
            <ListSubheader color="primary">
                Crewleder
            </ListSubheader>
            }
            >
                <ListItem key="Per ledersen">
                    <ListItemText primary='Per ledersen' />
                </ListItem>
            </List>
            
            <List
            subheader={
            <ListSubheader color="primary">
                Crewmedlemmer
            </ListSubheader>
            }
            >
                {["Jan","Mari", "Tore", "Ingvald", "Janne"].map((crewMember) => (
                <ListItem key={crewMember}>
                    <ListItemText primary={crewMember} />
                </ListItem>
                ))}
            </List>
        </>
    );
}