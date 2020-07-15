import React, { Component } from 'react'
import {
    Text,
    Image,
    View,
    StyleSheet,
} from 'react-native'

import { API_KEY } from 'react-native-dotenv'
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';

const axios = require("axios");

class Details extends Component {
    constructor(props) {
        super(props)

        this.state = {
            details: {}
        }
    }

    componentDidMount() {
        const { detailsId, type } = this.props.route.params
        let uri = "https://api.themoviedb.org/3/" + type + "/" + detailsId + "?api_key=" + API_KEY + "&language=" + this.props.general.language
        this.getDetails(uri).done()
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
            <View style={styles.container}>
                <Text style={styles.title}>{title}{name}</Text>
                <Image
                    style={{ width: "100%", height: 210 }}
                    source={{ uri: "https://image.tmdb.org/t/p/w500" + backdrop_path }} />
                <ScrollView>
                    <Text style={styles.overview}>{overview}</Text>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222"
    },
    list: {
        height: 207,

    },
    title: {
        color: "red",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center"
    },
    overview: {
        color: "white",
        margin: 20,
        fontSize: 15,
        fontStyle: "italic"
    }
})

const mapStateToProps = state => ({
    general: state.general,
});
export default connect(mapStateToProps)(Details)
