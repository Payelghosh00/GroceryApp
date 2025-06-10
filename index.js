/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
import configureStore from './src/redux/store';
import { CartProvider } from './src/cart/CartContext';
export default function Main() {
    return (
        <CartProvider>
            <Provider store={configureStore}>
                 <PaperProvider theme={DefaultTheme}>
                    <App />
                </PaperProvider>
            </Provider>
        </CartProvider>
    );
}
AppRegistry.registerComponent(appName, () => Main);
