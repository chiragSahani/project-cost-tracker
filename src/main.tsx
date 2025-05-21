import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';
import theme from './theme';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);