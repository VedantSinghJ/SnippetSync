import mongoose from "mongoose";
import dotenv from "dotenv";
import Tags from "./src/models/tags/TagsModel.js";
import User from "./src/models/auth/UserModel.js";

dotenv.config();

const addTags = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");

    // Get the first user (or create one if none exists)
    let user = await User.findOne();
    
    if (!user) {
      console.log("No users found. Please create a user first.");
      return;
    }

    console.log(`Using user: ${user.name} (${user.email})`);

    // Define tags to add
    const tagsToAdd = [
      "JavaScript", "Python", "React", "Node.js", "CSS", "HTML", 
      "TypeScript", "MongoDB", "Express", "Next.js", "Vue.js", 
      "Angular", "Java", "C++", "C#", "PHP", "Ruby", "Go", 
      "Rust", "Swift", "Kotlin", "Django", "Flask", "Laravel",
      "Bootstrap", "Tailwind", "SASS", "Webpack", "Vite"
    ];

    // Create tag documents
    const tagDocs = tagsToAdd.map(tagName => ({
      name: tagName,
      usageCount: 0,
      user: user._id
    }));

    // Insert tags
    const createdTags = await Tags.insertMany(tagDocs, { ordered: false });
    console.log(`Successfully added ${createdTags.length} tags`);

  } catch (error) {
    if (error.code === 11000) {
      console.log("Some tags already exist, skipping duplicates");
    } else {
      console.error("Error adding tags:", error);
    }
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
};

addTags();