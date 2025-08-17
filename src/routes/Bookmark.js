import express from 'express'
const router = express.Router()
import { v4 as uuidv4 } from 'uuid';
import auth from '../Auth/Auth.js'
import Bookmark from '../Schema/BookmarkScheme.js'
// let bookmarks = []


// Get current user's bookmarks
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const bookmarks = await Bookmark.find({ userId }).sort({ dateAdded: -1 });
    return res.json({ success: true, bookmarks });
  } catch (err) {
    console.error("Fetch bookmarks error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});


router.post("/", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { title, formats, expiredAt } = req.body;

    if (!title) return res.status(400).json({ success: false, error: "Title is required" });

    const expires = expiredAt ? new Date(expiredAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Prevent duplicates for the same user by title
    const exists = await Bookmark.findOne({ title, userId });
    if (exists) return res.status(400).json({ success: false, error: "Bookmark already exists" });
    const bookmark = await Bookmark.create({
      title,
      formats: formats || null,
      expiredAt: expires,
      userId
    });

    return res.status(201).json({ success: true, message: "Bookmark created successfully", bookmark });
  } catch (err) {
    console.error("Error creating bookmark:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const doc = await Bookmark.findById(id);
    if (!doc) return res.status(404).json({ success: false, error: "Bookmark not found" });
    if (String(doc.userId) !== String(userId)) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    await Bookmark.findByIdAndDelete(id);
    return res.json({ success: true, message: "Bookmark removed successfully" });
  } catch (err) {
    console.error("Delete bookmark error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});



export default router