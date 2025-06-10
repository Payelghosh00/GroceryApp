import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useCart } from '../../cart/CartContext';
import ProductCard from '../../components/ProductCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { productList } from '../../redux/actions';
import axios from 'axios';

const { width } = Dimensions.get('window');

const ProductListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.rootReducer.productList.arr);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const { cartItems, addToCart, removeFromCart, cartCount } = useCart();

  const getProductQuantity = (productId) => {
    return cartItems.find(item => item.product.id === productId)?.quantity || 0;
  };

  const fetchProducts = async (reset = false) => {
    const currentPage = reset ? 0 : page;
    const skip = currentPage * limit;

    try {
      reset ? setLoading(true) : setLoadingMore(true);
      const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);

      if (response.data) {
        if (reset) {
          dispatch(productList(response.data.products));
        } else {
          dispatch(productList([...productData, ...response.data.products]));
        }
        setTotalItems(response.data.total);
        setPage(currentPage + 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && productData.length < totalItems) {
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts(true);
  }, [navigation]);

  return (
    <View style={styles.container}>
     
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{'Product list'}</Text>

      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00b246" />
        </View>
      ) : productData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="search-off" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={productData}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              quantity={getProductQuantity(item.id)}
              onAdd={() => addToCart(item)}
              onIncrement={() => addToCart(item)}
              onDecrement={() => removeFromCart(item)}
              cardStyle={styles.productCard}
              imageHeight={120}
            />
          )}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color="#00b246" />
              </View>
            ) : null
          }
        />
      )}

      {cartCount > 0 && (
        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => navigation.navigate('Cart')}
        >
          <Icon name="shopping-cart" size={24} color="#fff" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    marginTop: 40
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productList: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  productCard: {
    width: width / 2 - 16,
    margin: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    marginTop: 15,
  },
  loadingMore: {
    paddingVertical: 20,
  },
  cartIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00b246',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e91e63',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ProductListScreen;