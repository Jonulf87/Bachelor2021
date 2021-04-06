import React, { useEffect, useState } from 'react';
import { TableCell, TableRow, Typography } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

export default function AdminsList({orgId}) {

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
        <TableRow>
            <TableCell colSpan={4}>
                <h4>Admins</h4>
                {orgAdmins.map(admin => (
                    <Typography>{admin.name}</Typography>
                    ))}
            </TableCell>
        </TableRow>
    )
};