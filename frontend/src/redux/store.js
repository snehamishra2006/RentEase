import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import applicationReducer from './slices/applicationSlice';
import rentalReducer from './slices/rentalSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import notificationReducer from './slices/notificationSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    applications: applicationReducer,
    rentals: rentalReducer,
    maintenance: maintenanceReducer,
    notifications: notificationReducer,
    ai: aiReducer,
  },
});
