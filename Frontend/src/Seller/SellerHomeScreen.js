import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderScreen from '../Configs/HeaderScreen';

export default function SellerHomeScreen({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [category, setCategory] = React.useState([]);
  const [categoryLength, setCategoryLength] = React.useState(1);
  const [spinnerEnabled, setSpinnerEnabled] = React.useState(false);

  React.useEffect(() => {
    console.log(user);
    getCategory(user);
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Spinner
        visible={spinnerEnabled}
        textContent={'Loading...'}
        textStyle={{color: '#fff'}}
        overlayColor="rgba(0, 0, 0, 0.70)"
      />
      <HeaderScreen navigation={navigation} type="menu" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bottomContainer}>
          <View style={styles.categoryStyle}>
            <Text style={styles.head}>Products</Text>
            <View style={{width: '50%', alignItems: 'flex-end'}}>
              <Ionicons name="filter" size={30} color="#272F32" />
            </View>
          </View>

          <View style={styles.itemContainer}>
            {category.length > 0 &&
              [...Array(categoryLength)].map((element, index) => {
                return (
                  <View
                    key={index}
                    style={{flexDirection: 'row', marginTop: 10}}>
                    <TouchableOpacity
                      style={styles.itemSubContainer}
                      onPress={() =>
                        navigation.navigate('ProductUpdate', {
                          product: category[index],
                        })
                      }>
                      <Image
                        source={{uri: category[index].image}}
                        style={{
                          width: '100%',
                          height: 150,
                          resizeMode: 'cover',
                        }}
                      />
                      <Text style={styles.subhead}>
                        {category[index].title}
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        width: '4%',
                        height: 200,
                        backgroundColor: '#f6f6f6',
                      }}></View>
                    {category.length > index * 2 + 1 ? (
                      <TouchableOpacity
                        style={styles.itemSubContainer}
                        onPress={() =>
                          navigation.navigate('ProductUpdate', {
                            product: category[index * 2 + 1],
                          })
                        }>
                        <Image
                          source={{uri: category[index * 2 + 1].image}}
                          style={{
                            width: '100%',
                            height: 150,
                            resizeMode: 'cover',
                          }}
                        />
                        <Text style={styles.subhead}>
                          {category[index * 2 + 1].title}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </View>
  );

  async function getCategory(user) {
    console.log(user.token);
    setSpinnerEnabled(true);
    await fetch('https://ecommr-api.herokuapp.com/getproducts', {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + user.token,
      }),
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson.products);
        setCategory(responseJson.products);
        console.log(Math.ceil(responseJson.products.length / 2));
        setCategoryLength(Math.ceil(responseJson.products.length / 2));
        setSpinnerEnabled(false);
      })
      .catch(error => {
        console.error(error);
        setSpinnerEnabled(false);
      });
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  topContainer: {
    flex: 0.3,
    backgroundColor: '#F6F6F6',
    marginTop: 10,
  },
  bottomContainer: {
    flex: 0.7,
  },
  head: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 20,
    color: '#272F32',
    width: '50%',
  },
  categoryStyle: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 30,
  },
  itemContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  itemSubContainer: {
    width: '48%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subhead: {
    fontFamily: 'RobotoSlab-Bold',
    fontSize: 15,
    color: '#272F32',
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
  animation: {
    flex: 1,
  },
});
