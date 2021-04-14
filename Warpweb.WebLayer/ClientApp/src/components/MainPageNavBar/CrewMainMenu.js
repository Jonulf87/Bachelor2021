import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
    root: {
        '& ': {}
    },
    innerGrid: {

    }
}));

export default function UserMainMenu() {

    const [crewMemberships, setCrewMemberships] = useState([]);

    const { isAuthenticated, token } = useAuth();

    //trenger å endres til å bare hente enkelte brukers
    useEffect(() => {
        const getCrews = async () => {
            if (isAuthenticated) {

                const response = await fetch('/api/crews/allcrews', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setCrewMemberships(result);
            }
        }
        getCrews();
    }, [isAuthenticated])


    return (
        <List
            subheader={
                <ListSubheader color="primary">
                    Mine Crew
                </ListSubheader>
            }
        >
            {crewMemberships.map((crew) => (
                <ListItem
                    key={crew.id}
                    button
                    component={Link}
                    to={{ pathname: `/crew/${crew.id}` }}>
                    <ListItemText color="primary" primary={crew.name} />
                </ListItem>
            ))}


        </List>
    );
}
