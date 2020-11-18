import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "chart.js";
import "./Graph.css";

function Graph() {
  const [state, setState] = useState({});
  const [filterDate, setFilterDate] = useState({
    startDate: "2020-10-18",
    endDate: "2020-11-18",
    currency: "USD",
  });

  function handleChange(event) {
    setFilterDate({
      ...filterDate,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  useEffect(() => {
    async function getApi() {
      try {
        const response = await axios.get(
          `https://api.coindesk.com/v1/bpi/historical/close.json?start=${filterDate.startDate}&end=${filterDate.endDate}&currency=${filterDate.currency}
          `
        );
        setState({ ...response.data.bpi });
      } catch (err) {
        console.error(err);
      }
    }

    getApi();
  }, [filterDate]);

  useEffect(() => {
    renderGraph();
  }, [state]);

  function renderGraph() {
    let ctx = document.getElementById("myChart");
    let myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Object.keys(state),
        datasets: [
          {
            label: "Bitcoin Price Index",
            data: Object.values(state),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  return (
    <div className="main">
      <h1>Financial Data Graphing</h1>
      <div className="navbar">
        <div className="filters">
          <h2>Filters</h2>
          <div>
            <label className="label">From:</label>
            <input
              type="date"
              name="startDate"
              onChange={handleChange}
              value={filterDate.startDate}
            ></input>
            <label className="label">To:</label>
            <input
              type="date"
              name="endDate"
              onChange={handleChange}
              value={filterDate.endDate}
            ></input>
          </div>
          <div className="currency">
            <label className="label">Currency:</label>
            <select name="currency" onChange={handleChange}>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">Pound (£)</option>
            </select>
          </div>
        </div>

        <div className="values">
          <h2>Values</h2>
          <p>
            <strong>Max:</strong> {Math.max(...Object.values(state))}{" "}
            {filterDate.currency}
          </p>
          <p>
            <strong>Min:</strong> {Math.min(...Object.values(state))}{" "}
            {filterDate.currency}
          </p>
        </div>
      </div>
      <canvas id="myChart" style={{ width: "300px" }}></canvas>
    </div>
  );
}

export default Graph;
