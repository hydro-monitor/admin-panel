import store from "store";

export default class ReadingsClient {
  constructor(url) {
    this.url = url;
  }

  async deleteReadings(nodeId, readings) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${store.get("token")}`);
    const responses = readings.map(async reading => {
      const response = await fetch(
        `${this.url}/${nodeId}/readings/${reading.readingId}`,
        {
          method: "delete",
          headers: myHeaders
        }
      );
      return response.ok;
    });
    return responses.reduce(
      (response, currentValue) => response && currentValue
    );
  }

  async getReadings(nodeId, pageSize, pageState) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${store.get("token")}`);
    let theresMoreReadings = true;
    const response = await fetch(
      `${
        this.url
      }/${nodeId}/readings?page_size=${pageSize}&page_state=${encodeURIComponent(
        pageState
      )}`,
      { headers: myHeaders }
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
        )}`,
        { headers: myHeaders }
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
