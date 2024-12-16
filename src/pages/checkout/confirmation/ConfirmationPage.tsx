import React from 'react'
import ThankYouArea from './ThankYouArea';
import OrderSummary from './OrderSummary';

const ConfirmationPage = () => {
  return (
    <div className="order-confirmation-page-main-wrapper">
      <div className="custom-container max-w-[960px]">
        <div className="order-confirmation-grid-area">
          <div className="order-confirmation-grid-left-area">
            <ThankYouArea />
          </div>
          <div className="order-confirmation-grid-right-area">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage
