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
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
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
    symbol: row.manualReading ? "diamond" : "circle",
  }));
};

const getYAxisDomain = (data) => {
  return [
    Math.min.apply(
      Math,
      data.map(function(o) {
        return o.level;
      })
    ) - 1,
    Math.max.apply(
      Math,
      data.map(function(o) {
        return o.level;
      })
    ) + 1,
  ];
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
        y: getYAxisDomain(procData),
        x: [yesterday, today],
      },
    };
  }
  const leftZoom = procData.length > 10 ? 10 : procData.length - 1;
  return {
    data: { data: procData },
    zoomDomain: {
      y: getYAxisDomain(procData),
      x: [procData[leftZoom].time, procData[0].time], // dos valores iguales cuando hay una sola medicion
    },
  };
};

const Chart = (props) => {
  const { data, handleLoadMoreReadings, noMoreReadings } = props;
  const [chartState, setChartState] = useState(initializeChartState(data));

  const handleZoom = useCallback(
    (domain) => setChartState({ ...chartState, zoomDomain: domain }),
    [chartState]
  );

  console.log("DEBUG ZOOMDOMAIN", chartState.zoomDomain);

  useEffect(() => {
    console.log("Processing data...", data);
    setChartState((prevChartState) => {
      let procData = processData(data);
      let zoom = {
        x: prevChartState.zoomDomain.x,
        y: getYAxisDomain(procData),
      };
      return { zoomDomain: zoom, data: { data: procData } };
    });
  }, [data]);

  return (
    <div>
      <VictoryChart
        theme={VictoryTheme.material}
        width={920}
        height={300}
        padding={{ top: 50, bottom: 50, left: 80, right: 0 }}
        scale={{ x: "time" }}
        //domain={{ y: getYAxisDomain() }}
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
      <Box display="flex">
        <Box alignSelf="center">
          <IconButton
            aria-label="load-more-readings"
            style={{
              marginRight: "5px",
            }}
            onClick={handleLoadMoreReadings}
            disabled={noMoreReadings}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box flexGrow={1}>
          <VictoryChart
            theme={VictoryTheme.material}
            padding={{ top: 0, left: 0, right: 0, bottom: 40 }}
            width={920}
            height={80}
            scale={{ x: "time" }}
            domain={{ y: chartState.zoomDomain.y }}
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
        </Box>
      </Box>
    </div>
  );
};

export default Chart;
