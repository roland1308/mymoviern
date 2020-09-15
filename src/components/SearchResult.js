import React from 'react'
import {
    StyleSheet,
    TouchableHighlight,
    Image,
    TouchableOpacity,
} from 'react-native'
import { Layout, Text } from '@ui-kitten/components';
import { Icon } from 'react-native-eva-icons'
import { View } from 'native-base';

function SearchResult({ id, poster_path, title, type, navigation, stars, arrayPos, source }) {
    const touchWidth = source === "UserList" ? "91%" : "95%"
    return (
        <View style={styles.item}>
            <TouchableHighlight
                underlayColor="#DDDDDD"
                onPress={() => {
                    if (type === 'movie') {
                        navigation.navigate('Movie Details', { detailsId: id, source: "search" })
                    } else {
                        navigation.navigate('Tv Details', { detailsId: id, source: "search" })
                    }
                }}>
                <Layout style={styles.grid}>
                    <View style={{ flexDirection: "row", width: touchWidth }}>
                        <Image
                            style={{ width: 60, height: 90 }}
                            source={poster_path == null ? require("../../assets/noPoster.png") : { uri: "https://image.tmdb.org/t/p/w154" + poster_path }}
                        />
                        <Text style={styles.subTitle}>
                            <Text style={styles.title}>{title}</Text>
                            {source === "UserList" && "\n" + "⭐️".repeat(stars)}
                        </Text>
                    </View>
                </Layout>
            </TouchableHighlight>
            {
                source === "UserList" &&
                <View style={{ backgroundColor: "#555", borderRadius: 15, justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => {
                        if (type === 'movie') {
                            navigation.navigate('Movie Details Remove', { detailsId: id, source: "remove", arrayPos })
                        } else {
                            navigation.navigate('Tv Details Remove', { detailsId: id, source: "remove", arrayPos })
                        }
                    }}>
                        <Icon name="trash-2-outline" width={25} height={25} fill="#F55" />
                    </TouchableOpacity>
                </View>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
    },
    subTitle: {
        fontSize: 12,
        margin: 5,
    },
    grid: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#333",
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#333",
        padding: 5,
        borderRadius: 10,
        borderColor: "black",
        borderWidth: StyleSheet.hairlineWidth
    }
})

export default SearchResult