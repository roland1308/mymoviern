import React, { Component } from 'react'
import {
    Image,
    StyleSheet,
    Linking
} from 'react-native'
import { Layout, Text, Spinner } from '@ui-kitten/components';

import { API_KEY } from 'react-native-dotenv'
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { setOtherBar, setHomeBar } from '../store/actions/generalActions';
import Separator from './components/Separator';
import FormatDate from './components/FormatDate';

const axios = require("axios");

class TvDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            details: {},
            source: null,
            isLoading: true
        }
    }

    componentDidMount() {
        const { detailsId, source } = this.props.route.params
        this.setState({ source })
        let uri = "https://api.themoviedb.org/3/tv/" + detailsId + "?api_key=" + API_KEY + "&language=" + this.props.general.language
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
            details: response.data,
            isLoading: false
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Layout style={{ flex: 1, alignItems: 'center', paddingTop: 50 }}>
                    <Spinner size='giant' />
                </Layout>
            )
        }
        const { name, backdrop_path, overview, first_air_date, last_air_date, homepage } = this.state.details
        const first_date = FormatDate(first_air_date)
        const last_date = FormatDate(last_air_date)
        return (
            <Layout style={styles.container}>
                <Text style={styles.title}>{name}</Text>
                <Image
                    style={{ width: "100%", flex: 0.5 }}
                    source={backdrop_path == null ? require("../assets/noBackdrop.png") : { uri: "https://image.tmdb.org/t/p/w500" + backdrop_path }}
                />
                <Text>Release date: {first_date}</Text>
                <Text>Last date: {last_date}</Text>
                <Text style={{ color: "#A70207", fontSize: 18 }} onPress={() => Linking.openURL(homepage)}>Home Page</Text>
                <Separator />
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