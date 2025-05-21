import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import itemsReducer from './itemsSlice';
import otherCostsReducer from './otherCostsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    otherCosts: otherCostsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;