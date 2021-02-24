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
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
            borderLeft: 0,
            borderTop: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        
        borderBottom: 0,
        padding: 0,

    },
    content: {
        '&$expanded': {
            margin: '0px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

export default function AdminMainMenu() {
    const [expanded, setExpanded] = React.useState('');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : true);
    };

    return (
        <>
            <List>
                <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <ListItem button component={Link} to='/venue' disabled=''>                  
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                        <ListItemIcon><HomeWorkIcon /></ListItemIcon>
                        <ListItemText primary='Lokale' />
                        </AccordionSummary>
                    </ListItem>
                        <AccordionDetails>
                            <Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText primary='Legg til' />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary='se over' />
                                    </ListItem>
                                </List>
                            </Typography>
                        </AccordionDetails>
                </Accordion>
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
        </>
    );
}
