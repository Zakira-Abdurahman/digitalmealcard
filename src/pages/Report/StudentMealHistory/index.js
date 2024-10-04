import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentMealHistory } from "src/store/slices/StudentMealHistorySlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

const StudentMealHistory = () => {
  const dispatch = useDispatch();
  const { mealHistory, loading, error } = useSelector((state) => state.StudentMealHistory);

  const [universityId, setUniversityId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    dispatch(fetchStudentMealHistory({ universityId, startDate, endDate }));
  }, [dispatch, universityId, startDate, endDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchStudentMealHistory({ universityId, startDate, endDate }));
  };

  return (
    <div>
      <h1>Student Meal History</h1>
      
      {/* Filter form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: '1cm', marginBottom: '24px' }}>
        
        {/* University ID */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '4px' }}>University ID:</label>
          <InputText 
            value={universityId} 
            onChange={(e) => setUniversityId(e.target.value)} 
            style={{ width: '200px' }} 
          />
        </div>
        
        {/* Start Date */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '4px' }}>Start Date:</label>
          <Calendar 
            value={startDate} 
            onChange={(e) => setStartDate(e.value)} 
            style={{ width: '200px' }} 
          />
        </div>
        
        {/* End Date */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '4px' }}>End Date:</label>
          <Calendar 
            value={endDate} 
            onChange={(e) => setEndDate(e.value)} 
            style={{ width: '200px' }} 
          />
        </div>

        <Button type="submit" label="Fetch Report" style={{ height: '48px' }} />
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      {/* Display Meal History */}
      {mealHistory && mealHistory.length > 0 ? (
        <div>
          <h2>Meal History</h2>
          <DataTable value={mealHistory}>
            <Column field="fullName" header="Full Name" />
            <Column field="universityID" header="University ID" />
            <Column field="transactionID" header="Transaction ID" />
            <Column field="mealName" header="Meal Name" />
            <Column field="transactionTime" header="Transaction Time" />
            <Column field="mealStatus" header="Meal Status" />
            <Column field="paymentAmount" header="Payment Amount" />
            <Column field="paymentStatus" header="Payment Status" />
          </DataTable>
        </div>
      ) : (
        <p>No meal history available.</p>
      )}
    </div>
  );
};

export default StudentMealHistory;
