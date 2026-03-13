import mongoose from "mongoose";

const ColumnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

const Column = mongoose.model("column", ColumnSchema);
export default  Column;
