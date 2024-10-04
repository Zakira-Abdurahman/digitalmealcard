import axios from "axios";

const getStudentMealHistory = async ({ universityId, startDate, endDate }) => {
  try {
    const response = await axios.get("https://localhost:7137/api/StudentMealHistory", {
      params: {
        universityId,
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : "An error occurred while fetching meal history.");
  }
};

export default {
  getStudentMealHistory,
};