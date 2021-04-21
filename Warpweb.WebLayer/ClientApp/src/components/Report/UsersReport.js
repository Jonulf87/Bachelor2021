import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export default function UsersReport({ data }) {

    const styles = StyleSheet.create({
        page: {
            backgroundColor: '#ffffff'
        }
    })

    return (
        <Document>
        {console.log(data)}
            <Page style={styles.page}>
                {data.map((user) => (
                    <View key={user.id}>
                        <Text>
                            {user.firstName}
                        </Text>
                    </View>
                    ))}
            </Page>
        </Document>
    );
}