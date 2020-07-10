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
    const response = this.handleErrors(await fetch(this.url));
    const json = await response.json();
    if (json == null) {
      return {};
    }
    return this.arrToObj(json);
  }

  async getNodeConfiguration(nodeId) {
    const response = this.handleErrors(
      await fetch(`${this.url}/${nodeId}/configuration`)
    );
    const json = await response.json();
    if (json == null) {
      console.log("Error turning config to json");
      return "";
    }
    return json;
  }

  async updateNodeConfiguration(nodeId, configuration) {
    console.log("Updating configuration...");
    console.log(configuration);
    const configurationString = JSON.stringify(configuration, null, 2);
    console.log(configurationString);
    const response = this.handleErrors(
      await fetch(`${this.url}/${nodeId}/configuration`, {
        method: "post",
        body: configurationString,
        headers: {
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
    const response = await fetch(`${this.url}/${nodeId}`, { method: "delete" });
    console.log(response);
    return response.ok;
  }
}
