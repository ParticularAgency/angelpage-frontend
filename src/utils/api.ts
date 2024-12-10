import axios from 'axios';

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
export const verifyEmail = async ({
  email,
  verificationCode,
}: {
  email: string;
  verificationCode: string;
}) => {
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
}: {
  email: string;
  verificationCode: string;
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
export const fetchUserProfileData = async (email: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/profile/${email}`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile data:', error);
    return null;
  }
};

export const fetchCharityProfileData = async (email: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/charity-profile/${email}`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile data:', error);
    return null;
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
export const saveProfile = async (profileData: FormData, token: string) => {
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
export const fetchUserData = async (token: string) => {
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
export const saveCharityProfile = async (profileData: FormData, token: string) => {
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
export const fetchCharityData = async (token: string) => {
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
export const saveAdminInfo = async (profileData: FormData, token: string) => {
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
export const fetchAdminInfo = async (token: string) => {
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
 * Fetches admin data.
 * @param {string} token - The JWT token for authorization.
 * @returns {Object} The admin dashboard data.
 */
export const fetchAdminData = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error;
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
export const requestPasswordReset = async (email: string, role: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/request-password-reset`, {
      email,
      role,  // Pass the role along with the email
    });
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
export const resetPassword = async (token: string, newPassword: string) => {
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
export const deleteAccount = async (userId: string, role: string, token: string) => {
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
