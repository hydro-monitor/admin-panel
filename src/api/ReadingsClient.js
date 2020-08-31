export default class ReadingsClient {
  constructor(url) {
    this.url = url;
  }

  async deleteReadings(nodeId, readings) {
    const responses = readings.map(async reading => {
      const response = await fetch(
        `${this.url}/${nodeId}/readings/${reading.readingId}`,
        {
          method: "delete"
        }
      );
      return response.ok;
    });
    return responses.reduce(
      (response, currentValue) => response && currentValue
    );
  }

  async getReadings(nodeId, pageSize, pageState) {
    let theresMoreReadings = true;
    const response = await fetch(
      `${
        this.url
      }/${nodeId}/readings?page_size=${pageSize}&page_state=${encodeURIComponent(
        pageState
      )}`
    );
    if (!response.ok) {
      throw Error(response.statusText);
    }
    let newReadingsPageState = response.headers.get("Page-State");
    console.log("PAGE STATE IS ", newReadingsPageState);
    if (
      newReadingsPageState === null ||
      newReadingsPageState === undefined ||
      newReadingsPageState === ""
    ) {
      console.log("PAGE STATE IS NULL/UNDEFINED ", newReadingsPageState);
      newReadingsPageState = "";
      theresMoreReadings = false;
    } else {
      const eofCheck = await fetch(
        `${
          this.url
        }/${nodeId}/readings?page_size=${1}&page_state=${encodeURIComponent(
          newReadingsPageState
        )}`
      );
      const nextNewReadingsPageState = eofCheck.headers.get("Page-State");
      if (
        nextNewReadingsPageState === null ||
        nextNewReadingsPageState === undefined ||
        nextNewReadingsPageState === ""
      ) {
        theresMoreReadings = false;
      }
    }
    const json = await response.json();
    console.log("PAGE STATE IS ", newReadingsPageState);
    const ret = { json, newReadingsPageState, theresMoreReadings };
    console.log("RET IS ", ret);
    return ret;
  }
}
