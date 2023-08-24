import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DropDownPicker from 'react-native-dropdown-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector, useDispatch} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {showMessage} from 'react-native-flash-message';
import {OutlinedTextField} from 'react-native-material-textfield';
import Entypo from 'react-native-vector-icons/Entypo';

export default function ProductUpdateScreen({navigation, route}) {
  var dispatch = useDispatch();
  var product = route.params.product;
  const user = useSelector(state => state.user);
  const refreshCart = useSelector(state => state.refreshCart);
  const [dimensionOpen, setDimensionOpen] = React.useState(false);
  const [dimension, setDimension] = React.useState(null);
  const [dimensionList, setDimensionList] = React.useState([]);
  const [selectedDimension, setSelectedDimension] = React.useState(null);

  const [quantityOpen, setQuantityOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(null);
  const [quantityList, setQuantityList] = React.useState([
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
    {label: '5', value: '5'},
  ]);
  const [finalPrice, setFinalPrice] = React.useState(0);
  const [spinnerEnabled, setSpinnerEnabled] = React.useState(false);
  const [price, setPrice] = React.useState('');
  const [qty, setQty] = React.useState('');

  React.useEffect(() => {
    setSellers();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Spinner
        visible={spinnerEnabled}
        textContent={'Loading...'}
        textStyle={{color: '#fff'}}
        overlayColor="rgba(0, 0, 0, 0.70)"
      />

      <View style={styles.headContainer}>
        <View style={styles.headLeft}>
          <AntDesign
            name="arrowleft"
            size={30}
            color="#aa4303"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.head}>Product Update</Text>
        </View>
      </View>
      {Object.keys(product).length != 0 ? (
        <View style={{flex: 1, margin: 10}}>
          <View style={{flex: 0.5}}>
            <TouchableOpacity>
              <Image source={{uri: product.image}} style={styles.imageStyle} />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <View style={{margin: 20}}>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <Text style={{...styles.subhead, width: '100%'}}>
                  {product.title}
                </Text>
              </View>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <Text style={{...styles.subhead_sm, width: '100%'}}>
                  Category: {product.category}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: 50,
                  alignItems: 'center',
                }}>
                <Text style={styles.subhead_sm}>{product.description}</Text>
              </View>

              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  width: '100%',
                }}>
                <View style={{width: '50%'}}>
                  <OutlinedTextField
                    label="Price"
                    keyboardType="phone-pad"
                    value={price}
                    onChangeText={text => setPrice(text)}
                  />
                </View>
                <View style={{width: '5%'}}></View>
                <View style={{width: '40%'}}>
                  <OutlinedTextField
                    label="Quantity"
                    keyboardType="phone-pad"
                    value={qty}
                    onChangeText={text => setQty(text)}
                  />
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                  height: 50,
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => update()}
                  style={{
                    width: 250,
                    height: 50,
                    backgroundColor: '#fcca88',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    marginLeft: 10,
                    flexDirection: 'row',
                  }}>
                  <Text style={styles.subhead}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );

  function setSellers() {
    var sellerList = [];
    product.seller.forEach((x, i) => {
      sellerList.push({label: x.seller_email, value: x});
    });
    setDimensionList(sellerList);
  }

  function dimensionSelected(value) {
    console.log('11----', value);
    if (value != null && value.hasOwnProperty('price')) {
      setFinalPrice(value.price);
      setSelectedDimension(value);
    }
  }

  async function update() {
    if (validateForm()) {
      console.log(user.token);
      setSpinnerEnabled(true);
      await fetch('https://ecommr-api.herokuapp.com/updateproductPriceAndQty', {
        method: 'POST',
        body: JSON.stringify({
          id: product.id,
          qty: qty,
          sid: user.id,
          price: price,
        }),
        headers: new Headers({
          'Content-Type': 'application/json', // <-- Specifying the Content-Type
          Authorization: 'Bearer ' + user.token,
        }),
      })
        .then(response => response.json())
        .then(async responseJson => {
          console.log(responseJson);
          setSpinnerEnabled(false);
          if (responseJson.response == 'Price and Quantity added!') {
            showMessage({
              message: responseJson.response,
              type: 'success',
            });
            navigation.navigate('SellerHome');
          } else {
            showMessage({
              message: 'Error occured, contact to support!!!',
              type: 'danger',
            });
          }
        })
        .catch(error => {
          setSpinnerEnabled(false);
          console.error(error);
        });
    }
  }

  function validateForm() {
    if (price == '') {
      showMessage({
        message: 'Please enter the price!',
        type: 'danger',
      });
      return false;
    } else if (qty == '') {
      showMessage({
        message: 'Please enter the quantity!',
        type: 'danger',
      });
      return false;
    }
    return true;
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fcca88',
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
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headCenter: {
    width: '50%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  head: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 20,
    color: '#aa4303',
    textAlign: 'center',
    width: '80%',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bottomContainer: {
    flex: 0.5,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10,
  },
  subhead: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 18,
    color: '#aa4303',
  },
  subhead_sm: {
    fontFamily: 'RobotoSlab-Regular',
    fontSize: 12,
    color: '#aa4303',
    marginBottom: 2,
  },
  subhead_sm_bold: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 14,
    color: '#aa4303',
    marginBottom: 2,
  },
  error: {fontSize: 12, textAlign: 'center', color: 'red'},
});
