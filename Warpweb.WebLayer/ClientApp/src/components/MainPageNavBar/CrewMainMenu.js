import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
    root: {
        '& ':{}
    },
    innerGrid: {

    }
}));

export default function UserMainMenu() {
    const [crewMemberships, setCrewMemberships] = useState([]);
    
    const { isAuthenticated, token } = useAuth();

    /*useEffect(() => {
        const getCrewMemberships = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();
                setUserInfo(result);
            }
        }
        getCrewMemberships();

    }, [isAuthenticated]);*/
    

    return (
        <List
        subheader={
            <ListSubheader color="primary">
                Mine Crew
            </ListSubheader>
        }
        >
            <ListItem button component={Link} to='/crew'>
                <ListItemText color="primary" primary='Et crew' />
            </ListItem>
            <ListItem button component={Link} to='/crew'>
                <ListItemText primary='Annet Crew' />
            </ListItem>

        </List>
    );
}
