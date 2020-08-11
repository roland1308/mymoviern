import React, { Component } from 'react'
import {
    Image,
    StyleSheet,
    Linking,
} from 'react-native'
import { Layout, Text, Spinner, Modal, Card, Button, Icon } from '@ui-kitten/components';

import { API_KEY } from 'react-native-dotenv'
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { setOtherBar, setHomeBar, setDetailBar, setAddMovieStar } from '../store/actions/generalActions';
import Separator from './components/Separator';
import FormatDate from './components/FormatDate';

const axios = require("axios");

class MovieDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            details: {},
            source: null,
            isLoading: true,
            activeSections: [],
            oldStarVote: 0,
            newStarVote: 0,
        }
    }

    componentDidMount() {
        const { detailsId, source } = this.props.route.params
        this.setState({ source })
        let uri = "https://api.themoviedb.org/3/movie/" + detailsId + "?api_key=" + API_KEY + "&language=" + this.props.general.language + "&append_to_response=credits"
        this.getDetails(uri).done()
        this.props.dispatch(setDetailBar())
        this.setState({ newStarVote: this.state.oldStarVote })
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
        const response = await axios.get(uri)
        this.setState({
            details: response.data,
            isLoading: false
        })
        // console.log(response.data.credits.cast.slice(0, 5));
    }

    setVote = (vote) => {
        this.setState({ newStarVote: vote })
    }

    cancelAddStar = () => {
        this.props.dispatch(setAddMovieStar(!this.props.general.addMovieStar))
        this.setState({ newStarVote: this.state.oldStarVote })
    }

    confirmAddStar = () => {
        this.props.dispatch(setAddMovieStar(!this.props.general.addMovieStar))
        this.setState({ oldStarVote: this.state.newStarVote })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Layout style={{ flex: 1, alignItems: 'center', paddingTop: 50 }}>
                    <Spinner size='giant' />
                </Layout>
            )
        }
        const { title, backdrop_path, overview, release_date, tagline, homepage, credits } = this.state.details
        const { newStarVote } = this.state
        const date = FormatDate(release_date)
        const { addMovieStar } = this.props.general
        let stars = newStarVote
        return (
            <Layout style={styles.container}>
                <Modal
                    visible={addMovieStar}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.cancelAddStar()}
                >
                    <Card disabled={true}>
                        <Text>As you saw this movie, please value it</Text>
                        <Layout style={styles.iconsContainer} >
                            <Icon
                                style={styles.icon}
                                name={stars >= 1 ? "star" : "star-outline"}
                                fill='#FFFF00'
                                onPress={() => this.setVote(1)}
                            />
                            <Icon
                                style={styles.icon}
                                name={stars >= 2 ? "star" : "star-outline"}
                                fill='#FFFF00'
                                onPress={() => this.setVote(2)}
                            />
                            <Icon
                                style={styles.icon}
                                name={stars >= 3 ? "star" : "star-outline"}
                                fill='#FFFF00'
                                onPress={() => this.setVote(3)}
                            />
                            <Icon
                                style={styles.icon}
                                name={stars >= 4 ? "star" : "star-outline"}
                                fill='#FFFF00'
                                onPress={() => this.setVote(4)}
                            />
                            <Icon
                                style={styles.icon}
                                name={stars === 5 ? "star" : "star-outline"}
                                fill='#FFFF00'
                                onPress={() => this.setVote(5)}
                            />
                        </Layout>
                        <Layout style={styles.iconsContainer}>
                            <Button style={{ marginTop: 20 }} status='success' onPress={() => this.confirmAddStar()}>
                                Vote
                            </Button>
                            <Button style={{ marginTop: 20 }} status='danger' onPress={() => this.cancelAddStar()}>
                                Cancel
                            </Button>
                        </Layout>
                    </Card>
                </Modal>
                <Text style={styles.title}>{title}</Text>
                <Separator />
                <Image
                    style={{ width: "100%", flex: 0.5 }}
                    source={backdrop_path == null ? require("../assets/noBackdrop.png") : { uri: "https://image.tmdb.org/t/p/w500" + backdrop_path }} />
                <Text style={styles.subTitle}>{tagline}</Text>
                <Separator />
                <Text>Release date: {date}</Text>
                <Text style={{ color: "#A70207", fontSize: 18 }} onPress={() => Linking.openURL(homepage)}>Home Page</Text>
                <Separator />
                <ScrollView style={{ flex: 1 }}>
                    <Text style={styles.overview}>{overview ? overview : "No Description"}</Text>
                </ScrollView>
                <Separator />
                {
                    credits.cast.slice(0, 5).map((item, i) => {
                        return (
                            <Text key={i}>{item.name} - {item.character}</Text>
                        )
                    })
                }
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        paddingTop: 10,
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
    subTitle: {
        color: "red",
        fontSize: 20,
        textAlign: "center",
    },
    overview: {
        margin: 20,
        fontSize: 15,
        fontStyle: "italic",
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    icon: {
        width: 32,
        height: 32,
        marginTop: 10,
    },
})

const mapStateToProps = state => ({
    general: state.general,
});
export default connect(mapStateToProps)(MovieDetails)
