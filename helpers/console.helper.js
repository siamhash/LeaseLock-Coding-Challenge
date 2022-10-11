const color = require("colors-cli/toxic");
const loading = require("loading-cli");

let load;

const startLoading = (
  text = "Loading...",
  color = "yellow",
  frames = ["◰", "◳", "◲", "◱"],
  interval = 100
) => {
  load = loading({
    text: ` ${text}`,
    stream: process.stdout,
    color,
    interval,
    frames,
  }).start();
};

const updateLoadingText = (text) => {
  if (load) load.text = ` ${text}`;
  else console.error("Load is not defined");
};

const stopLoading = () => {
  if (load) load.stop();
  else console.error("Load is not defined");
};

const successMessage = (message) => {
  console.log("\n✔️ ", `${message}`);
};

const errorMessage = (message) => {
  console.log("\n❌ ", message);
};
module.exports = {
  startLoading,
  stopLoading,
  updateLoadingText,
  successMessage,
  errorMessage,
};
