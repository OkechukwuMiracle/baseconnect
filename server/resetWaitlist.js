// resetWaitlist.js
import 'dotenv/config';
import mongoose from "mongoose";
import { exec } from "child_process";

const MONGODB_URI = process.env.MONGODB_URI;

async function reset() {
  if (!MONGODB_URI) {
    console.error("❌ MONGO_URI is missing from environment variables.");
    process.exit(1);
  }

  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB.");

    const db = mongoose.connection;

    const collections = [
      "waitlisttasks",
      "questprogress",
      "verificationrecords",
    ];

    for (const col of collections) {
      const exists = await db.db
        .listCollections({ name: col })
        .hasNext();

      if (exists) {
        await db.dropCollection(col);
        console.log(`🗑️ Dropped collection: ${col}`);
      } else {
        console.log(`⚠️ Collection not found: ${col}`);
      }
    }

    console.log("🔄 Running seed:waitlist...");
    exec("npm run seed:waitlist", (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Error running seed script: ${err.message}`);
        process.exit(1);
      }

      console.log(stdout);
      console.log("🎉 Waitlist reset complete!");
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

reset();
