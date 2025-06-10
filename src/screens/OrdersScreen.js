import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { globalStyles, colors } from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StatusBar } from 'react-native';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

// const orders = [
//   {
//     id: '1',
//     orderNumber: '#12345',
//     date: 'June 15, 2023',
//     status: 'Delivered',
//     total: '$18.44',
//     items: [
//       { name: 'Organic Apples', quantity: 2, price: '$2.99', image: 'https://via.placeholder.com/80' },
//       { name: 'Fresh Milk', quantity: 1, price: '$3.49', image: 'https://via.placeholder.com/80' },
//     ],
//   },
//   {
//     id: '2',
//     orderNumber: '#12344',
//     date: 'June 10, 2023',
//     status: 'Cancelled',
//     total: '$12.97',
//     items: [
//       { name: 'Whole Wheat Bread', quantity: 3, price: '$1.99', image: 'https://via.placeholder.com/80' },
//     ],
//   },
//   {
//     id: '3',
//     orderNumber: '#12343',
//     date: 'June 5, 2023',
//     status: 'Delivered',
//     total: '$25.92',
//     items: [
//       { name: 'Carrots', quantity: 5, price: '$1.29', image: 'https://via.placeholder.com/80' },
//       { name: 'Chicken Breast', quantity: 2, price: '$5.99', image: 'https://via.placeholder.com/80' },
//     ],
//   },
// ];

const OrdersScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const orders = useSelector((state) => state.rootReducer.orderData.arr);
  console.log(orders, "ordersorders")

  useEffect(() => {

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const renderItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.orderCard,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }]
        }
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>#{item.order_id}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            item.status === 'Delivered' ? styles.deliveredBadge :
              item.status === 'Cancelled' ? styles.cancelledBadge : styles.processingBadge
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.itemsContainer}>
          {item.item.map((product, index) => (
            <View key={index} style={styles.itemRow}>
              <Image source={{ uri: product.product.thumbnail }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{product.product.title}</Text>
                <Text style={styles.itemQuantity}>{product.quantity} x {product.product.price}</Text>
              </View>
            </View>
          ))}

        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>Total: {item.total}</Text>

        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
    
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <LinearGradient
        colors={[colors.primary, colors.primary]}
        style={styles.statusBarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

     
      <LinearGradient
        colors={[colors.primary, colors.primary]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={colors.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.order_id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={require('../assets/images/cart_blank.png')}
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>No Orders Yet</Text>
              <Text style={styles.emptyText}>You haven't placed any orders yet</Text>
             
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  statusBarGradient: {
    height: StatusBar.currentHeight,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight,
    elevation: 3,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  headerRight: {
    width: 24, 
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
    backgroundColor: colors.white
  },
  orderCard: {
    backgroundColor: colors.lightBg,
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  orderDate: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  deliveredBadge: {
    backgroundColor: colors.successLight,
  },
  cancelledBadge: {
    backgroundColor: colors.dangerLight,
  },
  processingBadge: {
    backgroundColor: colors.warningLight,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  itemsContainer: {
    marginVertical: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: colors.light,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 3,
  },
  moreItemsText: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 5,
    textAlign: 'center',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  reorderButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  reorderButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    height : 700
   
  },
  emptyImage: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 20,
  
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  shopButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrdersScreen;