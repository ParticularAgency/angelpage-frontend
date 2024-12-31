'use client'
import { useSelector } from 'react-redux';

const DebugRedux = () => {
  const state = useSelector(state => state);
  console.log('Redux State:', state);
  return null;
};

export default DebugRedux;
