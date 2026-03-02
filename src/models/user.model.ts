import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
 
  },
  { timestamps: true }
);

const User =mongoose.model("User", UserSchema);;

export default User;  


 