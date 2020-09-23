import { getToken } from "../signin/utils";

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

  arrToObj(arr) {
    let o = {};
    for (let i = 0; i < arr.length; ++i) {
      o[arr[i].id] = arr[i];
    }
    return o;
  }

  async getNodes() {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${getToken()}`);
    const response = this.handleErrors(
      await fetch(this.url, { headers: myHeaders })
    );
    const json = await response.json();
    if (json == null) {
      return {};
    }
    return this.arrToObj(json);
  }

  async getNodeConfiguration(nodeId) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${getToken()}`);
    const response = this.handleErrors(
      await fetch(`${this.url}/${nodeId}/configuration`, { headers: myHeaders })
    );
    const json = await response.json();
    if (json == null) {
      console.error("Error turning config to json");
      return "";
    }
    return json;
  }

  async updateNodeConfiguration(nodeId, configuration) {
    const configurationString = JSON.stringify(configuration, null, 2);
    const response = this.handleErrors(
      await fetch(`${this.url}/${nodeId}/configuration`, {
        method: "post",
        body: configurationString,
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
    );
    const json = await response.json();
    if (json == null) {
      throw Error("No se ha podido actualizar/crear la configuración del nodo");
    }
    return json;
  }

  async createNode(nodeId, description) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${getToken()}`);
    return fetch(this.url, {
      method: "post",
      headers: myHeaders,
      body: JSON.stringify({ id: nodeId, description: description })
    });
  }

  async deleteNode(nodeId) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${getToken()}`);
    const response = await fetch(`${this.url}/${nodeId}`, {
      method: "delete",
      headers: myHeaders
    });
    console.log(response);
    return response.ok;
  }

  async updateNode(nodeId, nodeInfo) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${getToken()}`);
    const response = await fetch(`${this.url}/${nodeId}`, {
      method: "put",
      headers: myHeaders,
      body: JSON.stringify(nodeInfo)
    });
    return response.ok;
  }
}
