import React, { useState, useCallback } from "react";
import {
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
  VictoryZoomContainer,
  VictoryLine,
  VictoryBrushContainer,
  VictoryAxis
} from "victory";

const initializeChartState = data => {
  const procData = data.map(row => ({
    time: new Date(row.readingTime),
    level: row.waterLevel,
    id: row.readingId
  }));
  const leftZoom = procData.length > 10 ? 10 : procData.length - 1;
  return {
    data: { data: procData },
    zoomDomain: {
      x: [procData[leftZoom].time, procData[0].time]
    }
  };
};

const Chart = props => {
  const { data } = props;
  const [chartState, setChartState] = useState(initializeChartState(data));

  const handleZoom = useCallback(
    domain => setChartState({ ...chartState, zoomDomain: domain }),
    [chartState]
  );

  return (
    <div>
      <VictoryChart
        theme={VictoryTheme.material}
        width={1000}
        height={300}
        scale={{ x: "time" }}
        containerComponent={
          <VictoryZoomContainer
            zoomDimension="x"
            zoomDomain={chartState.zoomDomain}
            onZoomDomainChange={handleZoom}
          />
        }
      >
        <VictoryAxis
          style={{
            ticks: { stroke: "black" },
            axis: { stroke: "black", strokeWidth: 1 },
            tickLabels: { fill: "black" }
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Nivel de agua (cm)"
          style={{
            ticks: { stroke: "black" },
            axis: { stroke: "black", strokeWidth: 1 },
            axisLabel: { fill: "black", padding: 40 },
            tickLabels: { fill: "black" }
          }}
        />
        <VictoryLine
          theme={VictoryTheme.material}
          data={chartState.data.data}
          x="time"
          y="level"
          style={{
            data: { stroke: "#3f51b5", strokeWidth: 1 }
          }}
        />
        <VictoryScatter
          data={chartState.data.data}
          x="time"
          y="level"
          size={2}
          style={{ data: { fill: "#3f51b5" } }}
        />
      </VictoryChart>
      <VictoryChart
        theme={VictoryTheme.material}
        padding={{ top: 0, left: 50, right: 50, bottom: 40 }}
        width={1000}
        height={80}
        scale={{ x: "time" }}
        containerComponent={
          <VictoryBrushContainer
            theme={VictoryTheme.material}
            brushDimension="x"
            brushDomain={chartState.zoomDomain}
            onBrushDomainChange={handleZoom}
          />
        }
      >
        <VictoryAxis
          style={{
            ticks: { stroke: "black" },
            axis: { stroke: "black", strokeWidth: 1 },
            tickLabels: { fill: "black" }
          }}
        />
        <VictoryLine
          theme={VictoryTheme.material}
          data={chartState.data.data}
          x="time"
          y="level"
          style={{
            data: { stroke: "#3f51b5", strokeWidth: 1 }
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default Chart;
