let certTypes = {
  PAY_IN_FULL: "PAY_IN_FULL",
  INSTALLMENTS: "INSTALLMENTS",
};

let certsOfProperties = (certs) => {
  let certsOfPropertyObj = {};
  certs.forEach((cert) => {
    certsOfPropertyObj[cert.property_id]
      ? certsOfPropertyObj[cert.property_id].push(cert)
      : (certsOfPropertyObj[cert.property_id] = [cert]);
  });
  return certsOfPropertyObj;
};

let certsOfProductId = (certs) => {
  let certsOfPropertyObj = {};
  certs.forEach((cert) => {
    certsOfPropertyObj[cert.product_id]
      ? certsOfPropertyObj[cert.product_id].push(cert)
      : (certsOfPropertyObj[cert.product_id] = [cert]);
  });
  return certsOfPropertyObj;
};

let transformProperties = (properties, certs) => {
  const certsOfPropertiesData = certsOfProperties(certs);
  return properties.map((property) => {
    const totalCerts = certsOfPropertiesData[property.id]
      ? certsOfPropertiesData[property.id].length
      : 0;
    const monthly_revenue = certsOfPropertiesData[property.id]
      ? certsOfPropertiesData[property.id].reduce((pre, curr) => {
          return (
            pre +
            (property.type === certTypes.PAY_IN_FULL
              ? curr.down_payment / 12
              : curr.installment_payment + curr.monthly_fee)
          );
        }, 0)
      : 0;
    return {
      property_id: property.id,
      certs: totalCerts,
      units: property.units,
      coverage: totalCerts / property.units,
      monthly_revenue,
    };
  });
};

let transformCerts = (certs) => {
  let certsOfProductIds = certsOfProductId(certs);
  let productIds = Object.keys(certsOfProductIds);
  return productIds.map((productId) => {
    return {
      product_id: productId,
      amount: certsOfProductIds[productId].length,
      percent: (certsOfProductIds[productId].length / certs.length) * 100,
    };
  });
};

let transformCompanyData = (company, certs, properties) => {
  const total_units = properties.reduce((pre, { units }) => {
    return pre + units;
  }, 0);
  const total_certs = certs.length;
  const transformedProperties = transformProperties(properties, certs);
  const monthly_revenue = transformedProperties.reduce(
    (pre, curr) => pre + curr.monthly_revenue,
    0
  );
  return {
    company_name: company.name,
    company_id: company.id,
    total_units,
    total_certs,
    total_coverage: total_certs / total_units,
    monthly_revenue,
    annual_revenue: monthly_revenue * 12,
    properties: transformedProperties,
    certs: transformCerts(certs),
  };
};

let companyErrors = (company, certs, properties) => {
  let errors = [];
  const certsOfPropertiesData = certsOfProperties(certs);
  properties.forEach((property) => {
    const propertyCerts = certsOfPropertiesData[property.id];
    const totalCerts = propertyCerts ? propertyCerts.length : 0;
    if (property.units < totalCerts) {
      errors.push({
        error_code: "MORE_CERTS_THAN_UNITS",
        company_id: company.id,
        property_id: property.id,
      });
    }
    if (propertyCerts) {
      propertyCerts.forEach((cert) => {
        if (
          (property.type === certTypes.PAY_IN_FULL &&
            cert.down_payment === 0) ||
          (property.type === certTypes.INSTALLMENTS &&
            cert.installment_payment === 0)
        ) {
          errors.push({
            error_code: "INVALID_PRODUCT_FOR_PROPERTY",
            company_id: company.id,
            property_id: property.id,
          });
        }
      });
    }
  });
  return errors;
};

module.exports = { transformCompanyData, companyErrors };
