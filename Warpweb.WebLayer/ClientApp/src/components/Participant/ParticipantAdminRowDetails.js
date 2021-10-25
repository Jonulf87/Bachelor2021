import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { intervalToDuration } from 'date-fns/esm/fp';
import useAuth from '../../hooks/useAuth';

export default function ParticipantAdminRowDetails({ rowData, rowMeta, setError, setErrorDialogOpen, setErrors }) {
    const [participantDetails, setParticipantDetails] = useState(null);

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getUserDetails = async () => {
            if (isAuthenticated) {
                const response = await fetch(`/api/users/user/${rowData[0]}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                    method: 'GET',
                });
                if (response.ok) {
                    const result = await response.json();
                    setParticipantDetails(result);
                } else if (response.status === 400) {
                    setParticipantDetails(null);
                    const errorsResult = await response.json();
                    setErrors(errorsResult);
                    setErrorDialogOpen(true);
                } else {
                    setParticipantDetails(null);
                    const errorResult = await response.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        };
        getUserDetails();
    }, [isAuthenticated]);

    const checkUserUnderage = () => {
        const diff = intervalToDuration({
            start: new Date(participantDetails.dateOfBirth),
            end: new Date(),
        });
        if (diff.years < 16) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <>
            {participantDetails !== null && (
                <>
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Adresse:</strong>
                        </TableCell>
                        <TableCell>{participantDetails.address}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Postnummer:</strong>
                        </TableCell>
                        <TableCell>{participantDetails.zipCode}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Kjønn:</strong>
                        </TableCell>
                        <TableCell>{participantDetails.gender}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Allergisk?</strong>
                        </TableCell>
                        <TableCell>{participantDetails.isAllergic ? 'Ja, personen er allergisk' : 'Nei, personen er ikke allergisk'}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    {participantDetails.isAllergic && (
                        <TableRow className="expandedRowDetail">
                            <TableCell></TableCell>
                            <TableCell>
                                <strong>Allergier:</strong>
                            </TableCell>
                            <TableCell>{participantDetails.allergyDescription}</TableCell>
                            <TableCell colSpan={4}></TableCell>
                        </TableRow>
                    )}
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Fødselsdato:</strong>
                        </TableCell>
                        <TableCell>{format(parseISO(participantDetails.dateOfBirth), 'dd.MM.yyyy')}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    {checkUserUnderage() && (
                        <>
                            <TableRow className="expandedRowDetail">
                                <TableCell></TableCell>
                                <TableCell>
                                    <strong>Navn foresatt:</strong>
                                </TableCell>
                                <TableCell>
                                    {participantDetails.parentFirstName} {participantDetails.parentLastName}
                                </TableCell>
                                <TableCell colSpan={4}></TableCell>
                            </TableRow>
                            <TableRow className="expandedRowDetail">
                                <TableCell></TableCell>
                                <TableCell>
                                    <strong>Telefon foresatt:</strong>
                                </TableCell>
                                <TableCell>{participantDetails.parentPhoneNumber}</TableCell>
                                <TableCell colSpan={4}></TableCell>
                            </TableRow>
                            <TableRow className="expandedRowDetail">
                                <TableCell></TableCell>
                                <TableCell>
                                    <strong>E-post foresatt:</strong>
                                </TableCell>
                                <TableCell>{participantDetails.parentEMail}</TableCell>
                                <TableCell colSpan={4}></TableCell>
                            </TableRow>
                        </>
                    )}
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Lag:</strong>
                        </TableCell>
                        <TableCell>{participantDetails.team}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                    <TableRow className="expandedRowDetail">
                        <TableCell></TableCell>
                        <TableCell>
                            <strong>Kommentar:</strong>
                        </TableCell>
                        <TableCell>{participantDetails.comments}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                </>
            )}
        </>
    );
}
