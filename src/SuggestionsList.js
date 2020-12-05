import React, {Component, Fragment} from 'react';
import {StyleSheet, FlatList, SectionList} from 'react-native';
import {Layout, Spinner} from '@ui-kitten/components';
import {API_KEY} from 'react-native-dotenv';
import SearchResult from './components/SearchResult';
import {connect} from 'react-redux';
import {
  setDetailBar,
  setHomeBar,
  setOtherBar,
} from '../store/actions/generalActions';
import FormatDate from './components/FormatDate';
import {Text} from 'native-base';

const axios = require('axios');

class SuggestionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      oldBack: null,
      oldCheck: null,
      oldWorld: null,
      completeList: null,
    };
  }

  componentDidMount() {
    const {backIs, worldIs, checkIs} = this.props.general;
    this.setState({
      oldBack: backIs,
      oldWorld: worldIs,
      oldCheck: checkIs,
    });
    let newCompleteList = [];
    this.props.user.suggestions.map((suggestion, resultsIndex) => {
      let onlyIds = suggestion.tips.filter(function (value, position) {
        return position % 2 !== 0;
      });
      let onlySuggestionViewed = suggestion.tips.filter(function (
        value,
        position
      ) {
        return position % 2 === 0;
      });
      this.getList(onlyIds, suggestion.prompter, onlySuggestionViewed).then(
        (response) => {
          newCompleteList[resultsIndex] = {
            title: suggestion.prompter,
            data: response,
          };
          this.setState({
            completeList: newCompleteList,
          });
        }
      );
    });
    this.props.dispatch(setOtherBar());
  }

  componentWillUnmount() {
    const {oldCheck, oldBack} = this.state;
    if (oldCheck) {
      this.props.dispatch(setDetailBar());
    } else if (oldBack) {
      this.props.dispatch(setOtherBar());
    } else {
      this.props.dispatch(setHomeBar());
    }
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
    if (prevProps.general.mustRefresh != this.props.general.mustRefresh) {
      this.setState({
        completeList: [],
      });
      let newCompleteList = [];
      this.props.user.suggestions.map((suggestion, resultsIndex) => {
        let onlyIds = suggestion.tips.filter(function (value, position) {
          return position % 2 !== 0;
        });
        let onlySuggestionViewed = suggestion.tips.filter(function (
          value,
          position
        ) {
          return position % 2 === 0;
        });
        this.getList(onlyIds, suggestion.prompter, onlySuggestionViewed).then(
          (response) => {
            newCompleteList[resultsIndex] = {
              title: suggestion.prompter,
              data: response,
            };
            this.setState({
              completeList: newCompleteList,
            });
          }
        );
      });
    }
  }

  asyncReadDetails = async (id, prompter, tipIndex, viewed) => {
    let realId = id;
    let realType = '';
    realId = id.slice(1, id.length);
    realType = id.substr(0, 1) === 'm' ? 'movie' : 'tv';
    let response = await axios.get(
      'https://api.themoviedb.org/3/' +
        realType +
        '/' +
        realId +
        '?api_key=' +
        API_KEY +
        '&language=' +
        this.props.general.language
    );
    response.data.prompter = prompter;
    response.data.tipIndex = tipIndex;
    response.data.viewed = viewed;
    return response.data;
  };

  getList = async (onlyIds, prompter, onlySuggestionViewed) => {
    return Promise.all(
      onlyIds.map((id, tipIndex) =>
        this.asyncReadDetails(
          id,
          prompter,
          tipIndex,
          onlySuggestionViewed[tipIndex]
        )
      )
    );
  };

  render() {
    if (this.state.completeList === null) {
      return (
        <Layout style={{flex: 1, alignItems: 'center', paddingTop: 50}}>
          <Spinner size='giant' />
        </Layout>
      );
    }
    const {route} = this.props.route.params;
    return (
      <Layout style={styles.container}>
        <SectionList
          sections={this.state.completeList}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => (
            <SearchResult
              poster_path={item.poster_path}
              id={item.id}
              title={item.title !== undefined ? item.title : item.name}
              navigation={this.props.navigation}
              type={item.title !== undefined ? 'movie' : 'tv'}
              date={
                item.title !== undefined
                  ? FormatDate(item.release_date)
                  : FormatDate(item.first_air_date)
              }
              isSuggestionNew={item.viewed}
              userName={this.props.user.userName}
              prompter={item.prompter}
              tipIndex={item.tipIndex}
              source={route}
            />
          )}
          renderSectionHeader={({section: {title}}) => (
            <Text
              style={{color: 'white'}}
            >{`Suggested to you by ${title}`}</Text>
          )}
        />

        {/* <Layout>
          {this.state.prompterList.map((prompter, prompterIndex) => (
            <Fragment key={prompterIndex}>
              <Text
                style={{color: 'white'}}
              >{`Suggested to you by ${prompter}`}</Text>
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
                    isSuggestionNew={
                      this.state.isSuggestionNew[prompterIndex][index]
                    }
                    userName={this.props.user.userName}
                    prompter={prompter}
                    tipIndex={index}
                    source={route}
                  />
                )}
                data={this.state.results[prompterIndex]}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <Layout style={{height: 5}} />}
              />
            </Fragment>
          ))}
        </Layout> */}
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
export default connect(mapStateToProps)(SuggestionsList);
