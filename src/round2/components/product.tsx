import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import {useAddedProductInfo} from '../context';

type Props = {
  id: number;
  title: string;
  imgUrl: string;
  subTitle: string;
  price: number;
};

const Product = (props: Props) => {
  const {id, title, imgUrl, subTitle, price} = props;
  const [itemQuantity, setItemQuantity] = React.useState(0);
  const {addedProducts, handleProductAddRemove} = useAddedProductInfo();

  useEffect(() => {
    const itemDetails = addedProducts.find(item => item.id === id);
    if (itemDetails) {
      setItemQuantity(itemDetails.quantity);
    }
  }, [addedProducts, id]);

  const addToCart = () => {
    setItemQuantity(itemQuantity + 1);
    handleProductAddRemove({
      id: id,
      name: title,
      price: price,
      quantity: itemQuantity + 1,
    });
  };

  const removeFromCart = () => {
    setItemQuantity(itemQuantity - 1);
    handleProductAddRemove({
      id: id,
      name: title,
      price: price,
      quantity: itemQuantity - 1,
    });
  };

  return (
    <View style={styles.product}>
      <Image
        source={{
          uri: imgUrl,
        }}
        style={styles.img}
      />
      <View style={styles.rightCon}>
        <View>
          <Text numberOfLines={1} style={styles.titleText}>
            {title}
          </Text>
          <Text numberOfLines={2} style={styles.subTitleText}>
            {subTitle}
          </Text>
          <Text>{`${'₹'} ${price}`}</Text>
        </View>
        {itemQuantity ? (
          <View style={styles.addedBtn}>
            <Pressable onPress={removeFromCart}>
              <Text style={styles.btnText}>-</Text>
            </Pressable>
            <Text style={styles.btnText}>{itemQuantity}</Text>
            <Pressable onPress={addToCart}>
              <Text style={styles.btnText}>+</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={addToCart} style={styles.btn}>
            <Text style={styles.btnText}>Add To Card</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  img: {
    height: 100,
    width: 75,
    resizeMode: 'cover',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  titleText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
  },
  subTitleText: {
    flex: 1,
    fontWeight: '100',
    fontSize: 16,
  },
  product: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  rightCon: {
    justifyContent: 'space-between',
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  btn: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: '500',
  },
  addedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
});
