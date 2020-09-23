import React, { Component } from 'react'
import {
    Image,
    StyleSheet,
    Linking
} from 'react-native'
import { Layout, Text, Spinner, Modal, Card, Button, Icon } from '@ui-kitten/components';

import { API_KEY } from 'react-native-dotenv'
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { setOtherBar, setHomeBar, setDetailBar, setAddMovieStar, setAlreadyStarred, toggleMustRefresh } from '../store/actions/generalActions';
import Separator from './components/Separator';
import FormatDate from './components/FormatDate';
import { addSerieToUser } from '../store/actions/userActions';
import removeTrailinZeros from 'remove-trailing-zeros'
import TextScroll from './components/TextScroll';
import YoutubePlayer from "react-native-youtube-iframe";

const axios = require("axios");

class TvDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            details: null,
            source: null,
            isLoading: true,
            oldStarVote: 0,
            newStarVote: 0,
            position: null,
            totStars: 0,
            views: 0,
            medStars: 0,
            needRefresh: false,
            whoStarredVisible: false,
            whoHasStarred: [],
            playing: false,
            trailersArray: null,
        }
    }

    componentDidMount() {
        const { detailsId, source } = this.props.route.params
        const { series, serieStars } = this.props.user
        const serieIndex = series.indexOf(detailsId)
        let uri = "https://api.themoviedb.org/3/tv/" + detailsId + "?api_key=" + API_KEY + "&language=" + this.props.general.language + "&append_to_response=videos"
        if (serieIndex !== -1) {
            this.props.dispatch(setAlreadyStarred(true))
            this.setState({ oldStarVote: serieStars[serieIndex], newStarVote: serieStars[serieIndex], position: serieIndex })
        } else {
            this.props.dispatch(setAlreadyStarred(false))
            this.setState({ position: series.length })
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
        if (this.state.needRefresh) {
            this.props.dispatch(toggleMustRefresh())
        }
    }

    async getDetails(uri) {
        const request = await axios.get(uri)
        const request1 = await axios.get("https://mymoviesback.herokuapp.com/series/getstats/" + this.props.route.params.detailsId)
        axios.all([request, request1]).then(axios.spread((...responses) => {
            const response = responses[0]
            const response1 = responses[1]
            if (response.status === 200) {
                const momTrailersArray = response.data.videos.results.map(trailer => {
                    return trailer['key']
                })
                this.setState({
                    details: response.data,
                    trailersArray: momTrailersArray
                })
            } else {
                this.setState({ error: true, errorMsg: response.data.status_message })
                return
            }
            if (response1.status === 200) {
                const { totStars, views, medStars } = response1.data
                this.setState({
                    totStars,
                    views,
                    medStars,
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
            serieIndex: this.state.position,
            userName: this.props.user.userName,
            serieId: this.props.route.params.detailsId,
            thisSerieStars: this.state.newStarVote,
            starsToAdd: this.state.newStarVote - this.state.oldStarVote,
            alreadyStarred: this.props.general.alreadyStarred
        }
        let views = (this.state.views || 0) + (1 && !data.alreadyStarred),
            totStars = (this.state.totStars || 0) + data.starsToAdd,
            medStars = removeTrailinZeros((totStars / views).toFixed(2))
        this.setState({
            oldStarVote: this.state.newStarVote,
            views,
            totStars,
            medStars,
            needRefresh: true
        })
        this.props.dispatch(addSerieToUser(data))
        this.props.dispatch(setAlreadyStarred(true))
    }

    async whoStarred() {
        this.setState({ isLoading: true })
        const serieId = this.props.route.params.detailsId
        const response = await axios.get("https://mymoviesback.herokuapp.com/users/whostarred/" + serieId + "/series")
        const momArray = response.data.map(user => {
            let index = user.series.indexOf(serieId)
            let stars = user.serieStars[index]
            let len = user.userName.length
            return user.userName + " " + ".".repeat(40 - len - stars) + " " + "⭐️".repeat(stars) + "\n\n"
        })
        this.setState({
            whoHasStarred: momArray,
            isLoading: false,
            whoStarredVisible: true,
        })
    }

    toggleWhoStarred = () => {
        this.setState({ whoStarredVisible: !this.state.whoStarredVisible })
    }

    render() {
        if (this.state.details === null) {
            return (
                <Layout style={{ flex: 1, alignItems: 'center', paddingTop: 50 }}>
                    <Spinner size='giant' />
                </Layout>
            )
        }
        const { name, backdrop_path, overview, first_air_date, last_air_date, homepage, networks } = this.state.details
        const { newStarVote, medStars, views, whoStarredVisible, whoHasStarred, isLoading, playing, trailersArray } = this.state
        const first_date = FormatDate(first_air_date)
        const last_date = FormatDate(last_air_date)
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
                <Modal visible={isLoading}
                    backdropStyle={styles.backdrop}>
                    <Card disabled={true} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 50 }}>
                        <Spinner size='giant' />
                    </Card>
                </Modal>
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
                <Modal
                    visible={whoStarredVisible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.toggleWhoStarred()}>
                    <Card disabled={true}>
                        <TextScroll text={whoHasStarred} title="Users' likes" />
                        <Button style={{ marginTop: 20 }} status='success' onPress={() => this.toggleWhoStarred()}>
                            DISMISS
                        </Button>
                    </Card>
                </Modal>
                <Text style={styles.title}>{name}</Text>
                {trailersArray.length > 0 ?
                    <YoutubePlayer
                        height={200}
                        style={{ aspectRatio: 1 }}
                        play={playing}
                        playList={trailersArray}
                        onChangeState={() => this.onStateChange}
                    />
                    :
                    <Image
                        style={{ width: "100%", flex: 0.5 }}
                        source={backdrop_path == null ? require("../assets/noBackdrop.png") : { uri: "https://image.tmdb.org/t/p/w500" + backdrop_path }}
                    />
                }
                <Separator />
                <Layout style={styles.votes}>
                    <Text>Release date: {first_date}</Text>
                    <TouchableHighlight
                        underlayColor="#DDDDDD"
                        onPress={() => {
                            this.whoStarred()
                        }}>
                        <Layout style={styles.votes}>
                            <Icon
                                style={styles.iconSmall}
                                name="star"
                                fill='#FFFF00'
                            />
                            <Text>{medStars || 0}</Text>
                        </Layout>
                    </TouchableHighlight>
                </Layout>
                <Layout style={styles.votes}>
                    <Text>Last date: {last_date}</Text>
                    <TouchableHighlight
                        underlayColor="#DDDDDD"
                        onPress={() => {
                            this.whoStarred()
                        }}>
                        <Layout style={styles.votes}>
                            <Icon
                                style={styles.iconSmall}
                                name="eye"
                                fill='#00FF00'
                            />
                            <Text>{views || 0}</Text>
                        </Layout>
                    </TouchableHighlight>
                </Layout>
                {homepage != "" ? (<Text style={{ color: "#A70207", fontSize: 18 }} onPress={() => Linking.openURL(homepage)}>Home Page</Text>) : <Text />}
                <Separator />
                <ScrollView style={{ flex: 1 }}>
                    <Text style={styles.overview}>{overview ? overview : "No Description"}</Text>
                </ScrollView>
                <Separator />
                <Layout style={{ padding: 5, flexDirection: "row", justifyContent: "center" }}>
                    {
                        networks.slice(0, 5).map((item, i) => {
                            return (
                                // <Text key={i}>{item.name}</Text>
                                <Image
                                    key={i}
                                    style={{ width: 100, height: 25, margin: 5 }}
                                    resizeMode="contain"
                                    source={item.logo_path == null ? require("../assets/noBackdrop.png") : { uri: "https://image.tmdb.org/t/p/w500" + item.logo_path }}
                                />
                            )
                        })
                    }
                </Layout>
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
export default connect(mapStateToProps)(TvDetails)