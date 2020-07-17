import React from 'react'
import {
    StyleSheet,
    TouchableHighlight,
    Image,
} from 'react-native'
import { Layout, Text } from '@ui-kitten/components';

function SearchResult({ id, poster_path, title, type, navigation }) {
    return (
        <Layout style={styles.item}>
            <TouchableHighlight
                underlayColor="#DDDDDD"
                onPress={() => {
                    navigation.navigate('Details', { detailsId: id, type, source: "search" })
                }}>
                <Layout style={styles.grid}>
                    <Image
                        style={{ width: 60, height: 90 }}
                        source={poster_path == null ? require("../../assets/noPoster.png") : { uri: "https://image.tmdb.org/t/p/w154" + poster_path }}
                    />
                    <Text style={styles.title}>{title}</Text>
                </Layout>
            </TouchableHighlight>
        </Layout>
    )
}

const styles = StyleSheet.create({
    title: {
        width: "80%",
        fontSize: 20,
        margin: 5,
    },
    grid: {
        flex: 1,
        flexDirection: "row",
        flexGrow: 1,
        backgroundColor: "#333",
    },
    item: {
        backgroundColor: "#333",
        padding: 5,
        borderRadius: 10,
        borderColor: "black",
        borderWidth: StyleSheet.hairlineWidth
    }
})

export default SearchResult