import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    TouchableHighlight,
    Image
} from 'react-native'

import { API_KEY } from 'react-native-dotenv'
const axios = require("axios");

function Item({ id, poster_path, title }) {
    return (
        <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={() => alert(title)}>
            <Image
                style={{ width: 120, height: 180 }}
                source={{ uri: "https://image.tmdb.org/t/p/w154" + poster_path }}
            />
        </TouchableHighlight>
    )
}

const show_first = [
    {
        key: "1",
        name: "King Lion",
        image: "https://image.tmdb.org/t/p/w154/pBhcbMndqz9aVComPtfDib2mBfW.jpg"
    },
    {
        key: "2",
        name: "King Lion",
        image: "https://image.tmdb.org/t/p/w154/pBhcbMndqz9aVComPtfDib2mBfW.jpg"
    },
    {
        key: "3",
        name: "King Lion",
        image: "https://image.tmdb.org/t/p/w154/pBhcbMndqz9aVComPtfDib2mBfW.jpg"
    },
    {
        key: "4",
        name: "King Lion",
        image: "https://image.tmdb.org/t/p/w154/pBhcbMndqz9aVComPtfDib2mBfW.jpg"
    },
    {
        key: "5",
        name: "King Lion",
        image: "https://image.tmdb.org/t/p/w154/pBhcbMndqz9aVComPtfDib2mBfW.jpg"
    },
    {
        key: "6",
        name: "King Lion",
        image: "https://image.tmdb.org/t/p/w154/pBhcbMndqz9aVComPtfDib2mBfW.jpg"
    },
]

class List extends Component {
    constructor(props) {
        super(props)

        this.state = {
            films: [],
            series: [],
            language: "en-US",
            sort_by: "popularity.desc",
            adult: false,
            video: false,
            page: 1
        }
    }

    componentDidMount() {
        this.getList()
    }

    async getList() {
        try {
            let url =
                "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY +
                "&language=" + this.state.language +
                "&sort_by=" + this.state.sort_by +
                "&include_adult=" + this.state.adult +
                "&include_video=" + this.state.video +
                "&page=" + this.state.page
            let response = await axios.get(url);
            this.setState({
                films: response.data.results
            })
            url =
                "https://api.themoviedb.org/3/discover/tv?api_key=" + API_KEY +
                "&language=" + this.state.language +
                "&sort_by=" + this.state.sort_by +
                "&include_adult=" + this.state.adult +
                "&include_video=" + this.state.video +
                "&page=" + this.state.page
            response = await axios.get(url);
            this.setState({
                series: response.data.results
            })

        } catch (error) {
            console.log(error);
        }
        return;
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.list}>
                    <Text style={styles.title}>Top 20 TMDB Films</Text>
                    <FlatList
                        horizontal
                        ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                        renderItem={({ item }) => (
                            <Item
                                poster_path={item.poster_path}
                                id={item.id}
                                title={item.title}
                            />
                        )}
                        data={this.state.films}
                        keyExtractor={item => item.id.toString()}
                    />
                    <Text style={styles.title}>Top 20 TMDB Series</Text>
                </View>
                <View style={styles.list}>
                    <FlatList
                        horizontal
                        ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                        renderItem={({ item }) => (
                            <Item
                                poster_path={item.poster_path}
                                id={item.id}
                                title={item.name}
                            />
                        )}
                        data={this.state.series}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: 50,
        padding: 15,
        maxHeight: 528
    }, list: {
        maxHeight: 234
    },
    title: {
        color: "white",
        fontSize: 20
    }
})

export default List