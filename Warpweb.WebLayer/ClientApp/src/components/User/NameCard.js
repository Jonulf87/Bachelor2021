import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BusinessIcon from '@material-ui/icons/Business';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import CakeIcon from '@material-ui/icons/Cake';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { CardActionArea } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            maxWidth: 450,
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(0deg)',
        },
    }),
);

export default function PersonDataCard() {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card className={classes.root}>
            <CardActionArea
                className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
            >
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Fornavn Etternavn
                    </Typography>
                </CardContent>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <List>
                            <ListItem>
                                <ListItemIcon><BusinessIcon /></ListItemIcon>
                                <ListItemText primary='Adresse' />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><PhoneIcon /></ListItemIcon>
                                <ListItemText primary='Telefon' />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><EmailIcon /></ListItemIcon>
                                <ListItemText primary='E-post' />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CakeIcon /></ListItemIcon>
                                <ListItemText primary='Fødselsdato' />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                                <ListItemText primary='Nickname' />
                            </ListItem>
                        </List>
                    </Typography>
                </CardContent>
                </Collapse>
            </CardActionArea>
        </Card>
    );
}

