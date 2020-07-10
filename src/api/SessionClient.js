export default class SessionClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async signIn(username, password) {
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    const response = await fetch(
      `${this.baseUrl}?username=${encodedUsername}&password=${encodedPassword}`,
      {
        method: "post"
      }
    );
    if (response.ok) {
      const body = await response.json();
      return body.token;
    }
    return null;
  }
}
