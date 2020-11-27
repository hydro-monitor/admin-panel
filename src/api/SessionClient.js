export default class SessionClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async signIn(username, password) {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const response = await fetch(this.baseUrl, {
      method: "post",
      body: formData
    });
    if (response.ok) {
      const body = await response.json();
      return body.token;
    }
    return null;
  }
}
