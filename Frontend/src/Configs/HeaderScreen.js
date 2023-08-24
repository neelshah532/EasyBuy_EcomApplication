import * as React from 'react';
import {View, StyleSheet, Image, Text, Alert} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch} from 'react-redux';

export default function HeaderScreen({navigation, type}) {
  const dispatch = useDispatch();
  return (
    <View style={styles.headContainer}>
      <View
        style={{
          width: '90%',
          flexDirection: 'row',
        }}>
        <View style={styles.headLeft}>
          {type == 'menu' ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../../assets/img/logo.png')}
                style={{width: 35, height: 35, marginRight: 5}}
              />
              <Text style={styles.head}>Ecommerce App</Text>
            </View>
          ) : (
            <AntDesign
              name="arrowleft"
              size={35}
              color="#aa4303"
              onPress={() => navigation.goBack()}
            />
          )}
        </View>
        <View style={styles.headRight}>
          <Text style={styles.subhead} onPress={() => logout()}>
            Logout
          </Text>
        </View>
      </View>
    </View>
  );

  async function logout() {
    Alert.alert('Confirmation', 'Do you really want to logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await AsyncStorage.removeItem('user');
          dispatch({type: 'user', data: null});
        },
      },
    ]);
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headRight: {
    width: '50%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headLeft: {
    width: '50%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headContainer: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#f9e1ca',
    justifyContent: 'center',
  },
  head: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 20,
    color: '#272F32',
  },
  subhead: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 16,
    color: '#272F32',
  },
});
