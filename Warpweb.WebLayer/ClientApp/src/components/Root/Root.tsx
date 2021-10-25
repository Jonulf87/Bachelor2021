import { Container, CssBaseline } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import AppRouter from '../Approuter';
import MainMenu from '../MainPageNavBar/MainMenu';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    // necessary for content to be below app bar
    toolbar: {
        height: '80px',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        [theme.breakpoints.down('md')]: {
            paddingLeft: '0px',
            paddingRight: '0px',
        },
    },
}));

export const Root: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <MainMenu />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Container maxWidth="xl">
                    <AppRouter />
                </Container>
            </main>
        </div>
    );
};
