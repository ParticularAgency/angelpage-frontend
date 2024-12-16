import axios from 'axios';

// Define AxiosError manually if not found in 'axios'
interface AxiosError<T = unknown> extends Error {
  isAxiosError: boolean;
  response?: {
    data?: T;
    status?: number;
    statusText?: string;
  };
  request?: unknown;
  config: unknown;
}

// Helper to check if an error is an AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}


// Define types
interface CharityUser {
  charityName: string;
  profileImage: string;
  userName: string;
  email: string;
  verified: boolean;
  profileCompleted: boolean;
  charityBannerImage: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  userName: string;
  profileImage: string;
  email: string;
  verified: boolean;
  profileCompleted: boolean;
  dateBirth: string;
}

interface ProfileResponse {
  user: CharityUser;
  profileCompletionPercentage: number;
}

interface UserProfileResponse {
  user: UserProfile | null;
  profileCompletionPercentage?: number;
}



interface Product {
  id: string;
  name: string;
  images: { url: string }[];
  brand: string;
  price: number;
  size: string;
  status: string;
  averageDeliveryTime?: number;
}

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ===================
// Verification Email API Endpoints
// ===================
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
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'Error verifying email:',
        error.response?.data || error.message
      );
      throw error.response?.data || error;
    }
    throw error;
  }
};

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
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'Error resending verification email:',
        error.response?.data || error.message
      );
      throw error.response?.data || error;
    }
    throw error;
  }
};

// ===================
// Profile Data API Endpoints
// ===================
export const fetchUserProfileData = async (
  email: string
): Promise<UserProfileResponse | null> => {
  try {
    const response = await axios.get<UserProfileResponse>(
      `${API_URL}/auth/profile/${email}`
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'Error fetching user profile data:',
        error.response?.data || error.message
      );
    }
    return null;
  }
};

export const fetchCharityProfileData = async (
  email: string
): Promise<ProfileResponse> => {
  try {
    const response = await axios.get<ProfileResponse>(
      `${API_URL}/charity/profile`,
      {
        params: { email },
      }
    );

    if (!response.data.user) {
      throw new Error('Invalid response: User data is missing');
    }

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'Error fetching charity profile data:',
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

// ===================
// User Data API Endpoints
// ===================
// export const saveProfile = async (profileData: FormData, token: string) => {
//   try {
//     const response = await axios.put(`${API_URL}/users/profile`, profileData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data.user;
//   } catch (error) {
//     if (isAxiosError(error)) {
//       console.error(
//         'Error updating profile:',
//         error.response?.data || error.message
//       );
//     }
//     throw error;
//   }
// };

export const fetchUserData = async (
  token: string
): Promise<UserProfile | null> => {
  try {
    const response = await axios.get<{ user: UserProfile }>(
      `${API_URL}/users/profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.user;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'Error fetching user data:',
        error.response?.data || error.message
      );
    }
    return null;
  }
};

// ===================
// Charity Data API Endpoints
// ===================
// export const saveCharityProfile = async (
//   profileData: FormData,
//   token: string
// ) => {
//   try {
//     const response = await axios.put(
//       `${API_URL}/charity/profile`,
//       profileData,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return response.data.user;
//   } catch (error) {
//     if (isAxiosError(error)) {
//       console.error(
//         'Error updating charity profile:',
//         error.response?.data || error.message
//       );
//     }
//     throw error;
//   }
// };

export const fetchCharityData = async (
  token: string
): Promise<CharityUser | null> => {
  try {
    const response = await axios.get<{ user: CharityUser }>(
      `${API_URL}/charity/profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.user;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'Error fetching charity data:',
        error.response?.data || error.message
      );
    }
    return null;
  }
};

// ===================
// Admin Data API Endpoints
// ===================
export const fetchAdminData = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'Error fetching admin data:',
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

// ===================
// Password Reset & Account Deletion API Endpoints
// ===================
export const requestPasswordReset = async (email: string, role: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/request-password-reset`,
      {
        email,
        role,
      }
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'Error requesting password reset:',
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'Error resetting password:',
        error.response?.data || error.message
      );
    }
    throw error;
  }
};



// ===================
// Product Data API Endpoints
// ===================
export const fetchProductsByCategory = async (
  category: string,
  authToken: string,
  isArchived: boolean = false,
  status?: string
): Promise<Product[]> => {
  try {
    const response = await axios.get<{ products: Product[] }>(
      `${API_URL}/products/category/${category}`,
      {
        params: { isArchived, status },
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return response.data.products;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'Error fetching products by category:',
        error.response?.data || error.message
      );
    }
    throw new Error('Failed to fetch category products.');
  }
};
