import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import Separator from './Separator';
import { Layout, Text } from '@ui-kitten/components';

export default function TextScroll(prop) {
    return (
        <Layout style={{ maxHeight: 200 }}>
            <Text style={{ textAlign: 'center', marginBottom: 10 }} category="h4">{prop.title}</Text>
            <Separator />
            <ScrollView>
                <Text style={{ marginTop: 10 }}>{prop.text}</Text>
            </ScrollView>
        </Layout>
    )
}

