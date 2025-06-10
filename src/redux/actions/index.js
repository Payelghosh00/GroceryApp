export const refreshData = (user) => {
  return {
    type: 'SET_REFRESH',
    data: user,
  };
};

export const productList = (e) => {
  return {
    type: 'SET_PRODUCTS_LIST',
    data: e,
  };
}
export const productDetails = (e) => {
  return {
    type: 'SET_PRODUCTS_DETAIL',
    data: e,
  };
}
export const orderData = (e) => {
  return {
    type: 'SET_ORDERS',
    data: e,
  };
}

export * from './loginData';
