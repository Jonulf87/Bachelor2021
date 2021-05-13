import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export default function UsersReport({ data }) {
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
                    <Text>Bruker-rapport</Text>
                </View>

                <View style={styles.section}>
                    {data.map((user) => (
                        <Text key={user.id} style={styles.text}>
                            {user.firstName} {user.lastName} | {user.userName} | {user.eMail}
                        </Text>
                    ))}
                </View>
            </Page>
        </Document>
    );
}
