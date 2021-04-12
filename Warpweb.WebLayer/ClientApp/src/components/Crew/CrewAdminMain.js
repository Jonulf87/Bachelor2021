import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import UserPicker from '../User/UserPicker';
import CrewAdminList from './CrewAdminList';
import CrewAdminMenu from './CrewAdminMenu';

export default function CrewAdminMain() {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [userAsCrewleader, setUserAsCrewleader] = useState("");

    const { isAuthenticated, token } = useAuth();

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const addCrewLeader = async (userId) => {
        if (isAuthenticated) {
            const response = await fetch(`/api/users/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/sjon'
                }
            });
            const result = await response.json();
            setUserAsCrewleader(result);
        }
    };
    


    return (
        <>
            <CrewAdminMenu handleDialogOpen={handleDialogOpen} userAsCrewleader={userAsCrewleader} />
            <CrewAdminList />

            <UserPicker dialogOpen={dialogOpen} handleDialogClose={handleDialogClose} setUserId={addCrewLeader} />
        </>

    );
}