import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing(3),
    },
}));

export default function CrewPermissions({ crewId }) {

    const [allPermissions, setAllPermissions] = useState();

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getPolicies = async () => {

            if (isAuthenticated) {
                const response = await fetch(`/api/security/allpolicies/${crewId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const result = await response.json();
                setAllPermissions(result);
                console.log(allPermissions);
            }
        }
        getPolicies();
    }, [isAuthenticated])

    const classes = useStyles();




    return (
        <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Tillatelser</FormLabel>
                {/*<FormGroup>


                    <FormControlLabel
                        control={<Checkbox checked={gilad} onChange={handleChange} name="gilad" />}
                        label="Gilad Gray"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={jason} onChange={handleChange} name="jason" />}
                        label="Jason Killian"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={antoine} onChange={handleChange} name="antoine" />}
                        label="Antoine Llorca"
                    />
                </FormGroup>*/}
                <FormHelperText>Be careful</FormHelperText>
            </FormControl>
        </div>
    );
}