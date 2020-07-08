import React, { Component } from 'react'
import {
    Text,
    TextInput,
    View,
    StyleSheet,
    FlatList,
    TouchableHighlight,
    Image,
    Alert,
    Button,
    Keyboard
} from 'react-native'
import { API_KEY } from 'react-native-dotenv'
import Separator from './components/Separator';

const axios = require("axios");

function Item({ id, poster_path, type, navigation }) {
    return (
        <TouchableHighlight
            underlayColor="#DDDDDD"
            onPress={() => {
                navigation.navigate('Details', { detailsId: id, type })
            }}>
            <Image
                style={{ width: 120, height: 180 }}
                source={{ uri: "https://image.tmdb.org/t/p/w154" + poster_path }}
            />
        </TouchableHighlight>
    )
}

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
            page: 1,
            search: ""
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

    updateSearch(search) {
        this.setState({ search })
    }

    render() {
        const navigation = this.props.navigation
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.search}
                    placeholder="Search for ..."
                    onChangeText={text => this.updateSearch(text)}
                    value={this.state.search}
                    // onSubmitEditing={() => navigation.navigate('Search Result', { search: this.state.search })}
                    onSubmitEditing={() => Keyboard.dismiss()}
                />
                <View style={styles.buttons}>
                    <Button
                        title="Movies"
                        onPress={() => navigation.navigate('Search Result', { search: this.state.search, type: "movie" })}
                    />
                    <Button
                        title="Series"
                        onPress={() => navigation.navigate('Search Result', { search: this.state.search, type: "tv" })}
                    />
                </View>
                <Separator />
                <View style={styles.list}>
                    <Text style={styles.title}>Top 20 TMDB Films</Text>
                    <FlatList
                        horizontal
                        ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                        renderItem={({ item }) => (
                            <Item
                                poster_path={item.poster_path}
                                id={item.id}
                                navigation={this.props.navigation}
                                type="movie"
                            />
                        )}
                        data={this.state.films}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
                <Separator />
                <View style={styles.list}>
                    <Text style={styles.title}>Top 20 TMDB Series</Text>
                    <FlatList
                        horizontal
                        ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
                        renderItem={({ item }) => (
                            <Item
                                poster_path={item.poster_path}
                                id={item.id}
                                title={item.name}
                                navigation={this.props.navigation}
                                type="tv"
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
        backgroundColor: '#333',
    },
    list: {
        height: 207,

    },
    title: {
        color: "white",
        fontSize: 20,
        marginLeft: 15
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
    buttons: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
})

export default List