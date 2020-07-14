import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    FlatList,
} from 'react-native'
import { API_KEY } from 'react-native-dotenv'
import SearchResult from './components/SearchResult'

import { connect } from 'react-redux';

const axios = require("axios");

class FindList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            results: {
                page: 1
            },
            page: 1,
        }
    }

    componentDidMount() {
        this.getList()
    }

    async getList() {
        const { search, type } = this.props.route.params
        try {
            let url =
                "https://api.themoviedb.org/3/search/" + type +
                "?api_key=" + API_KEY +
                "&language=" + this.props.general.language +
                "&query=" + search +
                "&page=" + this.state.page +
                "&include_adult=false"
            let response = await axios.get(url)
            this.setState({
                results: this.state.page === 1 ? response.data.results : [...this.state.results, ...response.data.results]
            })
        } catch (error) {
            console.log(error);
        }
        return;
    }

    loadMoreData = () => {
        this.setState({
            page: this.state.page + 1
        }, () => this.getList())
    }

    render() {
        const { type } = this.props.route.params
        return (
            <View style={styles.container}>
                <View>
                    <FlatList
                        renderItem={({ item }) => (
                            <SearchResult
                                poster_path={item.poster_path}
                                title={item.title}
                                id={item.id}
                                title={type === "movie" ? item.title : item.name}
                                navigation={this.props.navigation}
                                type={type}
                            />
                        )}
                        data={this.state.results}
                        keyExtractor={item => item.id.toString()}
                        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                        onEndReachedThreshold="0.5"
                        onEndReached={this.loadMoreData}
                    />
                </View>
            </View>
        )
    }
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
const mapStateToProps = state => ({
    general: state.general,
});
export default connect(mapStateToProps)(FindList)
