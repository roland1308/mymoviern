import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {
  Button,
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
} from '@ui-kitten/components';
import {connect} from 'react-redux';
import {
  setHomeBar,
  setOtherBar,
  setMessage,
  setPageName,
  setDetailBar,
} from '../store/actions/generalActions';

const axios = require('axios');

class TheOthersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      oldBack: null,
      oldCheck: null,
      oldWorld: null,
      results: {
        page: 1,
      },
      page: 1,
    };
  }

  componentDidMount() {
    const {backIs, worldIs, checkIs} = this.props.general;
    this.setState({
      oldBack: backIs,
      oldWorld: worldIs,
      oldCheck: checkIs,
    });
    this.getList();
    this.props.dispatch(setOtherBar());
    this.props.dispatch(setPageName(`-- 'The Others' List`));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.general.isBackButton != this.props.general.isBackButton) {
      this.setState({
        oldBack: false,
        oldWorld: true,
        oldCheck: false,
      });
      this.props.dispatch(setHomeBar());
      this.props.dispatch(setPageName('         My Movies DB'));
      this.props.navigation.navigate('Home');
    }
  }

  componentWillUnmount() {
    const {oldCheck, oldBack} = this.state;
    if (oldCheck) {
      this.props.dispatch(setDetailBar());
    } else if (oldBack) {
      this.props.dispatch(setOtherBar());
    } else {
      this.props.dispatch(setHomeBar());
      this.props.dispatch(setPageName('         My Movies DB'));
    }
  }

  async getList() {
    try {
      const url = `https://mymoviesback.herokuapp.com/users/userlist/${this.props.user.userName}?`;
      let response = await axios.get(url);
      if (response.length === 0) {
        this.props.navigation.navigate('Home');
        this.props.dispatch(setMessage('Sorry: no results'));
      } else {
        this.setState({
          results: response.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
    return;
  }

  renderItemIcon = (props) => <Icon {...props} name='person' />;

  renderItem = ({item, index}) => (
    <ListItem
      style={{backgroundColor: '#333', borderRadius: 10}}
      title={item.userName}
      accessoryLeft={this.renderItemIcon}
      accessoryRight={() => {
        const totMovies = item.movies.length;
        const totSeries = item.series.length;
        return (
          <Layout style={{flexDirection: 'row', backgroundColor: '#333'}}>
            <Button
              disabled={totMovies === 0}
              size='small'
              style={{margin: 5}}
              onPress={() =>
                this.props.navigation.push('User Lists', {
                  type: 'movie',
                  idList: item.movies,
                  starList: item.movieStars,
                  route: 'otherList',
                })
              }
            >
              {`Movies (${totMovies})`}
            </Button>
            <Button
              disabled={totSeries === 0}
              size='small'
              style={{margin: 5}}
              onPress={() =>
                this.props.navigation.push('User Lists', {
                  type: 'tv',
                  idList: item.series,
                  starList: item.serieStars,
                  route: 'otherList',
                })
              }
            >
              {`Series (${totSeries})`}
            </Button>
          </Layout>
        );
      }}
    />
  );

  render() {
    return (
      <Layout style={styles.container}>
        <List
          data={this.state.results}
          renderItem={this.renderItem}
          ItemSeparatorComponent={Divider}
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
export default connect(mapStateToProps)(TheOthersList);
