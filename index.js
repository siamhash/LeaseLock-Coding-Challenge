require("dotenv").config();
const {
  transformCompaniesData,
} = require("./controllers/companies/controller");
const {
  startLoading,
  stopLoading,
  successMessage,
  errorMessage,
} = require("./helpers/console.helper");
const [, , ...args] = process.argv;
if (args && args.length) {
  let ids = args[0].split(",").filter((id) => !isNaN(id));
  if (ids.length > 0) {
    startLoading();
    transformCompaniesData(ids)
      .then((res) => {
        if (res.reports.length) {
          console.log(
            "----------------------------------------------------------------------"
          );
          console.dir(res, { depth: null, colors: true });
          console.log(
            "----------------------------------------------------------------------"
          );
          successMessage("Report generated successfully");
        } else {
          errorMessage("No data inside of reports");
        }
      })
      .catch((err) => {
        console.log(err);
        errorMessage("Error generating report");
      })
      .finally(() => {
        stopLoading();
      });
  } else {
    errorMessage(`ids should be a valid number`);
  }
} else {
  errorMessage(`no id's found inside of argument`);
}
