import React, { Component } from 'react'
import {
    StyleSheet,
    FlatList,
    TouchableHighlight,
    Image,
    Keyboard
} from 'react-native'
import { API_KEY } from 'react-native-dotenv'
import Separator from './components/Separator';
import { Button, Layout, Text, Input, Spinner } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { setHomeBar } from '../store/actions/generalActions';

const axios = require("axios");

function Item({ id, poster_path, type, navigation }) {
    return (
        <TouchableHighlight
            underlayColor="#DDDDDD"
            onPress={() => {
                if (type === 'movie') {
                    navigation.navigate('Movie Details', { detailsId: id, source: "list" })
                } else {
                    navigation.navigate('Tv Details', { detailsId: id, type, source: "list" })
                }
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
            sort_by: "popularity.desc",
            adult: false,
            video: false,
            page: 1,
            search: "",
            isLoading: true,
        }
    }

    componentDidMount() {
        this.props.dispatch(setHomeBar())
        this.getList()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.general.language != this.props.general.language) {
            this.getList()
        }
    }

    async getList() {
        try {
            let url =
                "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY +
                "&language=" + this.props.general.language +
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
                "&language=" + this.props.general.language +
                "&sort_by=" + this.state.sort_by +
                "&include_adult=" + this.state.adult +
                "&include_video=" + this.state.video +
                "&page=" + this.state.page
            response = await axios.get(url);
            this.setState({
                series: response.data.results,
                isLoading: false
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
        if (this.state.isLoading) {
            return (
                <Layout style={{ flex: 1, alignItems: 'center', paddingTop: 50 }}>
                    <Spinner size='giant' />
                </Layout>
            )
        } const navigation = this.props.navigation
        const { search } = this.state
        return (
            <Layout style={styles.container}>
                <Input
                    style={styles.search}
                    placeholder="Search for ..."
                    onChangeText={text => this.updateSearch(text)}
                    value={this.state.search}
                    onSubmitEditing={() => Keyboard.dismiss()}
                />
                <Layout style={styles.buttons}>
                    <Button
                        onPress={() => (search !== "") && navigation.navigate('Search Result', { search, type: "movie" })}
                    >Movies</Button>
                    <Button
                        onPress={() => (search !== "") && navigation.navigate('Search Result', { search, type: "tv" })}
                    >Series</Button>
                </Layout>
                <Separator />
                <Layout>
                    <Layout style={styles.list}>
                        <Text style={styles.title}>Top 20 TMDB Films</Text>
                        <FlatList
                            horizontal
                            ItemSeparatorComponent={() => <Layout style={{ width: 5 }} />}
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
                    </Layout>
                    <Separator />
                    <Layout style={styles.list}>
                        <Text style={styles.title}>Top 20 TMDB Series</Text>
                        <FlatList
                            horizontal
                            ItemSeparatorComponent={() => <Layout style={{ width: 5 }} />}
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
                    </Layout>
                    <Separator />
                </Layout>
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
    list: {
        marginBottom: 5,
        color: "white"
    },
    title: {
        fontSize: 20,
        marginLeft: 15
    },
    search: {
        height: 40,
        width: "80%",
        alignSelf: "center",
        borderRadius: 10,
        margin: 5,
    },
    buttons: {
        height: 40,
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 5
    },
})
const mapStateToProps = state => ({
    general: state.general,
});
export default connect(mapStateToProps)(List)
