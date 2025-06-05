
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ExpenseChart = ({ transactions }) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  
  const categoryData = expenses.reduce((acc, transaction) => {
    const existing = acc.find(item => item.category === transaction.category);
    if (existing) {
      existing.amount += transaction.amount;
    } else {
      acc.push({ category: transaction.category, amount: transaction.amount });
    }
    return acc;
  }, []);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'];

  if (categoryData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No expense data to display</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="amount"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
