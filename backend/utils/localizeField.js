function localizeField(field, lang) {
  if (field && typeof field === "object" && "en" in field) {
    return field[lang] || field["en"] || "";
  }
  return field;
}

function localizeDoc(doc, lang) {
  if (!doc || typeof doc !== "object") return doc;

  const bilingualFields = ["name", "description"];

  for (const field of bilingualFields) {
    if (doc[field] && typeof doc[field] === "object" && "en" in doc[field]) {
      doc[field] = localizeField(doc[field], lang);
    }
  }

  const populatedRefs = ["category", "subCategory", "brand"];
  for (const ref of populatedRefs) {
    if (Array.isArray(doc[ref])) {
      doc[ref].forEach((item) => localizeDoc(item, lang));
    } else if (doc[ref] && typeof doc[ref] === "object" && doc[ref]._id) {
      localizeDoc(doc[ref], lang);
    }
  }

  return doc;
}

function localizeDocs(docs, lang) {
  if (Array.isArray(docs)) return docs.map((doc) => localizeDoc(doc, lang));
  return localizeDoc(docs, lang);
}

module.exports = { localizeField, localizeDoc, localizeDocs };
