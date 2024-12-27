import axios from 'axios';
// import { Product } from '@/types/productTypes';
// interface CharityUser {
//   charityName;
//   profileImage;
//   email;
//   verified: boolean;
//   profileCompleted: boolean;
//   charityBannerImage;
//   listedProducts: number;
// }

// interface ProfileResponse {
//   user: CharityUser | null; // Explicitly mark as nullable
//   profileCompletionPercentage?: number;
// }
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ===================
// Verification Email API Endpoint
// ===================

/**
 * Verifies the user's email with the provided verification code.
 * @param {string} email - The user's email address.
 * @param {string} verificationCode - The verification code sent to the user's email.
 * @returns {Object} - The response data from the verification request.
 */
export const verifyEmail = async ({email,verificationCode}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-email`, {
      email,
      verificationCode,
    });
    console.log('Email verification successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error verifying email:', error.response || error);
    throw error.response?.data || error;
  }
};
/**
 * Resends a new verification email to the user.
 * @param {string} email - The user's email address.
 * @returns {Object} - The response data from the resend request.
 */
export const resendVerificationEmail = async ({
  email,
  verificationCode,
}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/resend-verify-email`, {
      email,
      verificationCode,
    });
    console.log('Email verification successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error verifying email:', error.response || error);
    throw error.response?.data || error;
  }
};
export const fetchUserProfileData = async (
  email
) => {
  try { 
    const response = await axios.get(
      `${API_URL}/auth/profile/${email}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile data:', error);
    return null;
  }
};

export const fetchCharityProfileData = async (
  email
) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/profile/${email}`
    );
    console.log('charity profile data here:', response.data)

    return response.data;
  } catch (error) {
    console.error('Error fetching charity profile data:', error);
    return null; // Explicitly return null on failure
  }
};
// ===================
// User Data API Endpoints
// ===================

/**
 * Updates the user's profile data.
 * @param {FormData} profileData - The data to update the user's profile with.
 * @param {string} token - The JWT token for authorization.
 * @returns {Object} The response data from the profile update.
 */
export const saveProfile = async (profileData, token) => {
  try {
    const response = await axios.put(`${API_URL}/users/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Profile updated:', response.data);
    return response.data.user;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Fetch user profile data.
 * @param {string} token - The JWT token for authorization.
 * @returns {Object | null} - The user data or null if an error occurs.
 */
export const fetchUserData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('API Response:', response.data);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
// ===================
// Charity Data API Endpoints
// ===================
/**
 * Updates the user's profile data.
 * @param {FormData} profileData - The data to update the user's profile with.
 * @param {string} token - The JWT token for authorization.
 * @returns {Object} The response data from the profile update.
 */
export const saveCharityProfile = async (
  profileData,
  token
) => {
  try {
    const response = await axios.put(
      `${API_URL}/charity/profile`,
      profileData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Profile updated:', response.data);
    return response.data.user;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
/**
 * Fetch charity profile data.
 * @param {string} token - The JWT token for authorization.
 * @returns {Object | null} - The user data or null if an error occurs.
 */
export const fetchCharityData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/charity/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('API Response:', response.data);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

/**
 * Updates the user's profile data.
 * @param {FormData} profileData - The data to update the user's profile with.
 * @param {string} token - The JWT token for authorization.
 * @returns {Object} The response data from the profile update.
 */
export const saveAdminInfo = async (profileData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/charity/adminInfo`,
      profileData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Profile updated:', response.data);
    return response.data.user;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
/**
 * Fetch charity profile data.
 * @param {string} token - The JWT token for authorization.
 * @returns {Object | null} - The user data or null if an error occurs.
 */
export const fetchAdminInfo = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/charity/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('API Response:', response.data);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};


// ===================
// Password Reset & Account Deletion API Endpoints
// ===================

/**
 * Requests a password reset.
 * @param {string} email - The user's email to send the reset token to.
 * @param {string} role - The user's role to specify (e.g., "USER", "CHARITY", "ADMIN").
 * @returns {Object} - The response data from the password reset request.
 */
export const requestPasswordReset = async (email, role) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/request-password-reset`,
      {
        email,
        role, // Pass the role along with the email
      }
    );
    console.log('Password reset email sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error.response || error);
    throw error;
  }
};

/**
 * Resets the user's password.
 * @param {string} token - The reset token sent to the user's email.
 * @param {string} newPassword - The new password for the user.
 * @returns {Object} - The response data from the password reset.
 * @throws Will throw an error if the request fails.
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error.response?.data || error;
  }
};

/**
 * Deletes the user's account.
 * @param {string} userId - The ID of the user to delete.
 * @param {string} role - The role of the user (e.g., USER, CHARITY, ADMIN).
 * @param {string} token - The JWT token for authorization.
 * @returns {Object} - The response data from the account deletion.
 */
export const deleteAccount = async (
  userId,
  role,
  token
) => {
  try {
    const response = await axios.delete(`${API_URL}/auth/delete-account`, {
      data: { userId, role },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

export const fetchProductsByCategory = async (
  category,
  authToken,
  isArchived,
  status
) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products/category/${category}`,
      {
        params: { isArchived, status },
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch category products.'
    );
  }
};


// admin endpoit handler

/**
 * Fetch user profile data.
 * @param {string} token - The JWT token for authorization.
 * @returns {Object | null} - The user data or null if an error occurs.
 */
export const fetchAdminData = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('API Response:', response.data);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export const fetchLiveProducts = async (token) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/products/listings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch live products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching live products:', error);
    return null;
  }
};


