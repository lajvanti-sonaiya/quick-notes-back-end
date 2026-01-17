const validate = (schema) => {
  return (req, res, next) => {

    console.log("req.body",req.body)
    const {error} = schema.required().validate(req.body);

    if (error) {
      console.log("🚀 ~ validate ~ error:", error);
      return res.status(400).json({
        status: "false",
        message: error.details[0].message,
      });
    }

    next();
  };
};

module.exports = validate;
