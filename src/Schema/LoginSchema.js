import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  }
});

export default mongoose.model("LoginUser", userSchema);
