import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../cart/CartContext';
import { useSelector } from 'react-redux';
// import { colors } from '../styles/globalStyles';



const ProductDetailScreen = ({ navigation }) => {
  const [showDetails, setShowDetails] = useState(false);
  const productData = useSelector((state) => state.rootReducer.productDetails.arr.productData);

  // Cart functionality
  const { addToCart, removeFromCart, cartItems } = useCart();
  const cartItem = cartItems.find(item => item.product.id === productData.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(productData);
  };

  const handleIncrement = () => {
    addToCart(productData);
  };

  const handleDecrement = () => {
    removeFromCart(productData);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{item.reviewerName}</Text>

     

      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
      <Text style={styles.reviewDate}>{new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ScrollView style={styles.scrollContainer}>

        <Image
          source={{ uri: productData.thumbnail || productData.images[0] }}
          style={styles.productImage}
        />


        <View style={styles.productInfo}>
          <Text style={styles.productName}>{productData.title}</Text>
          <Text style={styles.productBrand}>Brand: {productData.brand}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₹{productData.price}</Text>
            <Text style={styles.originalPrice}>
              ₹{(productData.price / (1 - productData.discountPercentage / 100)).toFixed(2)}
            </Text>

          </View>

          <Text style={styles.availability}>
            {productData.availabilityStatus} | {productData.stock} units available
          </Text>

          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={toggleDetails}
          >
            <Text style={styles.viewDetailsText}>
              {showDetails ? 'Hide product details ▲' : 'View product details ▼'}
            </Text>
          </TouchableOpacity>

          {showDetails && (
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.productDescription}>{productData.description}</Text>

              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailValue}>{productData.category}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Weight:</Text>
                <Text style={styles.detailValue}>{productData.weight}g</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dimensions:</Text>
                <Text style={styles.detailValue}>
                  {productData.dimensions.width}x{productData.dimensions.height}x{productData.dimensions.depth} cm
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Warranty:</Text>
                <Text style={styles.detailValue}>{productData.warrantyInformation}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Return Policy:</Text>
                <Text style={styles.detailValue}>{productData.returnPolicy}</Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />


          <Text style={styles.sectionTitle}>Customer Reviews ({productData.reviews.length})</Text>
          {productData.reviews.length > 0 ? (
            <FlatList
              data={productData.reviews}
              renderItem={renderReviewItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noReviewsText}>No reviews yet</Text>
          )}

          <View style={styles.divider} />

     
        </View>
      </ScrollView>

  
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cartSummary}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartText}>View cart</Text>
          <Text style={styles.cartItemsText}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} ITEMS</Text>
        </TouchableOpacity>

        <View style={styles.priceFooterContainer}>
          <Text style={styles.price}>₹{productData.price}</Text>
          <Text style={styles.taxText}>Inclusive of all taxes</Text>
        </View>

        {currentQuantity > 0 ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecrement}
            >
              <Icon name="remove" size={20} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{currentQuantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrement}
            >
              <Icon name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>Add to cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 70, 
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    backgroundColor: '#F9F9F9',
  },
  productInfo: {
    padding: 20,
    paddingTop: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  productBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountText: {
    fontSize: 14,
    color: '#00b246',
    fontWeight: '600',
  },
  availability: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  viewDetailsButton: {
    marginBottom: 20,
  },
  viewDetailsText: {
    color: '#00b246',
    fontSize: 14,
    fontWeight: '500',
  },
  detailsSection: {
    marginBottom: 20,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 120,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  reviewItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewComment: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 10,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartSummary: {
    flex: 1,
  },
  cartText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  cartItemsText: {
    fontSize: 12,
    color: '#666',
  },
  priceFooterContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 15,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  taxText: {
    fontSize: 10,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#00b246',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addToCartText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00b246',
    borderRadius: 4,
    overflow: 'hidden',
  },
  quantityButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  quantityText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
});

export default ProductDetailScreen;