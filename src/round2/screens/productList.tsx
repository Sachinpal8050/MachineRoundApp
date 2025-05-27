import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Animated} from 'react-native';
import Header from '../components/header';
import Product from '../components/product';
import {useAddedProductInfo} from '../context';
import {getProducts} from '../utils';

type ProductType = {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
};

const HEADER_HEIGHT = 60;

const ProductList = ({setIsLogIn}: {setIsLogIn: (val: boolean) => void}) => {
  const [productList, setProductList] = useState<ProductType[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const {addedProducts, resetProductData} = useAddedProductInfo();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [numCol, setNumCol] = useState(1);

  useEffect(() => {
    (async () => {
      const json = await getProducts();
      setProductList(json);
    })();
  }, []);

  const translateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [-HEADER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  const getTotalAmountWithDis = () => {
    const sum = addedProducts.reduce(
      (acc: number, item: {quantity: number; price: number}) =>
        acc + item.quantity * item.price,
      0,
    );
    return (sum - (sum * 10) / 100).toFixed(2);
  };

  const handleGotoDetails = () => {
    setIsDetailsOpen(true);
  };

  const handleLogOut = () => {
    setIsLogIn(false);
    resetProductData();
  };
  const renderItem = ({item}: {item: ProductType}) => {
    return (
      <Product
        id={item.id}
        title={item.title}
        subTitle={item.description}
        price={item.price}
        imgUrl={item.image}
      />
    );
  };

  const renderDetailsPage = () => {
    return (
      <View style={styles.billCon}>
        <Text style={styles.title}>Bill Details</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Total Items:</Text>
          <Text style={styles.value}>{addedProducts.length}</Text>
        </View>

        <View style={styles.itemsList}>
          {addedProducts.map(
            (item: {quantity: number; name: string}, index: number) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
              </View>
            ),
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Discount:</Text>
          <Text style={styles.value}>10%</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Grand Total:</Text>
          <Text style={styles.total}>{getTotalAmountWithDis()}</Text>
        </View>

        <Pressable
          style={styles.closeBtn}
          onPress={() => setIsDetailsOpen(false)}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isDetailsOpen ? (
        renderDetailsPage()
      ) : (
        <View>
          <Header
            onLOgOutPress={handleLogOut}
            translateY={translateY}
            onChangeColumnPress={() => setNumCol(numCol === 1 ? 2 : 1)}
          />
          <Animated.FlatList
            data={productList}
            key={numCol}
            numColumns={numCol}
            renderItem={renderItem}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: true},
            )}
            columnWrapperStyle={numCol === 2 ? {gap: 20} : null}
            scrollEventThrottle={16}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
          />
          {addedProducts.length ? (
            <View style={styles.footer}>
              <Text style={styles.itemText}>
                Total Items : {addedProducts.length}
              </Text>
              <Pressable onPress={handleGotoDetails} style={styles.detailsBtn}>
                <Text>Go To Details </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 10,
  },
  list: {
    gap: 20,
    padding: 20,
    paddingBottom: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'orange',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  detailsBtn: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  billCon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  closeBtn: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  cardItem: {
    fontSize: 20,
    fontWeight: '300',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    color: 'black',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red',
  },
  itemsList: {
    marginVertical: 12,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 15,
    color: 'black',
  },
  itemQty: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
