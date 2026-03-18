const { connectDb } = require("../config/db");
const { env } = require("../config/env");
const { User } = require("../models/User");
const { Pet } = require("../models/Pet");

async function run() {
  await connectDb(env.MONGO_URI);

  const adminEmail = "admin@pets.com";
  const existingAdmin = await User.findOne({ email: adminEmail }).select("_id");
  if (!existingAdmin) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: "Admin@123",
      role: "admin"
    });
    // eslint-disable-next-line no-console
    console.log(`Created admin: ${adminEmail} / Admin@123`);
  }

  const count = await Pet.countDocuments();
  if (count === 0) {
    await Pet.insertMany([
      {
        name: "Buddy",
        species: "Dog",
        breed: "Labrador Retriever",
        age: 3,
        description: "Friendly, energetic, and great with families.",
        status: "available",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=60"
      },
      {
        name: "Milo",
        species: "Cat",
        breed: "Domestic Shorthair",
        age: 2,
        description: "Curious and affectionate lap cat.",
        status: "available",
        image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=60"
      }
    ]);
    // eslint-disable-next-line no-console
    console.log("Seeded pets.");
  }

  // eslint-disable-next-line no-console
  console.log("Done.");
  process.exit(0);
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

