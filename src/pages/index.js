import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentMealHistory } from "src/store/slices/StudentMealHistorySlice";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentMealHistory = () => {
  const dispatch = useDispatch();
  const { mealHistory, loading, error } = useSelector((state) => state.StudentMealHistory);

  const [universityId, setUniversityId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getMealData = (mealHistory) => {
    const mealCounts = {};
    const studentCounts = {};
    let totalMeals = 0;

    mealHistory.forEach(meal => {
      const mealName = meal.mealName;
      const studentId = meal.universityID;

      // Count meals
      mealCounts[mealName] = (mealCounts[mealName] || 0) + 1;
      totalMeals++;

      // Count unique students for each meal
      if (!studentCounts[mealName]) {
        studentCounts[mealName] = new Set();
      }
      studentCounts[mealName].add(studentId);
    });

    const labels = Object.keys(mealCounts);
    const data = labels.map(label => {
      const mealsConsumed = mealCounts[label] || 0;
      const uniqueStudents = studentCounts[label].size || 0;
      return {
        percentage: ((mealsConsumed / totalMeals) * 100).toFixed(2),
        total: mealsConsumed,
        students: uniqueStudents,
      };
    });

    return {
      labels,
      datasets: [{
        label: 'Meal Consumption Percentage',
        data: data.map(item => item.percentage),
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)']
          .slice(0, labels.length),
      }],
      totalMeals,
      mealData: data,
    };
  };

  const mealData = getMealData(mealHistory);
  const chartData = {
    labels: mealData.labels,
    datasets: mealData.datasets,
  };

  useEffect(() => {
    dispatch(fetchStudentMealHistory({ universityId, startDate, endDate }));
  }, [dispatch, universityId, startDate, endDate]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {mealHistory && mealHistory.length > 0 ? (
        <>
          <Bar data={chartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
          <h3>Total Meals: {mealData.totalMeals}</h3>
          <ul>
            {mealData.mealData.map((item, index) => (
              <li key={index}>
                {mealData.labels[index]}: {item.percentage}% of total meals (Total: {item.total}, Students: {item.students})
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No meal history available.</p>
      )}
    </div>
  );
};

export default StudentMealHistory;
