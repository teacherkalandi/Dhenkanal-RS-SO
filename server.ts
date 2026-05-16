import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// --- Google Drive Setup (Optional) ---
const GOOGLE_DRIVE_CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const GOOGLE_DRIVE_CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const GOOGLE_DRIVE_REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

let drive: any = null;

if (GOOGLE_DRIVE_CLIENT_ID && GOOGLE_DRIVE_CLIENT_SECRET && GOOGLE_DRIVE_REFRESH_TOKEN) {
  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_DRIVE_CLIENT_ID,
    GOOGLE_DRIVE_CLIENT_SECRET,
    `${process.env.APP_URL}/api/oauth/callback`
  );

  oauth2Client.setCredentials({ refresh_token: GOOGLE_DRIVE_REFRESH_TOKEN });
  drive = google.drive({ version: "v3", auth: oauth2Client });
}

// --- API Routes ---

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Proxy for Google Drive file upload (Admin Only - Auth check should be implemented)
app.post("/api/drive/upload", async (req, res) => {
  if (!drive) {
    return res.status(501).json({ error: "Google Drive not configured" });
  }

  // Placeholder for security review
  // In a real app, verify Firebase ID Token here
  
  try {
    const { fileName, folderId, mimeType, fileData } = req.body; // fileData as base64
    const buffer = Buffer.from(fileData, 'base64');
    
    // Convert buffer to stream for googleapi if needed, but for small files buffer works too
    // For large files, use busboy or multer
    
    // Note: Simple implementation for illustration
    // ... logic to upload to Google Drive ...
    
    res.json({ message: "Upload logic placeholder" }); 
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
