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
    container: {
        width: "100%",
        flex: 1,
        backgroundColor: '#333',
        padding: 10
    },
    list: {
        height: 207,
    },
    title: {
        width: "80%",
        color: "white",
        fontSize: 20,
        margin: 5,
    },
    search: {
        height: 40,
        width: "80%",
        alignSelf: "center",
        borderColor: 'gray',
        borderRadius: 10,
        borderWidth: 1,
        padding: 5,
        color: "white",
        margin: 5,
        backgroundColor: "#555"
    },
    grid: {
        flex: 1,
        flexDirection: "row",
        flexGrow: 1,
    },
    item: {
        width: "100%",
        backgroundColor: "#555",
        padding: 5
    }
})

export default SearchResult