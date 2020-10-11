import React, { useState, useCallback, useEffect } from "react";
import {
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
  VictoryZoomContainer,
  VictoryLine,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryTooltip,
  VictoryLabel,
} from "victory";
import { manualReadingBoolToString } from "../common/utils";

const processData = (data) => {
  return data.map((row) => ({
    time: new Date(row.readingTime),
    level: row.waterLevel,
    id: row.readingId,
    label: [
      `ID: ${row.readingId}`,
      `Timestamp: ${new Date(row.readingTime).toString()}`,
      `Nivel de agua: ${row.waterLevel}`,
      `Tipo: ${manualReadingBoolToString(row.manualReading)}`,
    ],
  }));
};

const initializeChartState = (data) => {
  const procData = processData(data);
  if (procData.length < 2) {
    let today = new Date();
    let yesterday = today - 1000 * 60 * 60 * 24 * 2;
    yesterday = new Date(yesterday);
    return {
      data: { data: procData },
      zoomDomain: {
        x: [yesterday, today],
      },
    };
  }
  const leftZoom = procData.length > 10 ? 10 : procData.length - 1;
  return {
    data: { data: procData },
    zoomDomain: {
      x: [procData[leftZoom].time, procData[0].time], // dos valores iguales cuando hay una sola medicion
    },
  };
};

const Chart = (props) => {
  const { data } = props;
  const [chartState, setChartState] = useState(initializeChartState(data));

  const handleZoom = useCallback(
    (domain) => setChartState({ ...chartState, zoomDomain: domain }),
    [chartState]
  );

  useEffect(() => {
    console.log("Processing data...", data);
    setChartState((prevChartState) => {
      return { ...prevChartState, data: { data: processData(data) } };
    });
  }, [data]);

  return (
    <div>
      <VictoryChart
        theme={VictoryTheme.material}
        width={920}
        height={300}
        padding={{ top: 50, bottom: 50, left: 80, right: 50 }}
        scale={{ x: "time" }}
	domain={{y: [ Math.min.apply(Math, chartState.data.data.map(function(o) { return o.level; })) - 1, Math.max.apply(Math, chartState.data.data.map(function(o) { return o.level; })) + 1]}}
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
            tickLabels: { fill: "black" },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Nivel de agua (cm)"
          //offsetX={80}
          tickFormat={(t) => `${Math.round(t * 100) / 100}`}
          axisLabelComponent={<VictoryLabel dy={-25} />}
          style={{
            ticks: { stroke: "black" },
            axis: { stroke: "black", strokeWidth: 1 },
            axisLabel: { fill: "black", padding: 40 },
            tickLabels: { fill: "black" },
          }}
        />
        <VictoryLine
          theme={VictoryTheme.material}
          data={chartState.data.data}
          labelComponent={<VictoryTooltip active={false} />}
          x="time"
          y="level"
          style={{
            data: { stroke: "#3f51b5", strokeWidth: 1 },
          }}
        />
        <VictoryScatter
          data={chartState.data.data}
          labelComponent={<VictoryTooltip />}
          x="time"
          y="level"
          size={3}
          style={{ data: { fill: "#3f51b5" } }}
        />
      </VictoryChart>
      <VictoryChart
        theme={VictoryTheme.material}
        padding={{ top: 0, left: 80, right: 50, bottom: 40 }}
        width={920}
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
            tickLabels: { fill: "black" },
          }}
        />
        <VictoryLine
          theme={VictoryTheme.material}
          data={chartState.data.data}
          labelComponent={<VictoryTooltip active={false} />}
          x="time"
          y="level"
          style={{
            data: { stroke: "#3f51b5", strokeWidth: 1 },
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default Chart;
