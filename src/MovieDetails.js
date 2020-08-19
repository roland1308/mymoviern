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
import { setOtherBar, setHomeBar, setDetailBar, setAddMovieStar, setAlreadyStarred } from '../store/actions/generalActions';
import Separator from './components/Separator';
import FormatDate from './components/FormatDate';
import { addMovieToUser } from '../store/actions/userActions';
import { Row } from 'native-base';

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
            position: null,
            totStars: 0,
            views: 0
        }
    }

    componentDidMount() {
        const { detailsId, source } = this.props.route.params
        const { movies, movieStars } = this.props.user
        const index = movies.indexOf(detailsId)
        let uri = "https://api.themoviedb.org/3/movie/" + detailsId + "?api_key=" + API_KEY + "&language=" + this.props.general.language + "&append_to_response=credits"
        if (index !== -1) {
            this.props.dispatch(setAlreadyStarred(true))
            this.setState({ oldStarVote: movieStars[index], newStarVote: movieStars[index], position: index })
        } else {
            this.props.dispatch(setAlreadyStarred(false))
            this.setState({ position: movies.length })
        }
        this.setState({ source })
        this.getDetails(uri).done()
        this.props.dispatch(setDetailBar())
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
        const request = await axios.get(uri)
        const request1 = await axios.get("https://mymoviesback.herokuapp.com/films/getstats/" + this.props.route.params.detailsId)
        axios.all([request, request1]).then(axios.spread((...responses) => {
            const response = responses[0]
            const response1 = responses[1]
            if (response.status === 200) {
                this.setState({
                    details: response.data,
                })
            } else {
                this.setState({ error: true, errorMsg: response.data.status_message })
                return
            }
            if (response1.status === 200) {
                const { totStars, views } = response1.data
                this.setState({
                    totStars,
                    views,
                    isLoading: false
                })
            } else {
                console.log(response1.data.status_message)
                return
            }
        })).catch(errors => {
            console.log(errors)
        })
        return
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
        const data = {
            index: this.state.position,
            userName: this.props.user.userName,
            movieId: this.props.route.params.detailsId,
            stars: this.state.newStarVote,
            starsToAdd: this.state.newStarVote - this.state.oldStarVote,
            alreadyStarred: this.props.general.alreadyStarred
        }
        this.setState({
            oldStarVote: data.newStarVote,
            views: (this.state.views || 0) + (1 && !data.alreadyStarred),
            totStars: (this.state.totStars || 0) + data.starsToAdd
        })
        this.props.dispatch(addMovieToUser(data))
        this.props.dispatch(setAlreadyStarred(true))
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
        const { newStarVote, totStars, views } = this.state
        const date = FormatDate(release_date)
        const { addMovieStar } = this.props.general
        const starItems = []
        for (let i = 1; i < 6; i++) {
            starItems.push(
                <Icon
                    key={i}
                    style={styles.icon}
                    name={i <= newStarVote ? "star" : "star-outline"}
                    fill='#FFFF00'
                    onPress={() => this.setVote(i)}
                />
            )
        }
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
                            {starItems}
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
                <Layout style={styles.votes}>
                    <Text>Release date: {date}</Text>
                    <Layout style={styles.votes}>
                        <Icon
                            style={styles.iconSmall}
                            name="star"
                            fill='#FFFF00'
                        />
                        <Text>{(totStars / views) || 0}</Text>
                    </Layout>
                </Layout>
                <Layout style={styles.votes}>
                    <Text style={{ color: "#A70207", fontSize: 18 }} onPress={() => Linking.openURL(homepage)}>Home Page</Text>
                    <Layout style={styles.votes}>
                        <Icon
                            style={styles.iconSmall}
                            name="eye"
                            fill='#00FF00'
                        />
                        <Text>{views || 0}</Text>
                    </Layout>
                </Layout>
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
    iconSmall: {
        width: 22,
        height: 22,
        marginRight: 10
    },
    votes: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})

const mapStateToProps = state => ({
    general: state.general,
    user: state.user
});
export default connect(mapStateToProps)(MovieDetails)
