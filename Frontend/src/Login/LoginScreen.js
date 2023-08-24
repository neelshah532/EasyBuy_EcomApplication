import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {OutlinedTextField} from 'react-native-material-textfield';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {showMessage} from 'react-native-flash-message';

export default function LoginScreen({navigation}) {
  const dispatch = useDispatch();
  const [isSelected, setSelection] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, SetPassword] = React.useState('');
  const [spinnerEnabled, setSpinnerEnabled] = React.useState(false);

  React.useEffect(() => {
    checkUserLoggedin();
    async function checkUserLoggedin() {
      const user = await AsyncStorage.getItem('user');
      console.log(user);
      if (user !== null) {
        dispatch({type: 'user', data: JSON.parse(user)});
      }
    }
  }, []);

  return (
    <LinearGradient
      colors={['#e29371', '#d3541d', '#d3541d']}
      style={styles.mainContainer}>
      <Spinner
        visible={spinnerEnabled}
        textContent={'Loading...'}
        textStyle={{color: '#fff'}}
        overlayColor="rgba(0, 0, 0, 0.70)"
      />
      <View style={styles.topContainer}>
        <Text style={styles.head}>Welcome</Text>
        <Text style={styles.head}>Back!</Text>
        <Text style={styles.subhead}>Continue your adventure</Text>
      </View>

      <View style={styles.bottomContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{justifyContent: 'center', marginTop: 70}}>
            <OutlinedTextField
              label="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={text => setEmail(text)}
            />

            <OutlinedTextField
              label="Password"
              keyboardType="default"
              value={password}
              autoCapitalize={'none'}
              onChangeText={text => SetPassword(text)}
              secureTextEntry={true}
            />

            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                if (validation()) {
                  login();
                }
              }}>
              <Text style={styles.buttonTextStyle}>Sign In</Text>
            </TouchableOpacity>

            {/* <Text style={styles.forgotStyle}>Forgot password?</Text> */}

            <Text style={{textAlign: 'center', marginTop: 40}}>
              Need an account?{' '}
              <Text
                style={styles.forgotStyle}
                onPress={() => navigation.navigate('Signup')}>
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );

  async function login() {
    setSpinnerEnabled(true);
    await fetch('https://ecommr-api.herokuapp.com/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: new Headers({
        'Content-Type': 'application/json', // <-- Specifying the Content-Type
      }),
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson);
        setSpinnerEnabled(false);
        if (
          responseJson.hasOwnProperty('response') &&
          responseJson.response == 'Invalid credentials!'
        ) {
          showMessage({message: responseJson.response, type: 'danger'});
        } else {
          await AsyncStorage.setItem('user', JSON.stringify(responseJson));
          dispatch({type: 'user', data: responseJson});
        }
      })
      .catch(error => {
        setSpinnerEnabled(false);
        console.error(error);
      });
  }

  function validation() {
    if (email == '') {
      showMessage({
        message: 'Please enter email!',
        type: 'danger',
      });
    } else if (password == '') {
      showMessage({
        message: 'Please enter password!',
        type: 'danger',
      });
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
