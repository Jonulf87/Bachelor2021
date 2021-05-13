import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export default function GendersReport({ data }) {
    const styles = StyleSheet.create({
        page: {
            backgroundColor: '#ffffff',
            margin: '15px',
        },
        section: {
            fontSize: 14,
            margin: 2,
            padding: 2,
        },
        text: {
            fontSize: 12,
            margin: 2,
            padding: 2,
        },
    });

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.section}>
                    <Text>Kjønnsfordelings-rapport</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.text}>Antall gutter: {data.maleAmount}</Text>
                    <Text style={styles.text}>Antall jenter: {data.femaleAmount}</Text>
                    <Text style={styles.text}>Antall som ikke ønsker å oppgi: {data.notDisclosedAmount}</Text>
                    <Text style={styles.text}>Antall annet: {data.otherAmount}</Text>
                </View>
            </Page>
        </Document>
    );
}
