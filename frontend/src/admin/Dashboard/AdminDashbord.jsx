import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import { Pie } from "react-chartjs-2";
import "./dashboard.css";

// Import Chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashbord = ({ user }) => {
  const navigate = useNavigate();

  // Redirect non-admin users
  if (user && user.role !== "admin") return navigate("/");

  const [stats, setStats] = useState([]);

  // Fetch the stats from the server
  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setStats(data.stats); // Set stats from the API response
    } catch (error) {
      console.log(error);
    }
  }

  // Use useEffect to call the fetchStats function on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Prepare data for the pie chart
  const pieChartData = {
    labels: ["Total Courses", "Total Lectures", "Total Users"],
    datasets: [
      {
        data: [
          stats.totalCourses || stats.totalCoures || 0, // Handle possible typo in API response
          stats.totalLectures || 0,
          stats.totalUsers || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div>
      <Layout>
        <div className="main-content">
          <h2>Stats</h2>

          {/* Render stats as text */}
          <div className="box">
            <p>Total Courses: {stats.totalCourses || stats.totalCoures}</p>
            <p>Total Lectures: {stats.totalLectures}</p>
            <p>Total Users: {stats.totalUsers}</p>
          </div>

          {/* Render Pie Chart */}
          <div style={{ width: "400px", margin: "0 auto" }}>
            <Pie data={pieChartData} />
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AdminDashbord;
