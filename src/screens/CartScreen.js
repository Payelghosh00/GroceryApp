import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { globalStyles, colors } from '../styles/globalStyles';
import { useCart } from '../cart/CartContext';
import { useDispatch, useSelector } from 'react-redux';
import { orderData } from '../redux/actions';

const { width, height } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const orderDataS = useSelector((state) => state.rootReducer.orderData.arr);

  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal
  } = useCart();


  const subtotal = cartTotal();
  const deliveryFee = cartCount > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  const handleIncrement = (product) => {
    addToCart(product);
  };

  const handleDecrement = (product) => {
    removeFromCart(product);
  };

  const handleRemove = (product) => {
    while (cartItems.some(item => item.product.id === product.id)) {
      removeFromCart(product);
    }
  };

  const handleCheckout = () => {

    let order = {
      order_id: Date.now(),
      date: new Date().toLocaleString(),
      status: 'Delivered',
      total: total,
      item: cartItems
    }

    dispatch(orderData([...orderDataS, order]))
    clearCart()
    ToastAndroid.show('Order SuccessFully Placed !', ToastAndroid.LONG);
  };
  console.log(orderDataS, "orderData")
  const renderCartItem = ({ item, index }) => {
    return (
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.product.thumbnail }}
          style={styles.cartItemImage}
        />
        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemName}>{item.product.title}</Text>
          <Text style={styles.cartItemWeight}>{item.weight}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.cartItemPrice}>₹{item.product.price}</Text>
            <Text style={styles.originalPrice}>₹{(item.product.price * 1.2).toFixed(2)}</Text>
          </View>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, item.quantity === 1 && styles.disabledButton]}
              onPress={() => handleDecrement(item.product)}
              disabled={item.quantity === 1}
              activeOpacity={0.7}
            >
              <Icon name="remove" size={20} color={item.quantity === 1 ? colors.light : colors.dark} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleIncrement(item.product)}
              activeOpacity={0.7}
            >
              <Icon name="add" size={20} color={colors.dark} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleRemove(item.product)}
              activeOpacity={0.7}
            >
              <Icon name="delete" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: 80 }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
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
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart ({cartCount})</Text>
          {cartCount > 0 && (
            <TouchableOpacity
              onPress={clearCart}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {cartCount === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Image
              source={require('../assets/images/cart_blank.png')}
              style={styles.emptyCartImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtext}>Looks like you haven't added anything to your cart yet</Text>
            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.continueShoppingText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.itemsContainer}>
              {cartItems.map((item, index) => (
                <React.Fragment key={item.product.id}>
                  {renderCartItem({ item, index })}
                  {index < cartItems.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Bill Details</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Item Total</Text>
                <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Handling Charges</Text>
                <Text style={styles.summaryValue}>₹0.00</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taxes & Charges</Text>
                <Text style={styles.summaryValue}>₹0.00</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={[styles.summaryLabel, styles.totalLabel]}>Total Amount</Text>
                <Text style={[styles.summaryValue, styles.totalValue]}>₹{total.toFixed(2)}</Text>
              </View>
              <View style={styles.savingsRow}>
                <Text style={styles.savingsText}>You will save ₹{(subtotal * 0.2).toFixed(2)} on this order</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {cartCount > 0 && (
        <View style={styles.checkoutContainer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>₹{total.toFixed(2)}</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewBreakupText}>View price breakup</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            activeOpacity={0.8}
          >

            <Text style={styles.checkoutButtonText}>Order place</Text>

          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 15,
    // marginTop:20
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: colors.white,
    fontSize: 14,
  },
  itemsContainer: {
    backgroundColor: colors.white,
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 15,
    elevation: 1,
    overflow: 'hidden',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light,
    marginHorizontal: 15,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: colors.lightBg,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  cartItemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.dark,
  },
  cartItemWeight: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cartItemPrice: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: 'bold',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 13,
    color: colors.gray,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: 4,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  disabledButton: {
    borderColor: colors.lighter,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
    color: colors.dark,
  },
  deleteButton: {
    marginLeft: 'auto',
    padding: 5,
  },
  summaryCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.dark,
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  savingsRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.light,
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 13,
    color: colors.success,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.light,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  viewBreakupText: {
    fontSize: 12,
    color: colors.primary,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
  },
  checkoutButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.white,
    height: height * 0.7,
    // borderWidth: 2,
    // borderColor:"#000"
  },
  emptyCartImage: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 20,
    color: colors.dark,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  continueShoppingButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  continueShoppingText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CartScreen;