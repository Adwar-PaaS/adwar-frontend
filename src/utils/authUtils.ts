import { toast } from 'react-toastify';

export const handleSessionExpired = () => {
  toast.error('Your session has expired. Please login again.');
  
  // Redirect to login
  window.location.href = '/login';
};

export const handleUnauthorized = () => {
  toast.error('You are not authorized to access this resource.');
  
  // Redirect to login
  window.location.href = '/login';
};
