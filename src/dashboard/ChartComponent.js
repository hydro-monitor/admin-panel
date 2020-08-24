import React from "react";
import {
  VictoryChart,
  VictoryTheme,
  VictoryZoomContainer,
  VictoryLine,
  VictoryBrushContainer,
  VictoryAxis
} from "victory";

export default class Chart extends React.Component {
  constructor(data) {
    super();
    let today = new Date();
    let tenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 10));
    this.state = {
      data: data,
      zoomDomain: { x: [tenDaysAgo, today] }
    };
  }

  handleZoom(domain) {
    console.log(
      Array.isArray(this.state.data.data)
        ? this.state.data.data.map(row => {
            return {
              time: new Date(row.readingTime),
              level: row.waterLevel,
              id: row.readingId
            };
          })
        : []
    );
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
          <VictoryLine
            data={
              Array.isArray(this.state.data.data)
                ? this.state.data.data.map(row => {
                    return {
                      time: new Date(row.readingTime),
                      level: row.waterLevel,
                      id: row.readingId
                    };
                  })
                : []
            }
            x="time"
            y="level"
          />
        </VictoryChart>
        <VictoryChart
          theme={VictoryTheme.material}
          padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
          width={1000}
          height={80}
          scale={{ x: "time" }}
          containerComponent={
            <VictoryBrushContainer
              brushDimension="x"
              brushDomain={this.state.zoomDomain}
              onBrushDomainChange={this.handleZoom.bind(this)}
            />
          }
        >
          <VictoryAxis />
          <VictoryLine
            data={
              Array.isArray(this.state.data.data)
                ? this.state.data.data.map(row => {
                    return {
                      time: new Date(row.readingTime),
                      level: row.waterLevel,
                      id: row.readingId
                    };
                  })
                : []
            }
            x="time"
            y="level"
          />
        </VictoryChart>
      </div>
    );
  }
}
