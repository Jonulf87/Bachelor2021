import React, { useEffect, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import EventIcon from '@material-ui/icons/Event';
import GroupIcon from '@material-ui/icons/Group';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EventSeatIcon from '@material-ui/icons/EventSeat';
import SettingsIcon from '@material-ui/icons/Settings';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import useAuth from '../../hooks/useAuth';

export default function AdminMainMenu() {

    const [pullisis, setPullisis] = useState([]);

    const { currentEventChangeCompleteTrigger } = useCurrentEvent();
    const { isAuthenticated, token, roles } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            const getPullisis = async () => {

                const response = await fetch('/api/security/policies', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const result = await response.json();
                setPullisis(result);
                console.log(result);
            }

            getPullisis();
        }
        else {
            setPullisis([]);
        }
    }, [currentEventChangeCompleteTrigger, isAuthenticated])


    return (
        <List>

            <ListItem button button component={Link} to='/venue'>
                <ListItemIcon><HomeWorkIcon /></ListItemIcon>
                <ListItemText primary='Lokaler' />
            </ListItem>

            <ListItem button button component={Link} to='/ticket'>
                <ListItemIcon><ConfirmationNumberIcon /></ListItemIcon>
                <ListItemText primary='Billetter' />
            </ListItem>

            <ListItem button button component={Link} to='/seatmap'>
                <ListItemIcon><EventSeatIcon /></ListItemIcon>
                <ListItemText primary='Setekart' />
            </ListItem>

            <ListItem button component={Link} to='/event'>
                <ListItemIcon><EventIcon /></ListItemIcon>
                <ListItemText primary='Arrangement' />
            </ListItem>

            {pullisis.some(a => a === 1) &&

            (<ListItem button button component={Link} to='/crew'>
                <ListItemIcon><GroupIcon /></ListItemIcon>
                <ListItemText primary='Crewadmin' />
            </ListItem>)
            }


            <ListItem button button component={Link} to='/participant'>
                <ListItemIcon><AssignmentIndIcon /></ListItemIcon>
                <ListItemText primary='Deltagere' />
            </ListItem>

            <ListItem button button component={Link} to='/useradmin'>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary='Brukeradmin' />
            </ListItem>

            <ListItem button button component={Link} to='/report'>
                <ListItemIcon><AssignmentIcon /></ListItemIcon>
                <ListItemText primary='Rapporter' />
            </ListItem>
            {roles.some(a => a === "Admin") &&
                (<ListItem button button component={Link} to='/organizer'>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary='Org. admin' />
                </ListItem>)
            }

        </List>
    );
}
