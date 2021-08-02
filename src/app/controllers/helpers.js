const buildQueryForSearch = (search) => ({
  $or: [
    { name: new RegExp(search, "i") },
    { cuisine: { $in: new RegExp(search, "i") } },
    { menu: { $elemMatch: { name: new RegExp(search, "i") } } }
  ]
});

const buildQueryForFilter = (body) => {
  const { city, cuisine } = body;

  return { ...(city && { city }), ...(cuisine && { cuisine: { $all: cuisine } }) };
};

module.exports = {
  buildQueryForSearch,
  buildQueryForFilter
};
