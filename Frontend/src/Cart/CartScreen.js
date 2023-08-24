import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderScreen from '../Configs/HeaderScreen';

export default function CartScreen({navigation}) {
  const user = useSelector(state => state.user);
  const refreshCart = useSelector(state => state.refreshCart);
  const dispatch = useDispatch();
  const [quantityOpen, setQuantityOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(null);
  const [cartItems, setCartItems] = React.useState(null);
  const [quantityList, setQuantityList] = React.useState([
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
    {label: '5', value: '5'},
  ]);

  const [qtyState, setQtyState] = React.useState([]);
  const [tokenTotal, setTokenTotal] = React.useState('0');
  const [spinnerEnabled, setSpinnerEnabled] = React.useState(false);

  React.useEffect(() => {
    getShoppingCartItem(user);
  }, [refreshCart]);

  return (
    <View style={styles.mainContainer}>
      <Spinner
        visible={spinnerEnabled}
        textContent={'Loading...'}
        textStyle={{color: '#fff'}}
        overlayColor="rgba(0, 0, 0, 0.70)"
      />
      <HeaderScreen navigation={navigation} type="menu" />

      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <View style={styles.categoryStyle}>
            <Text style={styles.categoryText}>Shopping cart</Text>
          </View>

          <View style={styles.itemContainer}>
            <FlatList
              data={cartItems}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.itemInsideContainer}>
                    <View style={styles.itemImageContainer}>
                      <View style={styles.imageView}>
                        <Image
                          source={{uri: item.image}}
                          style={styles.imageStyle}
                        />
                      </View>
                    </View>

                    <View style={styles.itemDetailContainer}>
                      <View style={{width: '100%', height: 130}}>
                        <View style={{width: '100%', flexDirection: 'row'}}>
                          <Text style={{...styles.subhead, width: '70%'}}>
                            {item.title}
                          </Text>
                        </View>

                        <Text style={styles.head}>
                          Category: {item.category}
                        </Text>
                        <Text style={styles.head}>
                          {item.description.substring(1, 150)}...
                        </Text>
                        <Text style={styles.head}>
                          Price:{' '}
                          <FontAwesome name="rupee" size={10} color="#272F32" />{' '}
                          {item.price * item.qty}
                        </Text>
                        <Text style={styles.head}>Quantity:{item.qty} </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>

          {cartItems == null ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <TouchableOpacity
                style={styles.continueShoppingBtn}
                onPress={() =>
                  navigation.navigate('Dashboard', {screen: 'Dashboard'})
                }>
                <Text style={styles.subhead}>Continue shopping</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <View style={styles.bottomContainer}>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <View
              style={{
                width: '50%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.subhead}>
                Total Amount:{' '}
                <FontAwesome name="rupee" size={14} color="#272F32" />{' '}
                {tokenTotal}
              </Text>
            </View>
            <View style={{width: '50%', height: 50}}>
              <TouchableOpacity
                onPress={() => {
                  if (cartItems != null) {
                    placeOrder();
                  } else {
                    showMessage({
                      message: 'Can not proceed as no item in the cart',
                      type: 'danger',
                    });
                  }
                }}
                style={{
                  width: '90%',
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f7cf94',
                  borderRadius: 10,
                }}>
                <Text style={styles.subhead}>Place order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  async function getShoppingCartItem(user) {
    console.log(user.token);
    setSpinnerEnabled(true);
    await fetch('https://ecommr-api.herokuapp.com/getcart', {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + user.token,
      }),
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson);
        setSpinnerEnabled(false);
        if (
          !(
            responseJson.hasOwnProperty('response') &&
            responseJson.response == 'Your cart is empty!'
          )
        ) {
          setCartItems(responseJson);
          setTotalAmount(responseJson);
        } else {
          setCartItems(null);
          setTotalAmount('0');
        }
      })
      .catch(error => {
        console.error(error);
        setSpinnerEnabled(false);
      });
  }

  async function placeOrder() {
    setSpinnerEnabled(true);
    var requestObject = [];
    cartItems.forEach(cartItem => {
      requestObject.push({
        id: cartItem.id,
        qty: cartItem.qty,
        price: cartItem.price,
        sid: cartItem.sid,
      });
    });

    console.log(requestObject);

    await fetch('https://ecommr-api.herokuapp.com/placeorder', {
      method: 'POST',
      body: JSON.stringify(requestObject),
      headers: new Headers({
        'Content-Type': 'application/json', // <-- Specifying the Content-Type
        Authorization: 'Bearer ' + user.token,
      }),
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson);
        setSpinnerEnabled(false);
        if (responseJson.response == 'Order Placed!') {
          showMessage({
            message: responseJson.response,
            type: 'success',
          });
          dispatch({
            type: 'refreshCart',
            data: !refreshCart,
          });
          navigation.navigate('OrderSuccess');
        } else {
          showMessage({
            message: 'Error occured, contact to support!',
            type: 'danger',
          });
        }
      })
      .catch(error => {
        setSpinnerEnabled(false);
        console.error(error);
      });
  }

  function setTotalAmount(cartItems) {
    var total = 0;
    cartItems.forEach(element => {
      total = total + parseInt(element.price * element.qty);
    });
    setTokenTotal(total);
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
  topContainer: {
    flex: 0.9,
  },
  bottomContainer: {
    flex: 0.1,
    backgroundColor: '#F6F6F6',
    paddingTop: 5,
  },
  categoryText: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 20,
    color: '#272F32',
    width: '100%',
  },
  categoryStyle: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  itemContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 30,
    paddingBottom: 50,
  },
  itemInsideContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 10,
  },
  itemImageContainer: {
    width: '35%',
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  itemDetailContainer: {
    width: '65%',
    height: 130,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  imageView: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
  },
  imageStyle: {
    width: '100%',
    height: 130,
    resizeMode: 'stretch',
  },
  currencyStyle: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  head: {
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 10,
    color: '#272F32',
  },
  subhead: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 14,
    color: '#272F32',
  },
  continueShoppingBtn: {
    marginTop: 20,
    width: 200,
    height: 50,
    backgroundColor: '#f7cf94',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
