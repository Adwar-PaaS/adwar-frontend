import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

/**
 * Redux Store Configuration
 * 
 * This file sets up the main Redux store for the application using Redux Toolkit.
 * The store manages global application state that can be accessed from any component.
 */

// Configure and create the Redux store
export const store = configureStore({
  reducer: {
    // Authentication state slice - handles user login, logout, and auth status
    auth: authReducer,
  },
  // Using default middleware (includes thunk for async operations)
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Type definitions for TypeScript support
// These types ensure type safety when using the store in components

// RootState type - represents the shape of the entire Redux state tree
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch type - represents the dispatch function type with all our thunks
export type AppDispatch = typeof store.dispatch;
