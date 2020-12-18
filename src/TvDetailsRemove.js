import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';
import {
  Layout,
  Text,
  Spinner,
  Modal,
  Card,
  Button,
} from '@ui-kitten/components';

import {API_KEY} from 'react-native-dotenv';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {setHomeBar, toggleMustRefresh} from '../store/actions/generalActions';
import Separator from './components/Separator';
import {removeSerieToUser} from '../store/actions/userActions';

const axios = require('axios');

class TvDetailsRemove extends Component {
  constructor(props) {
    super(props);

    this.state = {
      details: null,
      source: null,
      isLoading: true,
      removeVoteVisible: false,
      needRefresh: false,
    };
  }

  componentDidMount() {
    const {detailsId, source} = this.props.route.params;
    let uri =
      'https://api.themoviedb.org/3/tv/' +
      detailsId +
      '?api_key=' +
      API_KEY +
      '&language=' +
      this.props.general.language;
    this.setState({removeVoteVisible: true});
    this.setState({source});
    this.getDetails(uri).done();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.general.isBackButton != this.props.general.isBackButton) {
      this.props.dispatch(setHomeBar());
      this.setState({source: 'list'});
      this.props.navigation.navigate('Home');
    }
    if (prevProps.route.params.source != this.props.route.params.source) {
      if (this.props.route.params.source === 'remove') {
        this.setState({removeVoteVisible: true});
      }
    }
  }

  componentWillUnmount() {
    if (this.state.needRefresh) {
      this.props.dispatch(toggleMustRefresh());
    }
  }

  async getDetails(uri) {
    const request = await axios.get(uri);
    axios
      .all([request])
      .then(
        axios.spread((...responses) => {
          const response = responses[0];
          if (response.status === 200) {
            this.setState({
              details: response.data,
            });
          } else {
            this.setState({
              error: true,
              errorMsg: response.data.status_message,
            });
            return;
          }
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
    return;
  }

  cancelRemove = () => {
    this.setState({removeVoteVisible: false});
    this.props.navigation.push('User Lists');
  };

  confirmRemove = () => {
    const {arrayPos} = this.props.route.params;
    const {userName, series, serieStars} = this.props.user;
    const data = {
      userName,
      serieIndexToRemove: arrayPos,
      serieId: series[arrayPos],
      starsToRemove: serieStars[arrayPos],
    };
    this.props.dispatch(removeSerieToUser(data));
    this.cancelRemove();
  };

  render() {
    if (this.state.details === null) {
      return (
        <Layout style={{flex: 1, alignItems: 'center', paddingTop: 50}}>
          <Spinner size='giant' />
        </Layout>
      );
    }
    const {name, backdrop_path, overview} = this.state.details;
    const {isLoading, removeVoteVisible} = this.state;
    return (
      <Layout style={styles.container}>
        <Modal visible={isLoading} backdropStyle={styles.backdrop}>
          <Card
            disabled={true}
            style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 50}}
          >
            <Spinner size='giant' />
          </Card>
        </Modal>
        <Modal
          visible={removeVoteVisible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => this.cancelRemove()}
        >
          <Card disabled={true}>
            <Text>Are you sure to remove this serie?</Text>
            <Layout style={styles.iconsContainer}>
              <Button
                style={{marginTop: 20}}
                status='success'
                onPress={() => this.confirmRemove()}
              >
                Remove
              </Button>
              <Button
                style={{marginTop: 20}}
                status='danger'
                onPress={() => this.cancelRemove()}
              >
                Cancel
              </Button>
            </Layout>
          </Card>
        </Modal>
        <Text style={styles.title}>{name}</Text>
        <Image
          style={{width: '100%', flex: 0.5}}
          source={
            backdrop_path == null
              ? require('../assets/noBackdrop.png')
              : {uri: 'https://image.tmdb.org/t/p/w500' + backdrop_path}
          }
        />
        <Separator />
        <ScrollView style={{flex: 1}}>
          <Text style={styles.overview}>
            {overview ? overview : 'No Description'}
          </Text>
        </ScrollView>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 10,
  },
  list: {
    height: 207,
  },
  title: {
    color: 'red',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  overview: {
    margin: 20,
    fontSize: 15,
    fontStyle: 'italic',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  icon: {
    width: 32,
    height: 32,
    marginTop: 10,
  },
  iconSmall: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  votes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => ({
  general: state.general,
  user: state.user,
});
export default connect(mapStateToProps)(TvDetailsRemove);
