import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            maxWidth: 500,
            marginBottom: 20,
        },
    }),
);

export default function UserDataCard() {
    const classes = useStyles();
    return (
        <Card className={classes.root}>

            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    Fornavn Etternavn
                    </Typography>
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
        </Card>
    );
}

