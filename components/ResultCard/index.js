import React from "react";
import styled from "styled-components";
import { Chart, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import theme from "../../utils/theme";
import Animated from "../Animated";

Chart.register(ArcElement);

function ResultCard({
  title,
  value,
  fullPoint,
  label,
  unit,
  style,
  useFailColor = false,
}) {
  if (!value) return null;

  let successColor;
  if (!fullPoint) successColor = theme.colors.darkGray;
  else if (value / fullPoint >= 0.7)
    successColor = theme.colors.doughnutColors.success;
  else if (value / fullPoint >= 0.4 || !useFailColor)
    successColor = theme.colors.doughnutColors.average;
  else successColor = theme.colors.doughnutColors.fail;

  const chartColors = [successColor, theme.colors.darkGray];
  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Doughnut Chart",
      },
    },
  };

  const data = {
    labels: ["Doğru", "Yanlış"],
    datasets: [
      {
        data: [value, fullPoint - value || 0],
        backgroundColor: chartColors,
        hoverBackgroundColor: chartColors,
      },
    ],
  };

  return (
    <AnimatedStyled style={style}>
      <div style={{ position: "relative" }}>
        <Doughnut data={data} options={options} />
        <Content className="center gMed">{label || value || 0}</Content>
        {unit && <Unit>{unit}</Unit>}
      </div>
      <Title className="gMed">{title}</Title>
    </AnimatedStyled>
  );
}

export const AnimatedStyled = styled(Animated)`
  width: 25%;
  height: 25%;
  min-width: 200px;
  max-width: 300px;
`;

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.deepDarkGray};
  font-size: 2vw;
  text-align: center;
  margin-top: 10px;
  @media only screen and (max-width: 720px) {
    font-size: 16px;
  }
  @media only screen and (min-width: 1360px) {
    font-size: 24px;
  }
`;

export const Unit = styled.div`
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 1.5vw;
  text-align: center;
  @media only screen and (max-width: 720px) {
    font-size: 14px;
  }
  @media only screen and (min-width: 1360px) {
    font-size: 18px;
  }
  position: absolute;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -50%);
`;

export const Content = styled.div`
  color: ${({ theme }) => theme.colors.charCoal};
  font-size: 3vw;
  padding-left: 100px;
  padding-right: 100px;
  padding-top: 50px;
  padding-bottom: 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  @media only screen and (max-width: 720px) {
    font-size: 20px;
  }
  @media only screen and (min-width: 1360px) {
    font-size: 36px;
  }
`;

export default ResultCard;
