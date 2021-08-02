const { CustomError } = require("restaurants-utils");
const yup = require("yup");

const restaurantSchema = yup.object().shape({
  name: yup.string().required("Restaurant Name is Required"),
  address: yup.string().required("Restaurant Address is Required"),
  city: yup.string().required("Restaurant City is Required"),
  location: yup
    .object()
    .shape({
      lat: yup.number().required("latitude is required"),
      lng: yup.number().required("longitude is required")
    })
    .required("location is required"),
  cuisine: yup.array().of(yup.string()).min(1).required("atleast 1 cuisine is required"),
  menu: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Menu name is required"),
        price: yup.number().required("Meu price is required")
      })
    )
    .min(1)
    .required("min 1 menu item is required")
});

const validateResourceMW = (resourceSchema) => async (req, res, next) => {
  const resource = req.body;
  try {
    await resourceSchema.validate(resource, { abortEarly: false });
    next();
  } catch (e) {
    next(new CustomError(403, e.errors));
  }
};

module.exports = { restaurantSchema, validateResourceMW };
