import React, { useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer
} from "recharts";
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryLine,
  VictoryBrushContainer,
  VictoryAxis
} from "victory";

export default function Chart({ nodeName }) {
  const [zoomDomain, setZoomDomain] = useState({
    x: [new Date(1990, 1, 1), new Date(2009, 1, 1)]
  });

  const handleZoom = useCallback(() => {
    setZoomDomain(zoomDomain);
  }, [zoomDomain]);

  const mockData = [
    { key: new Date(1982, 1, 1), b: 125 },
    { key: new Date(1987, 1, 1), b: 257 },
    { key: new Date(1993, 1, 1), b: 345 },
    { key: new Date(1997, 1, 1), b: 515 },
    { key: new Date(2001, 1, 1), b: 132 },
    { key: new Date(2005, 1, 1), b: 305 },
    { key: new Date(2011, 1, 1), b: 270 },
    { key: new Date(2015, 1, 1), b: 470 }
  ];

  return (
    <div>
      <VictoryChart
        width={600}
        height={470}
        scale={{ x: "time" }}
        containerComponent={
          <VictoryZoomContainer
            zoomDimension="x"
            zoomDomain={zoomDomain}
            onZoomDomainChange={handleZoom}
          />
        }
      >
        <VictoryLine
          style={{
            data: { stroke: "tomato" }
          }}
          data={mockData}
          x="a"
          y="b"
        />
      </VictoryChart>
      <VictoryChart
        padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
        width={600}
        height={100}
        scale={{ x: "time" }}
        containerComponent={
          <VictoryBrushContainer
            brushDimension="x"
            brushDomain={zoomDomain}
            onBrushDomainChange={handleZoom}
          />
        }
      >
        <VictoryAxis tickFormat={x => new Date(x).getFullYear()} />
        <VictoryLine
          style={{
            data: { stroke: "tomato" }
          }}
          data={mockData}
          x="key"
          y="b"
        />
      </VictoryChart>
    </div>
  );
}
