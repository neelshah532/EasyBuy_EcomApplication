import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';

export default function OrderSuccess({navigation, route}) {
  var dispatch = useDispatch();
  const refreshCart = useSelector(state => state.refreshCart);
  React.useEffect(() => {}, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headContainer}>
        <View style={styles.headLeft}>
          <Text style={styles.head}>Order Success</Text>
        </View>
        <View style={styles.headRight}>
          <Image
            source={require('../../assets/img/logo.png')}
            style={{width: 40, height: 40}}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 10,
        }}>
        <Text style={styles.subhead}>Your order created successfully</Text>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => {
            navigation.navigate('Dashboard', {screen: 'Dashboard'});
          }}>
          <Text style={styles.subhead}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  homeBtn: {
    marginTop: 20,
    width: '50%',
    height: 40,
    backgroundColor: '#f7cf94',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  headContainer: {
    width: '90%',
    height: 60,
    flexDirection: 'row',
    alignSelf: 'center',
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
  subhead: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 14,
    color: '#272F32',
  },
  head: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 18,
    color: '#272F32',
  },
});
