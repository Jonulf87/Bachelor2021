import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import EventUserList from '../Event/EventUserList';
import TicketPicker from './TicketPicker';
import UserLogin from '../User/UserLogin';


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
    const steps = ['Velg arrangement', 'Velg billett', 'Innlogging', 'Oppsummering', 'Betaling', 'Velg sitteplass'];

    const { isAuthenticated } = useAuth();

    const handleNext = () => {
        setActiveStep(oldValue => oldValue + 1);
    };

    const handleBack = () => {
        setActiveStep(oldValue => oldValue - 1);
    };



 

    function getStepContent(step) {
        switch (step) {
            case 0:
                return (<EventUserList />);
            case 1:
                return (<TicketPicker />);
            case 2:
                return (<UserLogin fromTicket={true} /> );
            case 3:
                return `Godkjenn reglene for arrangemntet og vilkår for kjøp. Les og godta.`;
            case 4:
                return `Vis mulighet for å fylle inn manglende påkrevd personalia. Eks. mobil, fødsel, etternavn etc.`;
            case 5:
                return `Klikk her for å betale.`;
            case 6:
                return `Få seatmap og velg sete. Eventuelt vis at seatmap enda ikke er publisert`;
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
                                    <Button
                                        disabled={activeStep === 0}
                                        variant="outlined"
                                        onClick={handleBack}
                                        className={classes.button}
                                    >
                                        Forrige
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Fullfør' : 'Neste'}
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={5} className={classes.resetContainer}>
                    <Typography>Takk for kjøpet - Gleder oss til å se deg</Typography>
                    <Button onClick={ () => setActiveStep(0)} className={classes.button} variant="outlined">
                        Kjøp ny billett
                    </Button>
                </Paper>
            )}
        </div>
    );
}