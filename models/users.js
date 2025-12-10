import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { return !this.googleId; } },

    // OAuth fields
    googleId: { type: String, unique: true, sparse: true },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },

    // Email verification fields
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },

    // Password reset fields
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },

    // Profile picture
    profilePicture: { type: String },
  },
  { timestamps: true }
);

const users = mongoose.models.users || mongoose.model("users", UserSchema);

export default users;
