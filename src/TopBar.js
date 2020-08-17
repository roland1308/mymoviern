import React, { Component } from 'react'
import { Icon, Layout, MenuItem, OverflowMenu, TopNavigation, TopNavigationAction, Button, Card, Modal, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { toggleBack, setLanguage, setIsLogged, setAddMovieStar } from '../store/actions/generalActions';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'

const HomeIcon = (props) => (
    <Icon {...props} name='home' />
);

const CheckYellowIcon = (props) => (
    <Icon {...props} name='checkmark-square-outline' fill='#FFFF00' />
);

const CheckRedIcon = (props) => (
    <Icon {...props} name='checkmark-square-outline' fill='#FF0000' />
);

const GlobeIcon = (props) => (
    <Icon {...props} name='globe' />
);

const FlagIcon = (props) => (
    <Icon {...props} name='flag' />
);

const MenuIcon = (props) => (
    <Icon {...props} name='more-vertical' />
);

const InfoIcon = (props) => (
    <Icon {...props} name='info' />
);

const LogoutIcon = (props) => (
    <Icon {...props} name='log-out-outline' />
);
class TopBar extends Component {
    constructor(props) {
        super(props)
        this.toggleBack = this.toggleBack.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        this.state = {
            menuVisible: false,
            languageVisible: false,
            modalVisible: false,
        }
    }

    toggleMenu = () => {
        this.setState({
            menuVisible: !this.state.menuVisible
        })
    }

    logOut = () => {
        this.forgetUser()
        this.setState({
            menuVisible: false,
        })
        this.props.dispatch(setIsLogged(false))
    }

    forgetUser = async () => {
        try {
            await AsyncStorage.removeItem('YOUR-KEY');
        } catch (error) {
            console.log(error);
        }
    }

    toggleLanguage = () => {
        this.setState({
            languageVisible: !this.state.languageVisible
        })
    }

    toggleModal = () => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            menuVisible: false,
        })
    }

    toggleStar = () => {
        this.props.dispatch(setAddMovieStar(!this.props.general.addMovieStar))
    }

    setLanguage(lang) {
        this.toggleLanguage()
        this.props.dispatch(setLanguage(lang));
    }

    renderMenuAction = () => (
        <TopNavigationAction icon={MenuIcon} onPress={this.toggleMenu} />
    );

    renderLanguageAction = () => (
        <TopNavigationAction icon={GlobeIcon} onPress={this.toggleLanguage} />
    );

    renderRightActions = () => (
        <React.Fragment>
            {this.props.general.checkIs && this.props.general.isLogged &&
                <TopNavigationAction icon={this.props.general.alreadyStarred ? CheckYellowIcon : CheckRedIcon} onPress={this.toggleStar} />
            }
            {this.props.general.worldIs &&
                <OverflowMenu
                    anchor={this.renderLanguageAction}
                    visible={this.state.languageVisible}
                    onBackdropPress={this.props.general.worldIs && this.toggleLanguage}>
                    <MenuItem disabled={this.props.general.language === "en-US"} accessoryLeft={FlagIcon} title='English' onPress={() => this.setLanguage("en-US")} />
                    <MenuItem disabled={this.props.general.language === "it"} accessoryLeft={FlagIcon} title='Italiano' onPress={() => this.setLanguage("it")} />
                    <MenuItem disabled={this.props.general.language === "es"} accessoryLeft={FlagIcon} title='Español' onPress={() => this.setLanguage("es")} />
                </OverflowMenu>
            }
            <OverflowMenu
                anchor={this.renderMenuAction}
                visible={this.state.menuVisible}
                onBackdropPress={this.toggleMenu}>
                <MenuItem accessoryLeft={InfoIcon} title='About' onPress={() => this.toggleModal()} />
                {this.props.general.isLogged && <MenuItem accessoryLeft={LogoutIcon} title='Logout' onPress={this.logOut} />}
            </OverflowMenu>
        </React.Fragment>
    );

    toggleBack() {
        this.props.dispatch(toggleBack());
    }

    renderHomeAction = () => (
        <TopNavigationAction icon={HomeIcon} onPress={this.toggleBack} />
    );
    render() {
        const { backIs } = this.props.general
        const { modalVisible } = this.state
        return (
            <Layout style={styles.container} level='1'>
                <TopNavigation
                    alignment='center'
                    title='My Movies DB'
                    accessoryLeft={backIs && this.renderHomeAction}
                    accessoryRight={this.renderRightActions}
                />
                <Modal
                    visible={modalVisible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.toggleModal()}>
                    <Card disabled={true}>
                        <Text>My Movies DB</Text>
                        <Text>Version 1.0.1</Text>
                        <Text>Copyright 2020 Renato</Text>
                        <Button style={{ marginTop: 20 }} status='success' onPress={() => this.toggleModal()}>
                            DISMISS
                        </Button>
                    </Card>
                </Modal>
            </Layout>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        minHeight: 56,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

const mapStateToProps = state => ({
    general: state.general,
});
export default connect(mapStateToProps)(TopBar)
