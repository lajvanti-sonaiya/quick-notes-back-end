import type { Request, Response, NextFunction } from "express";
import type {AnySchema, ValidationError} from "joi"

const validate = (schema:AnySchema) => {
  return (req:Request, res:Response, next:NextFunction) => {

    console.log("req.body",req.body)
    const {error} : { error?:ValidationError}= schema.required().validate(req.body);

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
