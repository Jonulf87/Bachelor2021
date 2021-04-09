import React, { useEffect, useState } from 'react';
import { Button, TableCell, TableRow, Typography } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';


export default function AdminsList({ orgId, handleDialogOpen }) {


    const [orgAdmins, setOrgAdmins] = useState([]);
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getAdminsAtOrg = async () => {

            if (isAuthenticated) {
                const response = await fetch(`/api/tenants/getadmins/${orgId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setOrgAdmins(result);
            }
        }
        getAdminsAtOrg();
        console.log(orgAdmins);
    }, [isAuthenticated]);



    return (
        <>
            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>

                <TableCell colSpan={1}>
                    <Typography variant="h4" >Admins</Typography>
                </TableCell>

            </TableRow>




            {orgAdmins.map(admin => (
                <TableRow key={admin.name}>
                    <TableCell colSpan={1}>
                    </TableCell>
                    <TableCell colSpan={3}>
                        <Typography>{admin.name}</Typography>
                    </TableCell>
                </TableRow>
            ))}
            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={3}>
                    <Button color="primary" variant="contained" onClick={handleDialogOpen}>Legg til admin</Button>
                </TableCell>
            </TableRow>

            

        </>

    )
};