import { Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import React from 'react';

export default function OrganizerAdminList() {
    return (
        <>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Typography>
                                Dette er en test
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}