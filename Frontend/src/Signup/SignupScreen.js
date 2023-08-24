import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {OutlinedTextField} from 'react-native-material-textfield';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({navigation}) {
  const dispatch = useDispatch();

  const [isSelected, setSelection] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [spinnerEnabled, setSpinnerEnabled] = React.useState(false);

  return (
    <LinearGradient
      colors={['#f47227', '#f47227']}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={styles.mainContainer}>
      <Spinner
        visible={spinnerEnabled}
        textContent={'Loading...'}
        textStyle={{color: '#fff'}}
        overlayColor="rgba(0, 0, 0, 0.70)"
      />
      <View style={styles.topContainer}>
        <Text style={styles.head}>Create</Text>
        <Text style={styles.head}>Account.</Text>
      </View>
      <View style={styles.bottomContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <OutlinedTextField
            label="Name"
            keyboardType="email-address"
            value={name}
            onChangeText={text => setName(text)}
          />

          <OutlinedTextField
            label="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={text => setEmail(text)}
          />

          <OutlinedTextField
            label="Address"
            keyboardType="email-address"
            value={address}
            onChangeText={text => setAddress(text)}
          />

          <OutlinedTextField
            label="Password"
            keyboardType="default"
            value={password}
            autoCapitalize={'none'}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
          />

          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              if (validation()) {
                signup();
              }
            }}>
            <Text style={styles.buttonTextStyle}>Sign Up</Text>
          </TouchableOpacity>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text>
              Already have an account{' '}
              <Text
                style={styles.forgotStyle}
                onPress={() => navigation.navigate('Login')}>
                Sign In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );

  async function signup() {
    setSpinnerEnabled(true);
    await fetch('https://ecommr-api.herokuapp.com/register', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
        location: address,
        type: 'Normal',
      }),
      headers: new Headers({
        'Content-Type': 'application/json', // <-- Specifying the Content-Type
      }),
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson);
        setSpinnerEnabled(false);
        showMessage({
          message: 'User is registered, please login!',
          type: 'success',
        });
        navigation.navigate('Login');
      })
      .catch(error => {
        setSpinnerEnabled(false);
        console.error(error);
      });
  }

  function validation() {
    if (name == '') {
      showMessage({message: 'Please enter name!', type: 'danger'});
    } else if (email == '') {
      showMessage({message: 'Please enter email!', type: 'danger'});
    } else if (address == '') {
      showMessage({message: 'Please enter address!', type: 'danger'});
    } else if (password == '') {
      showMessage({message: 'Please enter password!', type: 'danger'});
    } else {
      return true;
    }
    return false;
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  topContainer: {
    flex: 0.2,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 60,
    padding: 40,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    flex: 0.8,
    padding: 20,
    justifyContent: 'center',
  },
  head: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 28,
    color: '#272F32',
  },
  subhead: {
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 20,
    color: '#272F32',
  },
  buttonStyle: {
    marginTop: 20,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  buttonTextStyle: {
    color: '#272F32',
    fontSize: 18,
    fontFamily: 'RobotoSlab-Bold',
  },
  forgotStyle: {
    textAlign: 'right',
    color: '#272F32',
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'RobotoSlab-Bold',
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxText: {
    textAlign: 'right',
    color: '#272F32',
    marginTop: 5,
    fontSize: 16,
    fontFamily: 'RobotoSlab-Bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
