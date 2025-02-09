'use client';
import React from 'react';

// interface BusinessOverviewData {
//   revenue: number; // Total revenue
//   revenueChange: number; // Percentage change in revenue
//   itemsSold: number; // Total items sold
//   itemsSoldChange: number; // Percentage change in items sold
//   itemsBought: number; // Total items bought
//   itemsBoughtChange: number; // Percentage change in items bought
//   moneySpent: number; // Total money spent
//   moneySpentChange: number; // Percentage change in money spent
// }

// interface BusinessOverviewProps {
//   data: BusinessOverviewData; // Use the defined type for data
// }

const BusinessOverview = ({ data, loading }) => {

  // Calculate revenue, items sold, and money spent increases
  const revenueIncrease = (data.revenue * (data.revenueChange / 100)).toFixed(
    2
  );
  const itemsSoldIncrease = Math.round(
    data.itemsSold * (data.itemsSoldChange / 100)
  );
  const itemsBoughtIncrease = Math.round(
    data.itemsBought * (data.itemsBoughtChange / 100)
  );
  const moneySpentIncrease = (
    data.moneySpent *
    (data.moneySpentChange / 100)
  ).toFixed(2);
const formattedMoneySpend = data.moneySpentChange.toFixed(2);
const formattedItemSold = data.itemsSoldChange.toFixed(2);
const formattedItemBought = data.itemsBoughtChange.toFixed(2);
  return (
    <div className="grid grid-cols-12 sm:grid-cols-6 gap-6 business-overview-area pb-[45px]">
      {loading ? (
        <>
          <div className="col-span-3 sm:col-span-full md:col-span-6">
            <h4 className="body-bold-small">Revenue</h4>
            <p className="body-bold-large sm:body-bold-medium flex items-center gap-2 skeleton w-[180px] h-2 bg-mono-40"></p>
            <p className="body-bold-small flex items-center gap-3 mt-2">
              <span className=" skeleton w-[35px] h-2 bg-mono-40"></span>
              <span className="text-[#8A888C]">in the past week</span>
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Revenue */}
          <div className="col-span-3 sm:col-span-full md:col-span-6">
            <h4 className="body-bold-small">Revenue</h4>
            <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
              £{data.revenue.toFixed()}
              <span
                className={`px-2 py-[2px] forms-bold ${
                  data.revenueChange >= 0
                    ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]'
                    : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'
                } rounded-full`}
              >
                {data.revenueChange >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(data.revenueChange)}%
              </span>
            </p>
            <p className="body-bold-small mt-2">
              £{revenueIncrease}{' '}
              <span className="text-[#8A888C]">in the past week</span>
            </p>
          </div>
        </>
      )}
      {loading ? (
        <>
          <div className="col-span-3 sm:col-span-full md:col-span-6">
            <h4 className="body-bold-small">No. of Items Sold</h4>
            <p className="body-bold-large sm:body-bold-medium flex items-center gap-2 skeleton w-[180px] h-2 bg-mono-40"></p>
            <p className="body-bold-small flex items-center gap-3 mt-2">
              <span className=" skeleton w-[35px] h-2 bg-mono-40"></span>
              <span className="text-[#8A888C]">in the past week</span>
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Number of Items Sold */}
          <div className="col-span-3 sm:col-span-full md:col-span-6">
            <h4 className="body-bold-small">No. of Items Sold</h4>
            <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
              {data.itemsSold}
              <span
                className={`px-2 py-[2px] forms-bold ${
                  data.itemsSoldChange >= 0
                    ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]'
                    : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'
                } rounded-full`}
              >
                {data.itemsSoldChange >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(formattedItemSold)}%
              </span>
            </p>
            <p className="body-bold-small mt-2">
              {itemsSoldIncrease}{' '}
              <span className="text-[#8A888C]">in the past week</span>
            </p>
          </div>
        </>
      )}
      {loading ? (
        <>
          <div className="col-span-3 sm:col-span-full md:col-span-6">
            <h4 className="body-bold-small">No. of Items Bought</h4>
            <p className="body-bold-large sm:body-bold-medium flex items-center gap-2 skeleton w-[180px] h-2 bg-mono-40"></p>
            <p className="body-bold-small flex items-center gap-3 mt-2">
              <span className=" skeleton w-[35px] h-2 bg-mono-40"></span>
              <span className="text-[#8A888C]">in the past week</span>
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Number of Items Bought */}
          <div className="col-span-3 sm:col-span-full md:col-span-6">
            <h4 className="body-bold-small">No. of Items Bought</h4>
            <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
              {data.itemsBought}
              <span
                className={`px-2 py-[2px] forms-bold ${
                  data.itemsBoughtChange >= 0
                    ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]'
                    : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'
                } rounded-full`}
              >
                {data.itemsBoughtChange >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(formattedItemBought)}%
              </span>
            </p>
            <p className="body-bold-small mt-2">
              {itemsBoughtIncrease}{' '}
              <span className="text-[#8A888C]">in the past week</span>
            </p>
          </div>
        </>
      )}
      {loading ? (
        <>
          <div className="col-span-3 sm:col-span-full md:col-span-6">
            <h4 className="body-bold-small">Money Spent</h4>
            <p className="body-bold-large sm:body-bold-medium flex items-center gap-2 skeleton w-[180px] h-2 bg-mono-40"></p>
            <p className="body-bold-small flex items-center gap-3 mt-2">
              <span className=" skeleton w-[35px] h-2 bg-mono-40"></span>
              <span className="text-[#8A888C]">in the past week</span>
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Money Spent */}
          <div className="col-span-3 sm:col-span-full md:col-span-6">
            <h4 className="body-bold-small">Money Spent</h4>
            <p className="body-bold-large sm:body-bold-medium flex items-center gap-2">
              £{data.moneySpent.toFixed(2)}
              <span
                className={`px-2 py-[2px] forms-bold ${
                  data.moneySpentChange >= 0
                    ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]'
                    : 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'
                } rounded-full`}
              >
                {data.moneySpentChange >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(formattedMoneySpend)}%
              </span>
            </p>
            <p className="body-bold-small mt-2">
              £{moneySpentIncrease}{' '}
              <span className="text-[#8A888C]">in the past week</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessOverview;
