const buildQueryForSearch = (search) => ({
  $or: [{ name: new RegExp(search, "i") }, { cuisine: new RegExp(search, "i") }]
});

const buildQueryForFilter = (query) => {
  const { city } = query;

  return { ...(city && { city }) };
};

module.exports = {
  buildQueryForSearch,
  buildQueryForFilter
};
