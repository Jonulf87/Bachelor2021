import React from 'react';
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
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';

export default function AdminMainMenu() {
    const [expanded, setExpanded] = React.useState('');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : true);
    };

    return (
        <List>

            <ListItem button button component={Link} to='/ticket'>
                <ListItemIcon><ConfirmationNumberIcon /></ListItemIcon>
                <ListItemText primary='Billetter' />
            </ListItem>

                <ListItem button component={Link} to='/event'>
                <ListItemIcon><EventIcon /></ListItemIcon>
                <ListItemText primary='Arrangement' />
            </ListItem>

            <ListItem button button component={Link} to='/crew'>
                <ListItemIcon><GroupIcon /></ListItemIcon>
                <ListItemText primary='Crew' />
            </ListItem>

            <ListItem button button component={Link} to='/participant'>
                <ListItemIcon><AssignmentIndIcon /></ListItemIcon>
                <ListItemText primary='Deltagere' />
            </ListItem>

            <ListItem button button component={Link} to='/report'>
                <ListItemIcon><AssignmentIcon /></ListItemIcon>
                <ListItemText primary='Rapporter' />
            </ListItem>

        </List>
    );
}
