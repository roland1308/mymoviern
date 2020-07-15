import React, { Component } from 'react'
import {
    TextInput,
    View,
    StyleSheet,
    FlatList,
    TouchableHighlight,
    Image,
    Keyboard
} from 'react-native'
import { API_KEY } from 'react-native-dotenv'
import Separator from './components/Separator';
import { Button, Layout, MenuItem, OverflowMenu, Card, Modal, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { setLanguage } from '../store/actions/generalActions';
import { TopNavigationAccessoriesShowcase } from './TopBar';

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
            sort_by: "popularity.desc",
            adult: false,
            video: false,
            page: 1,
            search: "",
            visible: false,
            modalVisible: false
        }
    }

    componentDidMount() {
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

    setVisible(status) {
        this.setState({
            visible: status
        })
    }

    setModalVisible(status) {
        this.setState({
            modalVisible: status
        })
    }

    onSelect = (index) => {
        this.setVisible(false);
        switch (index.row) {
            case 2:
                this.setState({
                    modalVisible: true
                })
                break;

            default:
                break;
        }
    };

    renderToggleButton = () => (
        <Button onPress={() => this.setVisible(true)}>
            MENU
        </Button>
    );

    setLang(lang) {
        this.props.dispatch(setLanguage(lang));
        this.setModalVisible(false)
    }

    render() {
        const navigation = this.props.navigation
        const { search, modalVisible, visible } = this.state
        const { language } = this.props.general
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.search}
                    placeholder="Search for ..."
                    onChangeText={text => this.updateSearch(text)}
                    value={this.state.search}
                    onSubmitEditing={() => Keyboard.dismiss()}
                />
                <View style={styles.buttons}>
                    <Button
                        onPress={() => (search !== "") && navigation.navigate('Search Result', { search, type: "movie" })}
                    >Movies</Button>
                    <Button
                        onPress={() => (search !== "") && navigation.navigate('Search Result', { search, type: "tv" })}
                    >Series</Button>
                </View>
                <Separator />
                <View>
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
                    <Separator />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: "#222"
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
        borderColor: 'gray',
        borderRadius: 10,
        borderWidth: 1,
        padding: 5,
        margin: 5,
        backgroundColor: "#555",
        color: "white"
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
