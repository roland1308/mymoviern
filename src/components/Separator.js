import React from 'react'
import {
    View,
    StyleSheet,
} from 'react-native'

function Separator() {
    return (
        <View style={styles.separator} />
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