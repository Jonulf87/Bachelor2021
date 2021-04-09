import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

export default function NavBarHeader() {

    const [crewName, setCrewName] = useState("Crewcrew")
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
            <Typography variant="h6" noWrap>
                {crewName}
            </Typography>
            <Typography variant="h6" noWrap>
                Krumedlemmer
            </Typography>
            <List
            subheader={
            <ListSubheader color="primary">
                Crewmedlemmer
            </ListSubheader>
            }
            >
                <ListItem>
                    <ListItemText primary='crew medlem' />
                </ListItem>
            </List>
        </>
    );
}