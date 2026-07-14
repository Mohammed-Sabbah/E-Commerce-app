function normalizeBilingualFields(req, res, next) {
  const fields = ["name", "description"];
  const isUpdate = req.method === "PATCH";

  for (const field of fields) {
    const en = req.body[`${field}_en`];
    const ar = req.body[`${field}_ar`];
    if (en !== undefined || ar !== undefined) {
      if (isUpdate) {
        if (en !== undefined) req.body[`${field}.en`] = en;
        if (ar !== undefined) req.body[`${field}.ar`] = ar;
      } else {
        req.body[field] = {
          ...(req.body[field] || {}),
          ...(en !== undefined && { en }),
          ...(ar !== undefined && { ar }),
        };
      }
      delete req.body[`${field}_en`];
      delete req.body[`${field}_ar`];
    }
  }
  next();
}

module.exports = normalizeBilingualFields;
