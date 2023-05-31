import axios, { AxiosInstance } from "axios";

class API {
  apiURL: string;
  client: AxiosInstance | null = null;

  constructor() {
    // TODO: change to production URL.
    // Use environment variables to set this.
    this.apiURL = "https://api.sciquel.org";
    // this.apiURL = "https://localhost";
  }

  init = () => {
    // Create axios client, pre-configured with baseURL
    this.client = axios.create({
      baseURL: this.apiURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Set Authorization header
    const token = localStorage.getItem("token");
    if (token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  getClient = (): AxiosInstance => {
    if (this.client === null) {
      this.init();
    }
    return this.client as AxiosInstance;
  };

  submitFeedback = async (data) => {
    const response = await this.getClient().post("/leave-feedback", data);
    return response;
  };

  submitGetInvolved = async (data) => {
    const response = await this.getClient().post("/get-involved", data);
    return response;
  };

  getLatestArticles = async () => {
    let response = await this.getClient().get("/latest");
    return response;
  };

  getStaffPicks = async () => {
    let response = await this.getClient().get("/staffpicks");
    return response;
  };

  getStory = async (data) => {
    let response = await this.getClient().get(
      `/stories/${data.year}/${data.month}/${data.day}/${data.story}`
    );
    return response;
  };

  getContributorProfile = async (data) => {
    let formData = new FormData();
    formData.append("contributor", data);
    let response = await this.getClient().get("/contributor", formData);

    return response;
  };

  subscribeNewsletter = async (email: string) => {
    const data = {
      email: email,
    };
    const response = await this.getClient().post("/subscribe", data);
    return response;
  };
}

export default API;
