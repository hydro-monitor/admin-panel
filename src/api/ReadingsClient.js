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
    if (
      newReadingsPageState === null ||
      newReadingsPageState === undefined ||
      newReadingsPageState === ""
    ) {
      newReadingsPageState = "";
      theresMoreReadings = false;
    } else {
      // If theres a page state, check if the next page state is nil
      // (This means there is no more readings to get)
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
    return { json, newReadingsPageState, theresMoreReadings };
  }
}
