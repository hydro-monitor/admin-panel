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

  async updateNodeConfiguration(nodeId, configuration) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = this.handleErrors(
      await fetch(`${this.url}/${nodeId}/configuration`),
      {
        method: "post",
        body: configuration,
        headers: myHeaders
      }
    );
    const json = await response.json();
    if (json == null) {
      throw Error("No se ha podido actualizar/crear la configuración del nodo");
    }
    return JSON.stringify(json, null, 2);
  }

  async createNode(nodeId, description) {
    console.log(nodeId);
    console.log(description);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    return fetch(this.url, {
      method: "post",
      headers: myHeaders,
      body: JSON.stringify({ id: nodeId, description: description })
    });
  }

  async deleteNode(nodeId) {
    const response = await fetch(`${this.url}${nodeId}`, { method: "delete" });
    console.log(response);
    return response.ok;
  }
}
