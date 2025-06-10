import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import rootReducer from './reducers/index';

const store = configureStore({
  reducer: {
    rootReducer: rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ immutableCheck: true }).concat(logger),
});

export default store;
