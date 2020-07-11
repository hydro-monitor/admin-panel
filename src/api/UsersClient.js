export default class UsersClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async createUser(user) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    const response = await fetch(this.baseUrl, {
      method: "post",
      headers: headers,
      body: JSON.stringify(user)
    });
    return response.ok;
  }

  async getUserInfo(userName) {
    let headers = new Headers();
    headers.append("Accept", "application/json");
    const response = await fetch(`${this.baseUrl}/${userName}`, {
      method: "get",
      headers: headers
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  }

  async updateUserInfo(user, userInfo) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    const response = await fetch(`${this.baseUrl}/${user}`, {
      method: "put",
      headers: headers,
      body: JSON.stringify(userInfo)
    });
    return response.ok;
  }
}
