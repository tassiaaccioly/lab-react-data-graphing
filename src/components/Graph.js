import React, { Component } from "react";
import axios from "axios";
import { Chart } from "chart.js";

class Graph extends Component {
  state = {
    stockPrices: [],
    stockDates: [],
    ctx: {},
  };

  async componentDidMount() {
    const response = await axios.get(
      "https://api.coindesk.com/v1/bpi/historical/close.json"
    );
    console.log(response);

    const { bpi } = response.data;

    const stockPrices = [];
    const stockDates = [];

    for (let key in bpi) {
      stockDates.push(key);
      stockPrices.push(bpi[key]);
    }

    this.setState({
      stockDates: [...stockDates],
      stockPrices: [...stockPrices],
      ctx: document.getElementById(this.props.id).getContext("2d"),
    });
  }

  componentDidUpdate() {
    const chart = new Chart(this.state.ctx, {
      type: "line",
      scaleOverride: true,
      scaleStartValue: 0,
      data: {
        labels: this.state.stockDates, //eixo X
        datasets: [
          {
            data: this.state.stockPrices, // Valores bitcoin
            label: "Bitcoin Price Index", // Legenda
            backgroundColor: "#498ee3", // Cor do preenchimento da linha
            borderColor: "#053a7a", // Cor da linha,
            yAxisID: "stockPrices",
          },
        ], // Configuraçāo de 1 linha do eixo Y. Pode ter várias linhas, cada uma configurada por 1 objeto diferente dentro da array
      },
      options: {
        scales: {
          yAxes: [{ id: "stockPrices", ticks: { min: 0 } }],
        },
      },
    });
  }

  render() {
    return <canvas id={this.props.id}></canvas>;
  }
}

export default Graph;
