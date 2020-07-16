import React from 'react'
import { StyleSheet } from 'react-native'
import { Layout } from '@ui-kitten/components';


function Separator() {
    return (
        <Layout style={styles.separator} />
    )
}

const styles = StyleSheet.create({
    separator: {
        margin: 0,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
})

export default Separator