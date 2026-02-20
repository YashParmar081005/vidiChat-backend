import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },

    // Mood & Personality
    mood: {
      type: String,
      enum: ["Happy", "Sad", "Gaming", "Chatting", "Romantic", "Friendly"],
      default: null
    },
    personality: {
      socialType: {
        type: String,
        enum: ["Introvert", "Extrovert", "Ambivert"],
        default: null
      },
      communicationStyle: {
        type: String,
        enum: ["Funny", "Serious", "Casual", "Deep"],
        default: null
      },
      interestType: {
        type: String,
        enum: ["Gamer", "Music", "Movies", "Tech", "Sports"],
        default: null
      },
      vibe: {
        type: String,
        enum: ["Chill", "Energetic", "Friendly", "Romantic"],
        default: null
      }
    },
    // Arcade fields
    points: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    totalGames: { type: Number, default: 0 },
    achievements: [{ type: String }],
    lastSpinDate: { type: Date, default: null },

    // Avatar system
    selectedAvatar: { type: String, default: "avatar1" },
    unlockedAvatars: {
      type: [String],
      default: ["avatar1"],
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

export default User;
