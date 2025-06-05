
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InvestmentChart = ({ investments }) => {
  const chartData = investments.map(investment => ({
    symbol: investment.symbol,
    purchaseValue: investment.shares * investment.purchasePrice,
    currentValue: investment.shares * investment.currentPrice,
    gainLoss: (investment.shares * investment.currentPrice) - (investment.shares * investment.purchasePrice)
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No investment data to display</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="symbol" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="purchaseValue" fill="#8884d8" name="Purchase Value" />
          <Bar dataKey="currentValue" fill="#82ca9d" name="Current Value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentChart;
