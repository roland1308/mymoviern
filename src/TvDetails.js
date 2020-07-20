import React, { Component } from 'react'
import {
    Image,
    StyleSheet,
    BackHandler
} from 'react-native'
import { Layout, Text } from '@ui-kitten/components';

import { API_KEY } from 'react-native-dotenv'
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { setOtherBar, setHomeBar } from '../store/actions/generalActions';

const axios = require("axios");

class TvDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            details: {},
            source: null
        }
    }

    componentDidMount() {
        const { detailsId, type, source } = this.props.route.params
        this.setState({ source })
        let uri = "https://api.themoviedb.org/3/" + type + "/" + detailsId + "?api_key=" + API_KEY + "&language=" + this.props.general.language
        this.getDetails(uri).done()
        this.props.dispatch(setOtherBar())
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.general.isBackButton != this.props.general.isBackButton) {
            this.props.dispatch(setHomeBar())
            this.setState({ source: "list" })
            this.props.navigation.navigate("Home")
        }
    }

    componentWillUnmount() {
        if (this.state.source === "list") {
            this.props.dispatch(setHomeBar())
        } else {
            this.props.dispatch(setOtherBar())
        }
    }

    async getDetails(uri) {
        const response = await axios.get(uri);
        this.setState({
            details: response.data
        })
    }

    render() {
        const { title, name, backdrop_path, overview } = this.state.details
        return (
            <Layout style={styles.container}>
                <Text style={styles.title}>{title}{name}</Text>
                <Image
                    style={{ width: "100%", flex: 0.5 }}
                    source={backdrop_path == null ? require("../assets/noBackdrop.png") : { uri: "https://image.tmdb.org/t/p/w500" + backdrop_path }} />
                <ScrollView style={{ flex: 1 }}>
                    <Text style={styles.overview}>{overview ? overview : "No Description"}</Text>
                </ScrollView>
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        height: 207,
    },
    title: {
        color: "red",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
    },
    overview: {
        margin: 20,
        fontSize: 15,
        fontStyle: "italic",
    }
})

const mapStateToProps = state => ({
    general: state.general,
});
export default connect(mapStateToProps)(TvDetails)