import { combineReducers } from 'redux';
import loginData from './loginData';
import refreshData from './refreshReducer';
import productReducer from './productReducer';
import productDetailReducer from './productDetailReducer';
import orderReducer from './orderReducer';


const reducers = combineReducers({
  loginData: loginData,
  refreshData,
  productList: productReducer,
  productDetails: productDetailReducer,
  orderData : orderReducer
});

export default reducers;
