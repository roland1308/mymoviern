import React, { Component } from 'react'
import {
    StyleSheet,
    FlatList,
    TouchableHighlight,
    Image,
    Keyboard,
    LayoutAnimation,
    UIManager,
    TouchableWithoutFeedback,
    Switch,
} from 'react-native'
import { API_KEY, GEN_PW } from 'react-native-dotenv'
import Separator from './components/Separator';
import { Button, Layout, Text, Input, Icon, Modal, Card, Menu, MenuItem, Spinner } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { setLanguage, setMessage, setHomeBar, setIsLogged } from '../store/actions/generalActions';
import { addUser, logUser, setIsLoading } from '../store/actions/userActions';
import AsyncStorage from '@react-native-community/async-storage'

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const axios = require("axios");

const AlertIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);

function Item({ id, poster_path, type, navigation }) {
    return (
        <TouchableHighlight
            underlayColor="#DDDDDD"
            onPress={() => {
                if (type === 'movie') {
                    navigation.navigate('Movie Details', { detailsId: id, source: "list" })
                } else {
                    navigation.navigate('Tv Details', { detailsId: id, source: "list" })
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
            topFilms: [],
            topSeries: [],
            sort_by: "popularity.desc",
            adult: false,
            page: 1,
            search: "",
            isLoginVisible: false,
            isRegisterVisible: false,
            userName: "",
            password: "",
            rememberMe: false,
            chkPassword: "",
            secureTextEntry: true,
            selectedIndex: { "row": 0 }
        }
    }

    async componentDidMount() {
        this.props.dispatch(setHomeBar())
        const userName = await this.getRememberedUser()
        if (userName != null) {
            this.setState({
                userName,
                rememberMe: true
            })
            this.props.dispatch(setIsLogged(true))
            this.props.dispatch(logUser({ userName, password: GEN_PW }))
        } else {
            this.setState({
                rememberMe: false
            })
            this.props.dispatch(setIsLogged(false))
        }
        this.getList()
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.general.language != this.props.general.language) {
            this.getList()
            let temp = { row: 0 }
            switch (this.props.general.language) {
                case "en-US":
                    temp.row = 0
                    break;
                case "it":
                    temp.row = 1
                    break;
                case "es":
                    temp.row = 2
                    break;
                default:
                    break;
            }
            this.setState({ selectedIndex: temp })
        }
    }

    async getList() {
        this.props.dispatch(setIsLoading(true))
        this.setState({
            topFilms: [],
            topSeries: []
        })
        const url =
            "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY +
            "&language=" + this.props.general.language +
            "&sort_by=" + this.state.sort_by +
            "&include_adult=" + this.state.adult +
            "&page=" + this.state.page
        const url1 =
            "https://api.themoviedb.org/3/discover/tv?api_key=" + API_KEY +
            "&language=" + this.props.general.language +
            "&sort_by=" + this.state.sort_by +
            "&include_adult=" + this.state.adult +
            "&page=" + this.state.page
        const url2 = "https://mymoviesback.herokuapp.com/films/topmovies"
        const url3 = "https://mymoviesback.herokuapp.com/series/topseries"
        const request = await axios.get(url);
        const request1 = await axios.get(url1);
        const request2 = await axios.get(url2);
        const request3 = await axios.get(url3);
        axios.all([request, request1, request2, request3]).then(axios.spread((...responses) => {
            const response = responses[0]
            const response1 = responses[1]
            const response2 = responses[2]
            const response3 = responses[3]
            if (response.status === 200) {
                this.setState({
                    films: response.data.results
                })
            } else {
                this.setState({ error: true, errorMsg: response.data.status_message })
                return
            }
            if (response1.status === 200) {
                this.setState({
                    series: response1.data.results
                })
            } else {
                this.setState({ error: true, errorMsg: response1.data.status_message })
                return
            }
            if (response2.status === 200) {
                let topFilmsUri = [],
                    momTopFilms = []
                response2.data.map(movie => {
                    topFilmsUri.push("https://api.themoviedb.org/3/movie/" + movie.movieId + "?api_key=" + API_KEY + "&language=" + this.props.general.language)
                })
                topFilmsUri.map(async uri => {
                    let response = await axios.get(uri)
                    momTopFilms = this.state.topFilms
                    momTopFilms.push(response.data)
                    this.setState({
                        topFilms: momTopFilms
                    })
                })
            } else {
                this.setState({ error: true, errorMsg: response2.data.status_message })
                return
            }
            if (response3.status === 200) {
                let topSeriesUri = [],
                    momTopSeries = []
                response3.data.map(serie => {
                    topSeriesUri.push("https://api.themoviedb.org/3/tv/" + serie.serieId + "?api_key=" + API_KEY + "&language=" + this.props.general.language)
                })
                topSeriesUri.map(async uri => {
                    let response = await axios.get(uri)
                    momTopSeries = this.state.topSeries
                    momTopSeries.push(response.data)
                    this.setState({
                        topSeries: momTopSeries
                    })
                })
            } else {
                this.setState({ error: true, errorMsg: response3.data.status_message })
                return
            }
        })).catch(errors => {
            this.setState({ error: true, errorMsg: errors.message })
        })
        return
    }

    updateSearch(search) {
        this.setState({ search })
    }

    setisLoginVisible(mode) {
        LayoutAnimation.configureNext({
            duration: 300,
            create: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity
            },
            delete: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity
            }
        })
        this.setState({ isLoginVisible: mode, userName: "", password: "" })
    }

    setisRegisterVisible(mode) {
        LayoutAnimation.configureNext({
            duration: 300,
            create: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity
            },
            delete: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity
            }
        })
        this.setState({ isRegisterVisible: mode, userName: "", password: "", chkPassword: "" })
    }

    toggleSecureEntry = () => {
        this.setState({ secureTextEntry: !this.state.secureTextEntry })
    }

    renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={this.toggleSecureEntry}>
            <Icon {...props} name={this.state.secureTextEntry ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    );

    setUsername(name) {
        this.setState({ userName: name })
    }

    setPassword(pw) {
        this.setState({ password: pw })
    }

    toggleRememberMe = value => {
        this.setState({ rememberMe: value })
    }

    rememberUser = async () => {
        try {
            await AsyncStorage.setItem('YOUR-KEY', this.state.userName);
        } catch (error) {
            console.log(error);
        }
    }

    getRememberedUser = async () => {
        try {
            const userName = await AsyncStorage.getItem('YOUR-KEY');
            if (userName !== null) {
                // We have userName!!
                return userName;
            }
        } catch (error) {
            console.log(error);
        }
    }

    forgetUser = async () => {
        try {
            await AsyncStorage.removeItem('YOUR-KEY');
        } catch (error) {
            console.log(error);
        }
    }

    setChkPassword(pw) {
        this.setState({ chkPassword: pw })
    }

    logUser = () => {
        const { userName, password, rememberMe } = this.state
        if (!userName || !password) {
            this.props.dispatch(setMessage("Please fill in all fields"))
            return
        }
        this.props.dispatch(logUser({ userName, password }))
        if (rememberMe === true) {
            this.rememberUser();
        } else {
            this.forgetUser();
        }
    }

    registerUser = () => {
        const { userName, password, chkPassword } = this.state
        const { language } = this.props.general
        if (!userName || !password || !chkPassword) {
            this.props.dispatch(setMessage("Please fill in all fields"))
            return
        }
        if (password.length < 8) {
            this.props.dispatch(setMessage("Password too short"))
            return
        }
        if (password !== chkPassword) {
            this.props.dispatch(setMessage("Please confirm the password"))
            return
        }
        this.props.dispatch(addUser({ userName, password, language }))
    }

    toggleError = () => {
        const { popupMsg } = this.props.general
        const { language } = this.props.user
        switch (popupMsg) {
            case "User correctly created":
                this.setisRegisterVisible(false)
                this.props.dispatch(setIsLogged(true))
                break;
            case "User logged in":
                this.setisLoginVisible(false)
                this.props.dispatch(setIsLogged(true))
                this.props.dispatch(setLanguage(language));
                break;
            default:
                break;
        }
        this.props.dispatch(setIsLoading(false))
        this.props.dispatch(setMessage(null))
    }

    setSelectedIndex = (index) => {
        let language = 0
        switch (index.row) {
            case 0:
                language = "en-US"
                break;
            case 1:
                language = "it"
                break;
            case 2:
                language = "es"
                break;
            default:
                break;
        }
        this.props.dispatch(setLanguage(language));
        this.setState({ selectedIndex: index })
    }

    render() {
        const navigation = this.props.navigation
        const { search, isLoginVisible, isRegisterVisible, userName, password, chkPassword, secureTextEntry, selectedIndex } = this.state
        const { popupMsg, isLogged } = this.props.general
        const { isLoading } = this.props.user
        return (
            <Layout style={styles.container}>
                <Modal visible={isLoading}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.toggleError()}>
                    <Card disabled={true} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 50 }}>
                        <Spinner size='giant' />
                    </Card>
                </Modal>
                <Modal
                    visible={popupMsg}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.toggleError()}>
                    <Card disabled={true}>
                        <Text>{popupMsg}</Text>
                        <Button style={{ marginTop: 20 }} status='success' onPress={() => this.toggleError()}>
                            DISMISS
                        </Button>
                    </Card>
                </Modal>
                {!isLoginVisible && !isRegisterVisible && !isLogged &&
                    <Layout style={styles.containerIntro}>
                        <Text category='h1'>
                            Welcome guest!
                        </Text>
                        <Text category='s1'>
                            To enjoy full functionality, please:
                        </Text>
                        <Layout style={[styles.buttons, { marginTop: 5, marginBottom: 0 }]}>
                            <Button status='success' onPress={() => this.setisLoginVisible(true)}>
                                Log In
                            </Button>
                            <Text style={{ margin: 9 }}>OR</Text>
                            <Button status='success' onPress={() => this.setisRegisterVisible(true)}>
                                Register
                            </Button>
                        </Layout>
                    </Layout>
                }
                {isLoginVisible &&
                    <Layout style={styles.containerIntro}>
                        <Layout style={{ width: '80%' }}>
                            <Text category='h1'>
                                User Log In
                            </Text>
                            <Input
                                value={userName}
                                label='Username'
                                placeholder='Place your Text'
                                onChangeText={nextUsername => this.setUsername(nextUsername)}
                            />
                            <Input
                                value={password}
                                label='Password'
                                placeholder='Place your Text'
                                accessoryRight={this.renderIcon}
                                secureTextEntry={secureTextEntry}
                                onChangeText={nextPassword => this.setPassword(nextPassword)}
                            />
                            <Layout style={styles.buttons}>
                                <Switch
                                    value={this.state.rememberMe}
                                    onValueChange={(value) => this.toggleRememberMe(value)}
                                />
                                <Text>Remember Me</Text>
                            </Layout>
                            <Layout style={styles.buttons}>
                                <Button status='success' onPress={this.logUser}>Log In</Button>
                                <Button onPress={() => this.setisLoginVisible(false)}>Cancel</Button>
                            </Layout>
                        </Layout>
                    </Layout>
                }
                {isRegisterVisible &&
                    <Layout style={styles.containerIntro}>
                        <Layout style={{ width: '80%' }}>
                            <Text category='h1'>
                                Register new user
                            </Text>
                            <Input
                                value={userName}
                                label='Username'
                                placeholder='Place your Text'
                                onChangeText={nextUsername => this.setUsername(nextUsername)}
                            />
                            <Input
                                value={password}
                                label='Password'
                                placeholder='Place your Text'
                                caption='Should contain at least 8 symbols'
                                accessoryRight={this.renderIcon}
                                captionIcon={AlertIcon}
                                secureTextEntry={secureTextEntry}
                                onChangeText={nextPassword => this.setPassword(nextPassword)}
                            />
                            <Input
                                value={chkPassword}
                                label='Repeat Password'
                                placeholder='Place your Text'
                                accessoryRight={this.renderIcon}
                                secureTextEntry={secureTextEntry}
                                onChangeText={nextPassword => this.setChkPassword(nextPassword)}
                            />
                            <Text>Choose your language:</Text>
                            <Menu
                                selectedIndex={selectedIndex}
                                onSelect={index => this.setSelectedIndex(index)}>
                                <MenuItem title="English" />
                                <MenuItem title="Italiano" />
                                <MenuItem title="Español" />
                            </Menu>
                            <Layout style={styles.buttons}>
                                <Button status='success' onPress={this.registerUser}>Register</Button>
                                <Button onPress={() => this.setisRegisterVisible(false)}>Cancel</Button>
                            </Layout>
                        </Layout>
                    </Layout>
                }
                <Separator />
                {!isLoginVisible && !isRegisterVisible &&
                    <>
                        <Layout style={{ height: 120 }}>
                            {isLogged ?
                                (<Text category='s1' style={{ marginTop: 5, alignSelf: 'center' }}>
                                    Welcome {this.props.user.userName}
                                </Text>)
                                :
                                (<Text category='s1' style={{ marginTop: 5, alignSelf: 'center' }}>
                                    ..or just surf The Movie DataBase
                                </Text>)
                            }
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
                        </Layout>
                        <Separator />
                        <Layout style={{ flex: 1 }}>
                            <ScrollView>
                                <Layout style={styles.list}>
                                    <Text style={styles.title}>Top 20 My Movies DB</Text>
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
                                        data={this.state.topFilms}
                                        keyExtractor={item => item.id.toString() + "mmdb"}
                                    />
                                </Layout>
                                <Separator />
                                <Layout style={styles.list}>
                                    <Text style={styles.title}>Top 20 My Series DB</Text>
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
                                        data={this.state.topSeries}
                                        keyExtractor={item => item.id.toString() + "mmdb"}
                                    />
                                </Layout>
                                <Separator />
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
                                        keyExtractor={item => item.id.toString() + "tmdb"}
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
                                        keyExtractor={item => item.id.toString() + "tmdb"}
                                    />
                                </Layout>
                            </ScrollView>
                        </Layout>
                    </>
                }
            </Layout >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%',
        flex: 1
    },
    containerIntro: {
        paddingBottom: 5,
        alignItems: 'center',
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
        marginBottom: 5,
        alignItems: "center",
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})
const mapStateToProps = state => ({
    general: state.general,
    user: state.user,
});

export default connect(mapStateToProps)(List)
