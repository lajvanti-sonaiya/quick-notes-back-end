import mongoose from "mongoose";
import { CATEGORY_ENUM } from "../utills/constants.js";
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: CATEGORY_ENUM,
      required: true,
    },
    clerkId: { type: String, required: true },

    isPinned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 1,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
    image: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const Note = mongoose.model("note", noteSchema);

export default Note;
