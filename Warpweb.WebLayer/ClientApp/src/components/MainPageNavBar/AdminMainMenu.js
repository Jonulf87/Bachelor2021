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
import clsx from 'clsx';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';

export default function AdminMainMenu() {
    return (
        <React.Fragment>
            <List>
                <ListItem button component={Link} to='/venue'>
                    <ListItemIcon><HomeWorkIcon /></ListItemIcon>
                    <ListItemText primary='Lokale' />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><ConfirmationNumberIcon /></ListItemIcon>
                    <ListItemText primary='Billetter' />
                </ListItem>
                    <ListItem button component={Link} to='/seat'>
                    <ListItemIcon><EventIcon /></ListItemIcon>
                    <ListItemText primary='Arrangement' />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><GroupIcon /></ListItemIcon>
                    <ListItemText primary='Crew' />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><AssignmentIndIcon /></ListItemIcon>
                    <ListItemText primary='Deltagere' />
                </ListItem>
                <ListItem button>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary='Rapporter' />
                </ListItem>
            </List>
        </React.Fragment>
    );
}
