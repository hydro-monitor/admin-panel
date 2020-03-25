export default class NodesClient {
  constructor(url) {
    this.url = url;
  }

  handleErrors(response) {
    console.log(response);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  async getNodes() {
    const response = this.handleErrors(await fetch(this.url));
    const json = await response.json();
    return json.map(item => item.id).sort();
  }

  async getNodeConfiguration(nodeId) {
    const response = this.handleErrors(
      await fetch(`${this.url}/${nodeId}/configuration`)
    );
    const json = await response.json();
    if (json == null) {
      return "";
    }
    return JSON.stringify(json, null, 2);
  }

  async deleteNode(nodeId) {
    const response = await fetch(`${this.url}${nodeId}`, { method: "delete" });
    console.log(response);
    return response.ok;
  }
}
