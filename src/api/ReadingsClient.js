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
}
