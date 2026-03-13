import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    role:{
      type:String,
      enum:["user","admin"],
      default:"user"
    }
  },
  { timestamps: true }
);

const User =mongoose.model("User", UserSchema);;

export default User;  


 