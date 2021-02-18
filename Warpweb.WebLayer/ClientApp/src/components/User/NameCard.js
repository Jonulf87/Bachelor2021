import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
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

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

export default function NameCard() {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Fornavn Etternavn
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <List>
                            <ListItem button>
                                <ListItemIcon><BusinessIcon /></ListItemIcon>
                                <ListItemText primary='Adresse' />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><PhoneIcon /></ListItemIcon>
                                <ListItemText primary='Telefon' />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><EmailIcon /></ListItemIcon>
                                <ListItemText primary='E-post' />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><CakeIcon /></ListItemIcon>
                                <ListItemText primary='Fødselsdato' />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                                <ListItemText primary='Nickname' />
                            </ListItem>
                        </List>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
