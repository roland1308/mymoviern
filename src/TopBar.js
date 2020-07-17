import React, { Component } from 'react'
import { Icon, Layout, MenuItem, OverflowMenu, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { toggleBack, setLanguage } from '../store/actions/generalActions';
import { connect } from 'react-redux';
import Separator from './components/Separator';

const HomeIcon = (props) => (
    <Icon {...props} name='home' />
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
    <Icon {...props} name='log-out' />
);

class TopBar extends Component {
    constructor(props) {
        super(props)
        this.toggleBack = this.toggleBack.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        this.state = {
            menuVisible: false,
            languageVisible: false,
        }
    }

    toggleMenu = () => {
        this.setState({
            menuVisible: !this.state.menuVisible
        })
    }

    toggleLanguage = () => {
        this.setState({
            languageVisible: !this.state.languageVisible
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
            {this.props.general.worldIs === "on" &&
                <OverflowMenu
                    anchor={this.renderLanguageAction}
                    visible={this.state.languageVisible}
                    onBackdropPress={this.props.general.worldIs === "on" && this.toggleLanguage}>
                    <MenuItem disabled={this.props.general.language === "en-US"} accessoryLeft={FlagIcon} title='English' onPress={() => this.setLanguage("en-US")} />
                    <MenuItem disabled={this.props.general.language === "it"} accessoryLeft={FlagIcon} title='Italiano' onPress={() => this.setLanguage("it")} />
                    <MenuItem disabled={this.props.general.language === "es"} accessoryLeft={FlagIcon} title='Español' onPress={() => this.setLanguage("es")} />
                </OverflowMenu>
            }
            <OverflowMenu
                anchor={this.renderMenuAction}
                visible={this.state.menuVisible}
                onBackdropPress={this.toggleMenu}>
                <MenuItem accessoryLeft={InfoIcon} title='About' />
                <MenuItem accessoryLeft={LogoutIcon} title='Logout' />
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
        return (
            <Layout style={styles.container} level='1'>
                <TopNavigation
                    alignment='center'
                    title='My Movie DB'
                    accessoryLeft={backIs === "on" && this.renderHomeAction}
                    accessoryRight={this.renderRightActions}
                />
            </Layout>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        minHeight: 56,
    },
});

const mapStateToProps = state => ({
    general: state.general,
});
export default connect(mapStateToProps)(TopBar)
