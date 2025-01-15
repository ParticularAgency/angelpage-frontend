import React, { useState } from 'react';
import axios from 'axios';

const ConfirmPackageInfo = ({ orderId }) => {
  const [weightKg, setWeightKg] = useState(0);
  const [weightG, setWeightG] = useState(0);
  const [dimensions, setDimensions] = useState({
    length: 0,
    width: 0,
    height: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Convert weight from kg to ounces
  const convertWeightToOunces = (kg, g) => {
    return kg * 35.274 + g * 0.035274; // Convert kg and g to ounces
  };

  // Convert dimensions from cm to inches
  const convertDimensionsToInches = dimensions => {
    return {
      length: dimensions.length * 0.393701,
      width: dimensions.width * 0.393701,
      height: dimensions.height * 0.393701,
    }; // cm to inches conversion
  };

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);

      // Convert weight and dimensions to the required units
      const weightInOunces = convertWeightToOunces(weightKg, weightG);
      const dimensionsInInches = convertDimensionsToInches(dimensions);

      // Send the data to the backend
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/updatePackageInfoAndConfirmPayment`,
        {
          orderId,
          weight: weightInOunces, // send the converted weight
          weightUnit: 'ounces', // now the weight unit is ounces
          dimensions: dimensionsInInches, // send the converted dimensions
          dimensionUnit: 'inches', // now the dimension unit is inches
        }
      );

      alert('Package info updated and payment confirmed!');
    } catch (err) {
      setError('Failed to confirm package details and payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Confirm Package Info</h3>
      <div>
        <label>Weight (kg)</label>
        <input
          type="number"
          value={weightKg}
          onChange={e => setWeightKg(e.target.value)}
          placeholder="Weight in kg"
        />
        <label>Weight (g)</label>
        <input
          type="number"
          value={weightG}
          onChange={e => setWeightG(e.target.value)}
          placeholder="Weight in grams"
        />
      </div>

      <div>
        <label>Dimensions (cm)</label>
        <input
          type="number"
          value={dimensions.length}
          onChange={e =>
            setDimensions({ ...dimensions, length: e.target.value })
          }
          placeholder="Length in cm"
        />
        <input
          type="number"
          value={dimensions.width}
          onChange={e =>
            setDimensions({ ...dimensions, width: e.target.value })
          }
          placeholder="Width in cm"
        />
        <input
          type="number"
          value={dimensions.height}
          onChange={e =>
            setDimensions({ ...dimensions, height: e.target.value })
          }
          placeholder="Height in cm"
        />
      </div>

      {error && <div>{error}</div>}

      <button onClick={handleConfirmOrder} disabled={loading}>
        {loading ? 'Processing...' : 'Confirm Order'}
      </button>
    </div>
  );
};

export default ConfirmPackageInfo;
