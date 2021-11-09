import React, { useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import EventUserList from '../Event/EventUserList';
import TicketPicker from './TicketPicker';
import UserLogin from '../User/UserLogin';
import TicketPurchaseSummary from './TicketPurchaseSummary';
import TicketPayment from './TicketPayment';
import usePurchase from '../../hooks/usePurchase';
import { Navigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
}));

export default function TicketMain() {
    const { login } = useParams();
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(parseInt(login) || 0);
    const { shoppingCart, setPaymentOk, checkedEula, selectedMainEventId, paymentOk } = usePurchase();
    const [firstStepHeader, setFirstStepHeader] = useState('');
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const chooseEventText = () => {
            if (Boolean(selectedMainEventId)) {
                setFirstStepHeader('Valgt arrangement');
            } else {
                setFirstStepHeader('Velg arrangement');
            }
        };
        chooseEventText();
    }, [isAuthenticated, selectedMainEventId]);
    const steps = [firstStepHeader, 'Velg billett', 'Innlogging', 'Oppsummering', 'Betaling', 'Velg sitteplass'];

    const handleNext = () => {
        if (isAuthenticated && activeStep === 1) {
            setActiveStep(3);
        } else if (activeStep === 4) {
            setPaymentOk(false);
            setActiveStep((oldValue) => oldValue + 1);
        } else {
            setActiveStep((oldValue) => oldValue + 1);
        }
    };

    const handleBack = () => {
        if ((isAuthenticated && activeStep === 3) || activeStep == 4) {
            setActiveStep(1);
        } else if (activeStep === 4) {
            setPaymentOk(false);
            setActiveStep((oldValue) => oldValue + 1);
        } else {
            setActiveStep((oldValue) => oldValue - 1);
        }
    };

    useEffect(() => {
        if (activeStep === 2 && isAuthenticated) {
            setActiveStep(3);
        }
    }, [isAuthenticated]);

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <EventUserList />;
            case 1:
                return <TicketPicker />;
            case 2:
                return <UserLogin fromTicket={true} />;
            case 3:
                return <TicketPurchaseSummary />;
            case 4:
                return <TicketPayment />;
            case 5:
                return <Navigate to="/userseatmap" />;
            default:
                return 'Unknown step';
        }
    }
    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            <Typography component={'div'}>{getStepContent(index)}</Typography>
                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button disabled={activeStep === 0} variant="outlined" onClick={handleBack} className={classes.button}>
                                        Forrige
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                        disabled={
                                            (activeStep > 1 && !isAuthenticated) ||
                                            (activeStep === 3 && !checkedEula) ||
                                            (activeStep === 1 && shoppingCart.length === 0) ||
                                            (activeStep === 4 && !paymentOk)
                                        }
                                    >
                                        {activeStep === steps.length - 1 ? 'Fullfør' : 'Neste'}
                                    </Button>
                                    {activeStep === 1 && shoppingCart.length === 0 && (
                                        <Typography color="error">Du må velge minst en billett</Typography>
                                    )}
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={5} className={classes.resetContainer}>
                    <Typography>Takk for kjøpet - Gleder oss til å se deg</Typography>
                    <Button onClick={() => setActiveStep(0)} className={classes.button} variant="outlined">
                        Kjøp ny billett
                    </Button>
                </Paper>
            )}
        </div>
    );
}
