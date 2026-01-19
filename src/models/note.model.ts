const mongoose = require("mongoose");

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
      enum: ["personal", "work", "ideas"],
      required: true,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt:{
      type:Date,
      default:null
    }
  },
  { timestamps: true },
);

const Note = mongoose.model("note", noteSchema);

module.exports = Note;
