const { transformCompanyData, companyErrors } = require("./functions");
const { getAll } = require("./../../helpers/httpRequest.helper");
const {
  updateLoadingText,
  successMessage,
  errorMessage,
} = require("./../../helpers/console.helper");
let transformCompaniesData = async (ids) => {
  let errors = [];
  let reports = [];
  for (let id of ids) {
    updateLoadingText(`Fetching data for id ${id}`);
    try {
      let [{ company }, { certs }, { properties }] = await getAll([
        `companies/${id}`,
        `companies/${id}/certs`,
        `companies/${id}/properties`,
      ]);
      if (!company.id) errorMessage(`Company data not found for id ${id}`);
      if (!certs || !certs.length)
        errorMessage(`Certs data not found for id ${id}`);
      if (!properties || !properties.length)
        errorMessage(`Properties data not found for id ${id}`);
      if (company.id && certs.length && properties.length) {
        successMessage(`Successfully fetched the data for ${id}`);
        updateLoadingText(`building report for ${id}`);
        const report = transformCompanyData(company, certs, properties);
        reports.push(report);
        const error = companyErrors(company, certs, properties);
        error.length && errors.push(error);
        successMessage(`Report build for ${id}`);
      } else errorMessage(`Report was not generated for id ${id}`);
    } catch (err) {
      errorMessage(`Error fetching data for ${id}`);
    }
  }
  return {
    reports,
    errors,
  };
};
module.exports = { transformCompaniesData };
