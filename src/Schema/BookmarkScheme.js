import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  formats:   { type: mongoose.Schema.Types.Mixed, default: null },
  dateAdded: { type: Date, default: Date.now },
  expiredAt: { type: Date, required: true }, // no index here
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

// TTL index — auto-delete after expiredAt
BookmarkSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

// Prevent duplicates per user+title
BookmarkSchema.index({ userId: 1, title: 1 }, { unique: true });

export default mongoose.model("Bookmark", BookmarkSchema);
