import React, { Component } from 'react'
import { Icon, Layout, MenuItem, OverflowMenu, TopNavigation, TopNavigationAction, Button, Card, Modal, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { toggleBack, setLanguage, setIsLogged } from '../store/actions/generalActions';
import { connect } from 'react-redux';

const HomeIcon = (props) => (
    <Icon {...props} name='home' />
);

const CheckIcon = (props) => (
    <Icon {...props} name='checkmark-square-outline' />
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
        this.setState({
            menuVisible: false,
        })
        this.props.dispatch(setIsLogged(false))
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
            {this.props.general.checkIs && <TopNavigationAction icon={CheckIcon} onPress={this.toggleBack} />}
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
                        <Text>Version 1.0</Text>
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
