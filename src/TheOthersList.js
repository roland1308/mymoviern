import React, { Component } from 'react'
import {
    StyleSheet,
    FlatList,
} from 'react-native'
import { Button, Divider, Icon, Layout, List, ListItem } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { setHomeBar, setOtherBar, setMessage } from '../store/actions/generalActions';

const axios = require("axios");

const renderItemAccessory = (props) => (
    <Layout style={{ flexDirection: "row", backgroundColor: "#333" }}>
        <Button size='tiny' style={{ margin: 5 }}>SERIES</Button>
        <Button size='tiny' style={{ margin: 5 }}>MOVIES</Button>
    </Layout>
);

const renderItemIcon = (props) => (
    <Icon {...props} name='person' />
);

const renderItem = ({ item, index }) => (
    <ListItem
        style={{ backgroundColor: "#333", borderRadius: 10 }}
        title={item.userName}
        accessoryLeft={renderItemIcon}
        accessoryRight={renderItemAccessory}
    />
)

class TheOthersList extends Component {
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
        try {
            const url = "https://mymoviesback.herokuapp.com/users/userlist"
            let response = await axios.get(url)
            if (response.length === 0) {
                this.props.navigation.navigate("Home")
                this.props.dispatch(setMessage("Sorry: no results"))
            } else {
                this.setState({
                    results: response.data
                })
            }
        } catch (error) {
            console.log(error);
        }
        return;
    }

    render() {
        return (
            <Layout style={styles.container}>
                <List
                    data={this.state.results}
                    renderItem={renderItem}
                    ItemSeparatorComponent={Divider}
                />
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
export default connect(mapStateToProps)(TheOthersList)
