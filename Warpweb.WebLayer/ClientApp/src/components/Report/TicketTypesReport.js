import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export default function TicketTypesReport({ data }) {
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
                    <Text>Billettype-rapport</Text>
                </View>

                <View style={styles.section}>
                    {data.map((ticket) => (
                        <Text key={ticket.id} style={styles.text}>
                            Type: {ticket.descriptionName} - Antall solgte: {ticket.amountSold} - Antall tilgjengelige:{' '}
                            {ticket.amountAvailable}
                        </Text>
                    ))}
                </View>
            </Page>
        </Document>
    );
}
