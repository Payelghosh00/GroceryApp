import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { productDetails } from '../redux/actions';
const ProductCard = ({
  item,
  quantity = 0,
  onAdd,
  onIncrement,
  onDecrement,
  cardStyle,
  imageStyle,
  contentStyle,
  addButtonColor = '#4CAF50',
  quantityButtonColor = '#4CAF50',
  showDiscount = true,
  maxNameLines = 3,
  imageHeight = 150,
}) => {

  const navigation = useNavigation();
  const dispatch = useDispatch()

  const handleProductPress = () => {
    dispatch(productDetails({
      productId: item.id,
      productName: item.title,
      productData: item

    }))

    navigation.navigate('ProductDetail');
  };
  return (
    <Card style={[styles.card, cardStyle]} mode="elevated" elevation={1}>

      <View style={styles.imageContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleProductPress}>
          <Card.Cover
            source={{ uri: item.thumbnail }}
            style={[styles.image, { height: imageHeight }, imageStyle]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {quantity > 0 ? (
          <View style={[styles.quantityContainer, { backgroundColor: quantityButtonColor }]}>
            <IconButton
              icon="minus"
              size={16}
              onPress={onDecrement}
              iconColor="white"
              style={styles.quantityButton}
            />
            <Text style={styles.quantityText}>{quantity}</Text>
            <IconButton
              icon="plus"
              size={16}
              onPress={onIncrement}
              iconColor="white"
              style={styles.quantityButton}
            />
          </View>
        ) : (
          <IconButton
            icon="plus"
            size={20}
            mode="contained"
            onPress={onAdd}
            style={[styles.addButton, { backgroundColor: addButtonColor }]}
            iconColor="white"
          />
        )}
      </View>



      <TouchableOpacity activeOpacity={0.8} onPress={handleProductPress}>
        <Card.Content style={[styles.content, contentStyle]} >
          <Text style={styles.weight} numberOfLines={1}>
            {item.category}
          </Text>

          <Text style={styles.name} numberOfLines={maxNameLines}>
            {item.title}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            {item.mrp && (
              <View style={{ flexDirection: "row" }}>


                <Text>MRP :</Text>
                <Text style={styles.originalPrice}> ₹{item.mrp}</Text>
              </View>
            )}
            {showDiscount && item.discount && (
              <Text style={styles.discount}>{item.discount}</Text>
            )}
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    margin: 4,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#f9f9f9',
  },
  image: {
    backgroundColor: 'transparent',
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    margin: 0,
  },
  quantityContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  quantityButton: {
    margin: 0,
  },
  quantityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginHorizontal: 4,
  },
  content: {
    padding: 12,
  },
  weight: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  name: {
    fontWeight: '700',
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
    minHeight: 40,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  price: {
    fontWeight: 'bold',
    color: '#e91e63',
    fontSize: 16,
    marginRight: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
    fontSize: 12,
    marginRight: 8,
  },
  discount: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ProductCard;