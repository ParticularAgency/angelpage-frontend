'use client';
import { Button } from '@/components/elements';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const CharityApproval = () => {
  const { data: session, status } = useSession() || {};
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 useEffect(() => {
   // Fetch charities from the backend
   const fetchCharities = async () => {
     try {
       const response = await axios.get(
         `${process.env.NEXT_PUBLIC_API_URL}/admin/charities/pending-approval`,
         {
           headers: {
             Authorization: `Bearer ${session?.token}`,
           },
         }
       );
       setCharities(response.data);
     } catch (err) {
       setError('Error fetching charities.');
     } finally {
       setLoading(false);
     }
   };

   fetchCharities();
 }, [session, status]);

  // Approve the release of funds for the selected charity
  const handleApproveFundsRelease = async (charityId) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/funds/release/${charityId}`,
        {}, // No data is needed for this request
        {
          headers: {
            Authorization: `Bearer ${session?.token}`, // Pass the session token for authorization
          },
        }
      );

      if (response.status === 200) {
        // If approval is successful, remove the approved charity from the list
        setCharities(prevCharities =>
          prevCharities.filter(charity => charity._id !== charityId)
        );
      } else {
        setError('Failed to approve fund release.');
      }
    } catch (error) {
      setError('Error approving fund release.');
      console.error('Error approving fund release:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="charity-approval">
      <h2>Charities Pending Approval</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {charities.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Charity Name</th>
              <th>Total Held Funds</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {charities.map(charity => (
              <tr key={charity._id}>
                <td>{charity.charityName}</td>
                <td>£{charity.totalHeldFunds.toFixed(2)}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleApproveFundsRelease(charity._id)}
                  >
                    Approve Funds
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No charities pending approval.</p>
      )}
    </div>
  );
};

export default CharityApproval;
