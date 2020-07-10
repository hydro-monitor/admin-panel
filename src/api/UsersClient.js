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
}
