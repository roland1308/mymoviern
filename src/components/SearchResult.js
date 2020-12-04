import React from 'react';
import {useDispatch} from 'react-redux';
import {
  StyleSheet,
  TouchableHighlight,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';
import {Icon} from 'react-native-eva-icons';
import {View} from 'native-base';
import {
  removeTipToUser,
  removeViewedTip,
} from '../../store/actions/userActions';

const removeSuggestion = (suggestion) => {};

function SearchResult({
  id,
  poster_path,
  title,
  date,
  type,
  navigation,
  stars,
  arrayPos,
  isSuggestionNew,
  source,
  userName,
  prompter,
  tipIndex,
}) {
  const dispatch = useDispatch();
  const touchWidth =
    source === 'myList' || source === 'SuggestionList' ? '86%' : '95%';
  return (
    <View
      style={isSuggestionNew ? styles.itemYellowBorder : styles.itemBlackBorder}
    >
      <TouchableHighlight
        underlayColor='#DDDDDD'
        onPress={() => {
          if (source === 'SuggestionList') {
            dispatch(removeViewedTip(userName, {prompter, tipIndex}));
          }
          if (type === 'movie') {
            navigation.navigate('Movie Details', {
              detailsId: id,
              source: 'search',
            });
          } else {
            navigation.navigate('Tv Details', {
              detailsId: id,
              source: 'search',
            });
          }
        }}
      >
        <Layout style={styles.grid}>
          <View style={{flexDirection: 'row', width: touchWidth}}>
            <Image
              style={{width: 60, height: 90}}
              source={
                poster_path == null
                  ? require('../../assets/noPoster.png')
                  : {uri: 'https://image.tmdb.org/t/p/w154' + poster_path}
              }
            />
            <Text style={styles.subTitle}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.date}>{`\n${date}`}</Text>
              {(source === 'myList' || source === 'otherList') &&
                '\n' + '⭐️'.repeat(stars)}
            </Text>
          </View>
        </Layout>
      </TouchableHighlight>
      {source === 'myList' && (
        <View
          style={{
            backgroundColor: '#555',
            borderRadius: 15,
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (type === 'movie') {
                navigation.navigate('Movie Details Remove', {
                  detailsId: id,
                  source: 'remove',
                  arrayPos,
                });
              } else {
                navigation.navigate('Tv Details Remove', {
                  detailsId: id,
                  source: 'remove',
                  arrayPos,
                });
              }
            }}
          >
            <Icon name='trash-2-outline' width={25} height={25} fill='#F55' />
          </TouchableOpacity>
        </View>
      )}
      {source === 'SuggestionList' && (
        <View
          style={{
            backgroundColor: '#555',
            borderRadius: 15,
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              dispatch(removeTipToUser(userName, {prompter, tipIndex}));
            }}
          >
            <Icon name='bell-off-outline' width={25} height={25} fill='#F55' />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
  date: {
    fontSize: 14,
  },
  subTitle: {
    fontSize: 12,
    margin: 5,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#333',
  },
  itemBlackBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    padding: 5,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: StyleSheet.hairlineWidth,
  },
  itemYellowBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    padding: 5,
    borderRadius: 10,
    borderColor: 'yellow',
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default SearchResult;
