// 'use client'
// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// const RegisterPage = () => {
//   const router = useRouter();
//   const { storefrontId } = router.query;

//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await axios.post('/api/charities/register', {
//         storefrontId,
//         password,
//       });
//       alert(response.data.message); // Display success message
//       router.push('/login'); // Redirect to login page
//     } catch (err) {
//       setError('Registration failed. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 border rounded-md">
//       <h2 className="text-2xl font-semibold mb-4">
//         Complete Your Registration
//       </h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="password" className="block text-sm">
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             required
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="confirmPassword" className="block text-sm">
//             Confirm Password
//           </label>
//           <input
//             type="password"
//             id="confirmPassword"
//             value={confirmPassword}
//             onChange={e => setConfirmPassword(e.target.value)}
//             required
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? 'Submitting...' : 'Register'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegisterPage;
import React from 'react'

const CharityRegistrationPage = () => {
  return (
    <div>
      
    </div>
  )
}

export default CharityRegistrationPage
