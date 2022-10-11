const axios = require("axios");
axios.defaults.baseURL = `${process.env.API_URL_PROD}`;
const get = async (url) => {
  let response = await axios.get(url);
  return response.data;
};
const getAll = async (urls) => {
  let responses = await Promise.all(urls.map((url) => axios.get(url)));
  return responses.map((response) => response.data);
};
module.exports = { get, getAll };
