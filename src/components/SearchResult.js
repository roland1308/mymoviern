import React from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    Image,
} from 'react-native'

function SearchResult({ id, poster_path, title, type, navigation }) {
    return (
        <View style={styles.item}>
            <TouchableHighlight
                underlayColor="#DDDDDD"
                onPress={() => {
                    navigation.navigate('Details', { detailsId: id, type })
                }}>
                <View style={styles.grid}>
                    <Image
                        style={{ width: 60, height: 90 }}
                        source={{ uri: "https://image.tmdb.org/t/p/w154" + poster_path }}
                    />
                    <Text style={styles.title}>{title}</Text>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        width: "80%",
        color: "white",
        fontSize: 20,
        margin: 5,
    },
    grid: {
        flex: 1,
        flexDirection: "row",
        flexGrow: 1,
    },
    item: {
        width: "100%",
        backgroundColor: "#333",
        padding: 5
    }
})

export default SearchResult