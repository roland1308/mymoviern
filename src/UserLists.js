import React, {Component} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {Layout, Spinner} from '@ui-kitten/components';
import {API_KEY} from 'react-native-dotenv';
import SearchResult from './components/SearchResult';
import {connect} from 'react-redux';
import {
  setDetailBar,
  setHomeBar,
  setOtherBar,
  setPageName,
} from '../store/actions/generalActions';
import FormatDate from './components/FormatDate';
import {navigationRef} from './RootNavigation';
import * as RootNavigation from './RootNavigation';

const axios = require('axios');

class UserLists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      oldBack: null,
      oldCheck: null,
      oldWorld: null,
    };
  }

  componentDidMount() {
    this.startup();
  }

  startup = () => {
    const {backIs, worldIs, checkIs} = this.props.general;
    this.setState({
      oldBack: backIs,
      oldWorld: worldIs,
      oldCheck: checkIs,
    });
    if (RootNavigation.navigationRef.current) {
      let index = RootNavigation.navigationRef.current.getCurrentRoute().params
        .route;
      console.log(index);
      switch (index) {
        case 'myList':
          this.props.dispatch(setOtherBar());
          this.props.dispatch(setPageName('-- My Starred List'));
          break;
        case 'nextList':
          this.props.dispatch(setOtherBar());
          this.props.dispatch(setPageName('-- Next to See'));
          break;
        case 'otherList':
          this.props.dispatch(setHomeBar());
          this.props.dispatch(setPageName(`-- 'The Others' List`));
          break;
        default:
      }
    }

    this.getList().then((response) => {
      let responseOk = response.reverse();
      this.setState({results: responseOk});
    });
    this.props.dispatch(setOtherBar());
  };

  componentWillUnmount() {
    switch (this.props.route.params.route) {
      // case 'list':
      //   this.props.dispatch(setHomeBar());
      //   this.props.dispatch(setPageName('         My Movies DB'));
      //   break;
      // case 'search':
      //   this.props.dispatch(setOtherBar());
      //   this.props.dispatch(setPageName('-- Search Results'));
      //   break;
      case 'myList':
        this.props.dispatch(setHomeBar());
        this.props.dispatch(setPageName('         My Movies DB'));
        break;
      case 'nextList':
        this.props.dispatch(setHomeBar());
        this.props.dispatch(setPageName('         My Movies DB'));
        break;
      // case 'otherList':
      //   this.props.dispatch(setOtherBar());
      //   this.props.dispatch(setPageName(`-- 'The Others' List`));
      //   break;
      // case 'suggestionList':
      //   this.props.dispatch(setOtherBar());
      //   this.props.dispatch(setPageName('-- Suggestions'));
      //   break;
      default:
    }
    // const {oldCheck, oldBack} = this.state;
    // if (oldCheck) {
    //   this.props.dispatch(setDetailBar());
    // } else if (oldBack) {
    //   this.props.dispatch(setOtherBar());
    // } else {
    //   this.props.dispatch(setHomeBar());
    //   this.props.dispatch(setPageName('         My Movies DB'));
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.general.isBackButton != this.props.general.isBackButton) {
      this.props.dispatch(setHomeBar());
      this.setState({
        oldWorld: true,
        oldBack: false,
        oldCheck: false,
      });
      this.props.navigation.navigate('Home');
    }
    if (
      prevProps.general.mustRefresh != this.props.general.mustRefresh ||
      prevProps.route.params.idList != this.props.route.params.idList
    ) {
      this.setState({results: null});
      this.startup();
    }
  }

  asyncReadDetails = async (id) => {
    const {type} = this.props.route.params;
    let realId = id;
    let realType = type;
    if (type === 'next') {
      realId = id.slice(1, id.length);
      realType = id.substr(0, 1) === 'm' ? 'movie' : 'tv';
    }
    const response = await axios.get(
      'https://api.themoviedb.org/3/' +
        realType +
        '/' +
        realId +
        '?api_key=' +
        API_KEY +
        '&language=' +
        this.props.general.language
    );
    return response.data;
  };

  getList = async () => {
    const {idList} = this.props.route.params;
    return Promise.all(idList.map((id) => this.asyncReadDetails(id)));
  };

  render() {
    if (this.state.results === null) {
      return (
        <Layout style={{flex: 1, alignItems: 'center', paddingTop: 50}}>
          <Spinner size='giant' />
        </Layout>
      );
    }
    const {type, route, starList} = this.props.route.params;
    const reverseCounter = this.state.results.length - 1;
    return (
      <Layout style={styles.container}>
        <FlatList
          renderItem={({item, index}) => (
            <SearchResult
              poster_path={item.poster_path}
              title={item.title}
              id={item.id}
              title={item.title !== undefined ? item.title : item.name}
              navigation={this.props.navigation}
              type={item.title !== undefined ? 'movie' : 'tv'}
              date={
                item.title !== undefined
                  ? FormatDate(item.release_date)
                  : FormatDate(item.first_air_date)
              }
              stars={type === 'next' ? 0 : starList[reverseCounter - index]}
              arrayPos={reverseCounter - index}
              source={route}
            />
          )}
          data={this.state.results}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <Layout style={{height: 5}} />}
        />
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
});
const mapStateToProps = (state) => ({
  general: state.general,
  user: state.user,
});
export default connect(mapStateToProps)(UserLists);
