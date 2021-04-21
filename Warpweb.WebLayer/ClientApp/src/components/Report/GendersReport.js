import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export default function GendersReport({ data }) {

    const styles = StyleSheet.create({
        page: {
            backgroundColor: '#ffffff'
        }
    })

    return (
        <Document>
            <Page style={styles.page}>
                <View>
                    <Text>
                        Antall gutter: {data.maleAmount}
                    </Text>
                    <Text>
                        Antall jenter: {data.femaleAmount}
                    </Text>
                    <Text>
                        Antall som ikke ønsker å oppgi: {data.notDisclosedAmount}
                    </Text>
                    <Text>
                        Antall annet: {data.otherAmount}
                    </Text>
                </View>
            </Page>
        </Document>
    );
}