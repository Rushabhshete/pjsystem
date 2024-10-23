// apiService.js

export const getInstituteCode = () => localStorage.getItem("institutecode");

export const fetchIncomeData = async () => {
  try {
    const response = await fetch(
      `http://localhost:8087/dashboard/incomes/totals?institutecode=${getInstituteCode()}`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching income data:", error);
    throw error;
  }
};

export const fetchExpenseData = async () => {
  try {
    const response = await fetch(
      `http://localhost:8087/dashboard/expenses/totals?institutecode=${getInstituteCode()}`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching expense data:", error);
    throw error;
  }
};

export const fetchSavingsData = async () => {
  try {
    const response = await fetch(
      `http://localhost:8087/dashboard/savings?institutecode=${getInstituteCode()}`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching savings data:", error);
    throw error;
  }
};

export const fetchMonthlyIncome = async (year) => {
  try {
    const response = await fetch(
      `http://localhost:8087/income/total-monthly?year=${year}&institutecode=${getInstituteCode()}`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching monthly income data:", error);
    throw error;
  }
};

export const fetchMonthlyExpense = async (year) => {
  try {
    const response = await fetch(
      `http://localhost:8087/expense/total-monthly?year=${year}&institutecode=${getInstituteCode()}`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching monthly expense data:", error);
    throw error;
  }
};

export const fetchCategories = async (year, month) => {
  try {
    const [incomeResponse, expenseResponse] = await Promise.all([
      fetch(
        `http://localhost:8087/dashboard/totalIncomeByCategory?year=${year}&month=${month}&institutecode=${getInstituteCode()}`
      ),
      fetch(
        `http://localhost:8087/dashboard/totalExpenseByCategory?year=${year}&month=${month}&institutecode=${getInstituteCode()}`
      ),
    ]);
    const incomeData = await incomeResponse.json();
    const expenseData = await expenseResponse.json();
    return { incomeData, expenseData };
  } catch (error) {
    console.error("Error fetching categories data:", error);
    throw error;
  }
};
