import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {
  Button,
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  CheckBox,
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

class SendSuggestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkList: [],
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
    this.props.dispatch(setPageName(`-- Send your suggestion`));
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
    this.props.dispatch(setPageName('-- Movie Details'));
    if (oldCheck) {
      this.props.dispatch(setDetailBar());
    } else if (oldBack) {
      this.props.dispatch(setOtherBar());
    } else {
      this.props.dispatch(setPageName('         My Movies DB'));
      this.props.dispatch(setHomeBar());
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

  setChecked = (index) => {
    let newCheckList = this.state.checkList;
    newCheckList[index] = !newCheckList[index];
    this.setState({checkList: newCheckList});
  };

  async confirmedSuggestionSend() {
    let userNameList = [];
    this.state.results.map((user, i) => {
      this.state.checkList[i] && userNameList.push(user.userName);
    });
    const data = {
      userNameList,
      suggestion: {
        prompter: this.props.user.userName,
        tips: [true, this.props.general.detailId],
      },
    };
    try {
      await axios.put(
        'https://mymoviesback.herokuapp.com/users/addsuggestion',
        data
      );
    } catch (error) {
      if (error.response.data) {
        console.log('An error has occurred');
      } else {
        console.log(error.message);
      }
    }
    this.props.dispatch(setMessage('Suggestion sent!'));
    this.props.navigation.goBack();
  }

  renderItemIcon = (props) => <Icon {...props} name='person' />;

  renderItem = ({item, index}) => (
    <ListItem
      onPress={() => this.setChecked(index)}
      style={{backgroundColor: '#333', borderRadius: 10}}
      title={item.userName}
      accessoryLeft={this.renderItemIcon}
      accessoryRight={() => {
        return (
          <CheckBox
            checked={this.state.checkList[index]}
            onChange={() => this.setChecked(index)}
          />
        );
      }}
    />
  );

  render() {
    return (
      <>
        <Layout style={styles.iconsContainer}>
          <Button
            style={{marginTop: 20}}
            status={this.state.checkList.includes(true) && 'success'}
            disabled={!this.state.checkList.includes(true)}
            onPress={() => this.confirmedSuggestionSend()}
          >
            Send
          </Button>
          <Button
            style={{marginTop: 20}}
            status='danger'
            onPress={() => this.props.navigation.goBack()}
          >
            Cancel
          </Button>
        </Layout>
        <Layout style={styles.container}>
          <List
            data={this.state.results}
            renderItem={this.renderItem}
            ItemSeparatorComponent={Divider}
          />
        </Layout>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
const mapStateToProps = (state) => ({
  general: state.general,
  user: state.user,
});
export default connect(mapStateToProps)(SendSuggestion);
