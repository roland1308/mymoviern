import React, { Component } from 'react'
import {
    StyleSheet,
    FlatList,
} from 'react-native'
import { Layout } from '@ui-kitten/components';
import { API_KEY } from 'react-native-dotenv'
import SearchResult from './components/SearchResult'
import { connect } from 'react-redux';
import { setHomeBar, setOtherBar } from '../store/actions/generalActions';

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
        this.props.dispatch(setOtherBar())
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.general.isBackButton != this.props.general.isBackButton) {
            this.props.dispatch(setHomeBar())
            this.props.navigation.navigate("Home")
        }
    }

    componentWillUnmount() {
        this.props.dispatch(setHomeBar())
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
            <Layout style={styles.container}>
                <Layout>
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
                        ItemSeparatorComponent={() => <Layout style={{ height: 5 }} />}
                        onEndReachedThreshold="0.5"
                        onEndReached={this.loadMoreData}
                    />
                </Layout>
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        padding: 10
    },
})
const mapStateToProps = state => ({
    general: state.general,
});
export default connect(mapStateToProps)(FindList)
