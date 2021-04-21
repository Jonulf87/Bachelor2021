import React, { useState, useEffect } from 'react';
import { Button} from '@material-ui/core';
import { PDFDownloadLink, Document, Page, View, Text } from '@react-pdf/renderer';
import UsersReport from './UsersReport';
import GendersReport from './GendersReport';
import useAuth from '../../hooks/useAuth';

export default function ReportMain() {

    const [userData, setUserData] = useState([]);
    const [genderData, setGenderData] = useState([]);
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getReports = async () => {
            if (isAuthenticated) {
                const responseUsers = await fetch('/api/users/userslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultUsers = await responseUsers.json();
                setUserData(resultUsers);

                const responseGender = await fetch('/api/reports/participantsgenderreport', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultGender = await responseGender.json();
                setGenderData(resultGender);
            }
        }
        getReports();
        

    }, [isAuthenticated]);

    

    return (
        <>
            <PDFDownloadLink
                document={<UsersReport data={userData} />}
                fileName='brukerrapport.pdf'
            >
                {(blob, url, loading, error) => loading ? 'Generer Brukerrapport...' : 'Last ned brukerrapport' }
            </PDFDownloadLink>

            <PDFDownloadLink
                document={<GendersReport data={genderData} />}
                fileName='genderrapport.pdf'
            >
                {(blob, url, loading, error) => loading ? 'Generer Brukerrapport...' : 'Last ned rapport om kjønnsfordeling'}
            </PDFDownloadLink>
        </>


    );
}