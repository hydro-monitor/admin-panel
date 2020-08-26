import React from "react";
import {
  VictoryChart,
  VictoryTheme,
  VictoryScatter,
  VictoryZoomContainer,
  VictoryLine,
  VictoryBrushContainer,
  VictoryAxis
} from "victory";

export default class Chart extends React.Component {
  constructor({ data }) {
    super();
    let procData = data.map(row => {
      return {
        time: new Date(row.readingTime),
        level: row.waterLevel,
        id: row.readingId
      };
    });
    this.state = {
      data: { data: procData },
      zoomDomain: {
        x: [procData[10].time, procData[0].time] // FIXME fix por si hay menos de una medicion
      }
    };
  }

  handleZoom(domain) {
    this.setState({ zoomDomain: domain });
  }

  render() {
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
              zoomDomain={this.state.zoomDomain}
              onZoomDomainChange={this.handleZoom.bind(this)}
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
            data={this.state.data.data}
            x="time"
            y="level"
            style={{
              data: { stroke: "#3f51b5", strokeWidth: 1 }
            }}
          />
          <VictoryScatter
            data={this.state.data.data}
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
              brushDomain={this.state.zoomDomain}
              onBrushDomainChange={this.handleZoom.bind(this)}
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
            data={this.state.data.data}
            x="time"
            y="level"
            style={{
              data: { stroke: "#3f51b5", strokeWidth: 1 }
            }}
          />
        </VictoryChart>
      </div>
    );
  }
}
