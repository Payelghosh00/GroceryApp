import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../cart/CartContext';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../styles/globalStyles';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const DELIVERY_FEES = {
  express: 19,
  standard: 0
};

const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', icon: 'payment' },
  { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
  { id: 'wallet', name: 'Blinkit Wallet', icon: 'account-balance-wallet' },
  { id: 'cod', name: 'Cash on Delivery', icon: 'money' }
];

const CheckoutScreen = ({ navigation }) => {
  const { cartTotal, cartCount } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deliveryOption, setDeliveryOption] = useState('express');
const addressData1 = useSelector((state) => state.rootReducer.addressData.arr);
  const singleDefaultAddress = addressData1.find(address => address.is_default === true);
  // Memoize calculations to avoid unnecessary re-renders
  const { subtotal, deliveryFee, total, savings } = useMemo(() => {
    const subtotal = cartTotal();
    const deliveryFee = DELIVERY_FEES[deliveryOption] || 0;
    const total = subtotal + deliveryFee;
    const savings = subtotal * 0.2;
    return { subtotal, deliveryFee, total, savings };
  }, [cartTotal, deliveryOption]);

  const handlePlaceOrder = () => {
    // Add validation logic here if needed
    navigation.navigate('OrderConfirmation', {
      orderDetails: {
        total,
        paymentMethod,
        deliveryOption,
        deliveryFee
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
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

      {/* Header */}
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
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Delivery Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="location-on" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DeliveryAddresses')}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.addressType}>{singleDefaultAddress.tag}</Text>
            <Text style={styles.addressText}>{singleDefaultAddress.address_line1}</Text>
            <Text style={styles.addressText}>{singleDefaultAddress.address_line2 }, {singleDefaultAddress.city }- {singleDefaultAddress.postal_code}</Text>
            <Text style={styles.contactText}>Contact: +91 {singleDefaultAddress.contact_number}</Text>
          </View>
        </View>

        {/* Delivery Time */}
        {/* <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="access-time" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Delivery Slot</Text>
          </View>
          <View style={styles.timeOptions}>
            <TouchableOpacity
              style={[
                styles.timeOption, 
                deliveryOption === 'express' && styles.selectedOption
              ]}
              onPress={() => setDeliveryOption('express')}
            >
              <Icon 
                name="flash-on" 
                size={18} 
                color={deliveryOption === 'express' ? colors.primary : colors.dark} 
              />
              <Text style={styles.optionText}>10-15 mins</Text>
              {deliveryOption === 'express' && 
                <Icon name="check-circle" size={18} color={colors.primary} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeOption, 
                deliveryOption === 'standard' && styles.selectedOption
              ]}
              onPress={() => setDeliveryOption('standard')}
            >
              <Icon 
                name="schedule" 
                size={18} 
                color={deliveryOption === 'standard' ? colors.primary : colors.dark} 
              />
              <Text style={styles.optionText}>30-45 mins</Text>
              {deliveryOption === 'standard' && 
                <Icon name="check-circle" size={18} color={colors.primary} />}
            </TouchableOpacity>
          </View>
          <Text style={styles.deliveryFeeText}>Delivery fee: ₹{deliveryFee}</Text>
        </View> */}

        {/* Payment Methods */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="payment" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>

          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption, 
                paymentMethod === method.id && styles.selectedOption
              ]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <Icon 
                name={method.icon} 
                size={20} 
                color={paymentMethod === method.id ? colors.primary : colors.dark} 
              />
              <Text style={styles.optionText}>{method.name}</Text>
              {paymentMethod === method.id && 
                <Icon name="check-circle" size={20} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="receipt" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Order Summary</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Item Total ({cartCount} items)</Text>
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

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={[styles.summaryLabel, styles.totalLabel]}>Total Amount</Text>
            <Text style={[styles.summaryValue, styles.totalValue]}>₹{total.toFixed(2)}</Text>
          </View>

          <View style={styles.savingsRow}>
            <Text style={styles.savingsText}>
              You will save ₹{savings.toFixed(2)} on this order
            </Text>
          </View>
        </View>

        {/* Offers */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="local-offer" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Available Offers</Text>
          </View>
          <View style={styles.offerItem}>
            <Text style={styles.offerText}>
              10% OFF up to ₹100 | Use code BLINKIT
            </Text>
            <TouchableOpacity>
              <Text style={styles.applyText}>APPLY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Footer */}
      <View style={styles.checkoutFooter}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>₹{total.toFixed(2)}</Text>
          <TouchableOpacity>
            <Text style={styles.viewBreakupText}>View price breakup</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handlePlaceOrder}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollContainer: {
    paddingBottom: 100,
    paddingTop: 10,
  },
  statusBarGradient: {
    height: StatusBar.currentHeight,
  },
  headerGradient: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 10,
    textAlign: 'center',
  },
  headerRight: {
    width: 24, // To balance the back button
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginLeft: 10,
  },
  changeText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  addressContainer: {
    paddingLeft: 30,
  },
  addressType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 3,
  },
  contactText: {
    fontSize: 14,
    color: colors.dark,
    marginTop: 5,
  },
  timeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: 8,
    padding: 12,
    width: '48%',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: '#e8f8f0',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    marginLeft: 12,
    color: colors.dark,
  },
  deliveryFeeText: {
    fontSize: 14,
    color: colors.dark,
    textAlign: 'right',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  totalValue: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 15,
  },
  savingsRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.light,
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 13,
    color: colors.success,
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  offerText: {
    fontSize: 14,
    color: colors.dark,
    flex: 1,
  },
  applyText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  checkoutFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.light,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 5,
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
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CheckoutScreen;