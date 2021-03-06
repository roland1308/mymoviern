import React, {Component} from 'react';
import {
  Icon,
  Layout,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  Button,
  Card,
  Modal,
  Text,
} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {
  toggleBack,
  setLanguage,
  setIsLogged,
  setAddMovieStar,
  toggleNext,
  setPageName,
} from '../store/actions/generalActions';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import TextScroll from './components/TextScroll';
import Separator from './components/Separator';
import * as RootNavigation from './RootNavigation';
import {setIsLoading} from '../store/actions/userActions';

const HomeIcon = (props) => <Icon {...props} name='home' />;
const CheckYellowIcon = (props) => (
  <Icon {...props} name='checkmark-square-outline' fill='#FFFF00' />
);
const CheckGreyIcon = (props) => (
  <Icon {...props} name='checkmark-square-outline' fill='#808080' />
);
const GlobeIcon = (props) => <Icon {...props} name='globe' />;
const MovieIcon = (props) => <Icon {...props} name='film-outline' />;
const SerieIcon = (props) => <Icon {...props} name='tv-outline' />;
const NextIcon = (props) => <Icon {...props} name='clock-outline' />;
const NextDisabledIcon = (props) => (
  <Icon {...props} name='clock-outline' fill='#303030' />
);
const NextGreyIcon = (props) => (
  <Icon {...props} name='clock-outline' fill='#808080' />
);
const NextYellowIcon = (props) => (
  <Icon {...props} name='clock-outline' fill='#FFFF00' />
);
const TheOthersIcon = (props) => <Icon {...props} name='people-outline' />;
const FlagIcon = (props) => <Icon {...props} name='flag' />;
const MenuIcon = (props) => <Icon {...props} name='more-vertical' />;
const InfoIcon = (props) => <Icon {...props} name='info' />;
const LogoutIcon = (props) => <Icon {...props} name='log-out-outline' />;
const VersionIcon = (props) => <Icon {...props} name='trending-up-outline' />;
const SuggestIcon = (props) => <Icon {...props} name='bell-outline' />;
const SuggestGreyIcon = (props) => (
  <Icon {...props} name='bell-outline' fill='#808080' />
);
const SuggestDisabledIcon = (props) => (
  <Icon {...props} name='bell-outline' fill='#303030' />
);

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.toggleBack = this.toggleBack.bind(this);
    this.setLanguage = this.setLanguage.bind(this);
    this.state = {
      menuVisible: false,
      languageVisible: false,
      modalVisible: false,
      versionVisible: false,
      updateVisible: false,
      thanksVisible: false,
      versionings: '',
      lastModifications: '',
      actualVersion: '3.1.0',
    };
  }

  async componentDidMount() {
    this.props.dispatch(setIsLoading(true));
    const response = await Axios.get(
      'https://mymoviesback.herokuapp.com/versionings/getversions'
    );
    const lastModifications = response.data[0].update;
    const versionsArray = response.data.map((ver) => {
      return ver['version'] + ' ' + ver['update'] + '\n\n';
    });
    const latestVersion = response.data[0].version;
    const rememberedVersion = await this.getRememberedVersion();
    if (latestVersion !== this.state.actualVersion) {
      this.setState({updateVisible: true});
    } else {
      if (rememberedVersion == null) {
        this.setState({thanksVisible: true});
      }
    }
    this.setState({
      versionings: versionsArray,
      lastModifications,
    });
    this.props.dispatch(setIsLoading(false));
  }

  rememberVersion = async () => {
    try {
      await AsyncStorage.setItem('VERSION', 'true');
    } catch (error) {
      console.log(error);
    }
  };

  getRememberedVersion = async () => {
    try {
      const userName = await AsyncStorage.getItem('VERSION');
      if (userName !== null) {
        return userName;
      }
    } catch (error) {
      console.log(error);
    }
  };

  forgetVersion = async () => {
    try {
      await AsyncStorage.removeItem('VERSION');
    } catch (error) {
      console.log(error);
    }
  };

  onBackPress = () => {
    return true;
  };

  toggleMenu = () => {
    this.setState({
      menuVisible: !this.state.menuVisible,
    });
  };

  logOut = () => {
    this.forgetUser();
    this.setState({
      menuVisible: false,
    });
    this.props.dispatch(setIsLogged(false));
    RootNavigation.navigate('Home');
  };

  forgetUser = async () => {
    try {
      await AsyncStorage.removeItem('USER');
    } catch (error) {
      console.log(error);
    }
  };

  toggleLanguage = () => {
    this.setState({
      languageVisible: !this.state.languageVisible,
    });
  };

  toggleModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      menuVisible: false,
    });
  };

  toggleVersion = () => {
    this.setState({
      versionVisible: !this.state.versionVisible,
      menuVisible: false,
    });
  };

  toggleUpdate = () => {
    this.setState({
      updateVisible: !this.state.updateVisible,
    });
    this.forgetVersion();
  };

  toggleThanks = () => {
    this.setState({
      thanksVisible: !this.state.thanksVisible,
    });
    this.rememberVersion();
  };

  toggleStar = () => {
    this.props.dispatch(setAddMovieStar(!this.props.general.addMovieStar));
  };

  toggleNext = () => {
    this.props.dispatch(toggleNext());
  };

  setLanguage(lang) {
    this.toggleLanguage();
    this.props.dispatch(setLanguage(lang));
  }

  renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={this.toggleMenu} />
  );

  renderLanguageAction = () => (
    <TopNavigationAction icon={GlobeIcon} onPress={this.toggleLanguage} />
  );

  goTo = (type) => {
    this.toggleMenu();
    switch (type) {
      case 'movie':
        RootNavigation.navigate('User Lists', {
          type,
          idList: this.props.user.movies,
          starList: this.props.user.movieStars,
          route: 'myList',
        });
        break;
      case 'tv':
        RootNavigation.navigate('User Lists', {
          type,
          idList: this.props.user.series,
          starList: this.props.user.serieStars,
          route: 'myList',
        });
        break;
      case 'next':
        RootNavigation.navigate('User Lists', {
          type,
          idList: this.props.user.next,
          route: 'nextList',
        });
        break;
      default:
        break;
    }
  };

  goToOthers = () => {
    this.toggleMenu();
    RootNavigation.navigate('The Other List', {route: 'TheOtherList'});
  };

  goToSuggestions = () => {
    this.toggleMenu();
    RootNavigation.navigate('Suggestions List', {route: 'suggestionList'});
  };

  goToSendSuggestion = () => {
    RootNavigation.navigate('Send Suggestion', {route: 'sendsuggestion'});
  };

  renderRightActions = () => (
    <React.Fragment>
      {this.props.general.nextIs &&
        this.props.general.isLogged &&
        !this.props.general.alreadyStarred && (
          <TopNavigationAction
            icon={
              this.props.general.alreadyNext ? NextYellowIcon : NextGreyIcon
            }
            onPress={this.toggleNext}
          />
        )}
      {this.props.general.nextIs &&
        this.props.general.isLogged &&
        this.props.general.alreadyStarred && (
          <TopNavigationAction icon={NextDisabledIcon} />
        )}
      {this.props.general.checkIs && this.props.general.isLogged && (
        <TopNavigationAction
          icon={
            this.props.general.alreadyStarred ? CheckYellowIcon : CheckGreyIcon
          }
          onPress={this.toggleStar}
        />
      )}
      {this.props.general.checkIs && this.props.general.isLogged && (
        <TopNavigationAction
          icon={
            this.props.general.alreadyStarred
              ? SuggestGreyIcon
              : SuggestDisabledIcon
          }
          onPress={
            this.props.general.alreadyStarred
              ? () => this.goToSendSuggestion()
              : null
          }
        />
      )}
      {this.props.general.worldIs && (
        <OverflowMenu
          style={{height: null}}
          anchor={this.renderLanguageAction}
          visible={this.state.languageVisible}
          onBackdropPress={this.props.general.worldIs && this.toggleLanguage}
          backdropStyle={styles.backdrop}
        >
          <MenuItem
            disabled={this.props.general.language === 'en-US'}
            accessoryLeft={FlagIcon}
            title='English'
            onPress={() => this.setLanguage('en-US')}
          />
          <MenuItem
            disabled={this.props.general.language === 'it'}
            accessoryLeft={FlagIcon}
            title='Italiano'
            onPress={() => this.setLanguage('it')}
          />
          <MenuItem
            disabled={this.props.general.language === 'es'}
            accessoryLeft={FlagIcon}
            title='Español'
            onPress={() => this.setLanguage('es')}
          />
        </OverflowMenu>
      )}
      <OverflowMenu
        style={{maxHeight: null, maxWidth: null}}
        anchor={this.renderMenuAction}
        visible={this.state.menuVisible}
        onBackdropPress={this.toggleMenu}
        backdropStyle={styles.backdrop}
      >
        {this.props.general.isLogged && (
          <>
            <MenuItem
              accessoryLeft={MovieIcon}
              title={`My Movies (${this.props.user.movies.length})`}
              onPress={() => {
                this.props.user.movies.length != 0 && this.goTo('movie');
              }}
            />
            <MenuItem
              accessoryLeft={SerieIcon}
              title={`My Series (${this.props.user.series.length})`}
              onPress={() => {
                this.props.user.series.length != 0 && this.goTo('tv');
              }}
            />
            <MenuItem
              accessoryLeft={NextIcon}
              title={`My Next (${this.props.user.next.length})`}
              onPress={() => {
                this.props.user.next.length != 0 && this.goTo('next');
              }}
            />
            <MenuItem
              accessoryLeft={TheOthersIcon}
              title={'The Others'}
              onPress={() => {
                this.goToOthers();
              }}
            />
            <MenuItem
              accessoryLeft={SuggestIcon}
              title={`Suggested (${this.props.user.suggestions.length})`}
              onPress={() => {
                this.props.user.suggestions.length != 0 &&
                  this.goToSuggestions();
              }}
            />
            <Separator />
          </>
        )}
        <MenuItem
          accessoryLeft={InfoIcon}
          title='About'
          onPress={() => this.toggleModal()}
        />
        <MenuItem
          accessoryLeft={VersionIcon}
          title='App Versions'
          onPress={() => this.toggleVersion()}
        />
        {this.props.general.isLogged && (
          <>
            <Separator />
            <MenuItem
              accessoryLeft={LogoutIcon}
              title='Logout'
              onPress={this.logOut}
            />
          </>
        )}
      </OverflowMenu>
    </React.Fragment>
  );

  toggleBack() {
    this.props.dispatch(setPageName('         My Movies DB'));
    this.props.dispatch(toggleBack());
  }

  renderHomeAction = () => (
    <TopNavigationAction icon={HomeIcon} onPress={this.toggleBack} />
  );

  render() {
    const {backIs} = this.props.general;
    const {
      modalVisible,
      actualVersion,
      versionVisible,
      updateVisible,
      thanksVisible,
      versionings,
      lastModifications,
    } = this.state;
    return (
      <Layout style={styles.container} level='1'>
        <TopNavigation
          title={this.props.general.pageName}
          // title={'         My Movies DB'}
          accessoryLeft={backIs && this.renderHomeAction}
          accessoryRight={this.renderRightActions}
        />
        <Modal
          visible={modalVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => this.toggleModal()}
        >
          <Card disabled={true}>
            <Text>My Movies DB</Text>
            <Text>Version {actualVersion}</Text>
            <Text>Copyright 2020 Renato</Text>
            <Button
              style={{marginTop: 20}}
              status='success'
              onPress={() => this.toggleModal()}
            >
              DISMISS
            </Button>
          </Card>
        </Modal>
        <Modal
          visible={versionVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => this.toggleVersion()}
        >
          <Card disabled={true}>
            <TextScroll text={versionings} title='Version History' />
            <Button
              style={{marginTop: 20}}
              status='success'
              onPress={() => this.toggleVersion()}
            >
              DISMISS
            </Button>
          </Card>
        </Modal>
        <Modal
          visible={updateVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => this.toggleUpdate()}
        >
          <Card disabled={true}>
            <Text style={{textAlign: 'center'}}>
              A newer version is available: please contact a.renato@gmail.com
            </Text>
            <Layout>
              {/* <Layout style={styles.buttonsContainer}> */}
              {/* <Button style={{ margin: 20 }} status='success' onPress={() => this.downloadFile()}>
                                Update
                            </Button> */}
              <Button
                style={{margin: 20}}
                status='danger'
                onPress={() => this.toggleUpdate()}
              >
                Not now
              </Button>
            </Layout>
          </Card>
        </Modal>
        <Modal
          visible={thanksVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => this.toggleThanks()}
        >
          <Card disabled={true}>
            <Text>Thank you for updating the app!</Text>
            <Text>{lastModifications}</Text>
            <Button
              style={{marginTop: 20}}
              status='success'
              onPress={() => this.toggleThanks()}
            >
              DISMISS
            </Button>
          </Card>
        </Modal>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
});

const mapStateToProps = (state) => ({
  general: state.general,
  user: state.user,
});
export default connect(mapStateToProps)(TopBar);
