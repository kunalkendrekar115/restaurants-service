const buildQueryForSearch = (search) => ({
  $or: [
    { name: new RegExp(search, "i") },
    { cuisine: { $in: new RegExp(search, "i") } },
    { menu: { $elemMatch: { name: new RegExp(search, "i") } } }
  ]
});

const buildQueryForFilter = (query) => {
  const { city, cuisine } = query;

  return { ...(city && { city }), ...(cuisine && { cuisine: { $all: cuisine } }) };
};

module.exports = {
  buildQueryForSearch,
  buildQueryForFilter
};
