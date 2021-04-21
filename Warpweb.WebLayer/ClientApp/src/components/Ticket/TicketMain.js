import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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


function getStepContent(step) {
    switch (step) {
        case 0:
            return `Du må logge inn for å kunne kjøpe billetter.
                Her er link later vi som`;
        case 1:
            return 'Her velger du bilttene du ønsker å kjøpe.';
        case 2:
            return `Godkjenn reglene for arrangemntet og vilkår for kjøp. Les og godta.`;
        case 3:
            return `Vis mulighet for å fylle inn manglende påkrevd personalia. Eks. mobil, fødsel, etternavn etc.`;
        case 4:
            return `Klikk her for å betale.`;
        case 5:
            return `Få seatmap og velg sete. Eventuelt vis at seatmap enda ikke er publisert`;
        default:
            return 'Unknown step';
    }
}

export default function TicketMain() {

    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Innlogging', 'Velg billett', 'Vilkår og rettigher', 'Personalia', 'Betaling', 'Veg sitteplass'];

    const handleNext = () => {
        setActiveStep(oldValue => oldValue + 1);
    };

    const handleBack = () => {
        setActiveStep(oldValue => oldValue - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            <Typography>{getStepContent(index)}</Typography>
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
                <Paper square elevation={0} className={classes.resetContainer}>
                    <Typography>Takk for kjøpet - Gleder oss til å se deg</Typography>
                    <Button onClick={handleReset} className={classes.button} variant="outlined">
                        Kjøp ny billett
          </Button>
                </Paper>
            )}
        </div>
    );
}