import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginData } from '../redux/actions';

const ProfileScreen = ({ navigation }) => {
  const login = useSelector((state) => state.rootReducer.loginData.arr);
  console.log(login);
  const dispatch = useDispatch()
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      dispatch(loginData({}))
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{uri:login.image}}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{login.username}</Text>
        <Text style={styles.profileEmail}>{login.email}</Text>
      </View>

      <View style={[globalStyles.card, styles.menuCard]}>
        <TouchableOpacity style={styles.menuItem} >
          <View style={styles.menuIcon}>
            <Icon name="person" size={24} color={colors.primary} />
          </View>
          <Text style={styles.menuText}>Personal Information</Text>
          <Icon name="chevron-right" size={24} color={colors.dark} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} >
          <View style={styles.menuIcon}>
            <Icon name="location-on" size={24} color={colors.primary} />
          </View>
          <Text style={styles.menuText}>Delivery Addresses</Text>
          <Icon name="chevron-right" size={24} color={colors.dark} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Icon name="payment" size={24} color={colors.primary} />
          </View>
          <Text style={styles.menuText}>Payment Methods</Text>
          <Icon name="chevron-right" size={24} color={colors.dark} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Icon name="favorite-border" size={24} color={colors.primary} />
          </View>
          <Text style={styles.menuText}>Favorites</Text>
          <Icon name="chevron-right" size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      <View style={[globalStyles.card, styles.menuCard]} >
        <TouchableOpacity style={styles.menuItem} >
          <View style={styles.menuIcon}>
            <Icon name="settings" size={24} color={colors.primary} />
          </View>
          <Text style={styles.menuText}>Settings</Text>
          <Icon name="chevron-right" size={24} color={colors.dark} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} >
          <View style={styles.menuIcon}>
            <Icon name="help-outline" size={24} color={colors.primary} />
          </View>
          <Text style={styles.menuText}>Help Center</Text>
          <Icon name="chevron-right" size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.dark,
  },
  menuCard: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: colors.light,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  logoutButtonText: {
    color: colors.danger,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;