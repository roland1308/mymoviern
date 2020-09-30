import React, { Component } from 'react'
import {
    StyleSheet,
    FlatList,
} from 'react-native'
import { Layout, Spinner } from '@ui-kitten/components';
import { API_KEY } from 'react-native-dotenv'
import SearchResult from './components/SearchResult'
import { connect } from 'react-redux';
import { setDetailBar, setHomeBar, setOtherBar } from '../store/actions/generalActions';

const axios = require("axios");

class UserLists extends Component {
    constructor(props) {
        super(props)

        this.state = {
            results: null,
            oldBack: null,
            oldCheck: null,
            oldWorld: null,
        }
    }

    componentDidMount() {
        const { backIs, worldIs, checkIs } = this.props.general
        this.setState({
            oldBack: backIs,
            oldWorld: worldIs,
            oldCheck: checkIs
        })
        this.getList().then(response => {
            let responseOk = response.reverse()
            this.setState({ results: responseOk });
        })
        this.props.dispatch(setOtherBar())
    }

    componentWillUnmount() {
        const { oldCheck, oldBack } = this.state
        if (oldCheck) {
            this.props.dispatch(setDetailBar())
        } else if (oldBack) {
            this.props.dispatch(setOtherBar())
        } else {
            this.props.dispatch(setHomeBar())
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.general.isBackButton != this.props.general.isBackButton) {
            this.props.dispatch(setHomeBar())
            this.setState({
                oldWorld: true,
                oldBack: false,
                oldCheck: false
            })
            this.props.navigation.navigate("Home")
        }
        if (prevProps.general.mustRefresh != this.props.general.mustRefresh || prevProps.route.params.idList != this.props.route.params.idList) {
            this.setState({ results: null })
            this.getList().then(response => {
                let responseOk = response.reverse()
                this.setState({ results: responseOk });
            })
        }
    }

    asyncReadDetails = async id => {
        const { type } = this.props.route.params
        const response = await axios.get("https://api.themoviedb.org/3/" + type + "/" + id + "?api_key=" + API_KEY + "&language=" + this.props.general.language)
        return response.data
    }

    getList = async () => {
        const { idList } = this.props.route.params
        return Promise.all(idList.map(id =>
            this.asyncReadDetails(id)
        ))
    }

    render() {
        if (this.state.results === null) {
            return (
                <Layout style={{ flex: 1, alignItems: 'center', paddingTop: 50 }}>
                    <Spinner size='giant' />
                </Layout>
            )
        }
        const { type, route } = this.props.route.params
        const reverseCounter = this.state.results.length - 1
        return (
            <Layout style={styles.container} >
                <Layout>
                    <FlatList
                        renderItem={({ item, index }) => (
                            <SearchResult
                                poster_path={item.poster_path}
                                title={item.title}
                                id={item.id}
                                title={type === "movie" ? item.title : item.name}
                                navigation={this.props.navigation}
                                type={type}
                                stars={(type === 'movie' && route === 'myList') ? this.props.user.movieStars[reverseCounter - index] : this.props.user.serieStars[reverseCounter - index]}
                                arrayPos={reverseCounter - index}
                                source={route}
                            />
                        )}
                        data={this.state.results}
                        keyExtractor={item => item.id.toString()}
                        ItemSeparatorComponent={() => <Layout style={{ height: 5 }} />}
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
    user: state.user
});
export default connect(mapStateToProps)(UserLists)
