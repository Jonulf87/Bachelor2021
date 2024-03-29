﻿import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import useAuth from '../../hooks/useAuth';

export default function CrewPermissions({ crewId }) {
    const [allPermissions, setAllPermissions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getPolicies = async () => {
            if (isAuthenticated) {
                const response = await fetch(`/api/security/allpolicies/${crewId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                const result = await response.json();
                setAllPermissions(result);
                setIsReady(true);
            }
        };
        getPolicies();
    }, [isAuthenticated, crewId]);

    const updatePermissionsList = async (e) => {
        const oldPermission = allPermissions.find((a) => a.name === e.target.name);
        oldPermission.crewHasPermission = !oldPermission.crewHasPermission;
        const newPermissions = [...allPermissions.filter((a) => a.name !== e.target.name), oldPermission];
        setAllPermissions(newPermissions);

        if (isAuthenticated) {
            await fetch(`/api/security/setpolicies/${crewId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(newPermissions),
            });
        }
    };

    if (!isReady) {
        return <div>Is loading...</div>;
    }

    return (
        <>
            <FormControl>
                {allPermissions
                    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
                    .map((crewPermission) => (
                        <FormControlLabel
                            key={crewPermission.value}
                            control={
                                <Checkbox
                                    inputProps={{ 'aria-label': crewPermission.name }}
                                    checked={crewPermission.crewHasPermission}
                                    onChange={updatePermissionsList}
                                    name={crewPermission.name}
                                />
                            }
                            label={crewPermission.name}
                        />
                    ))}
            </FormControl>
        </>
    );
}
