import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI

async function setupDatabase() {
  try {
    console.log("Connecting to MongoDB...")
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("freshmart")

    // Create users collection with indexes
    console.log("Creating users collection...")
    const users = db.collection("users")
    await users.createIndex({ email: 1 }, { unique: true })

    // Create products collection (for future use)
    console.log("Creating products collection...")
    const products = db.collection("products")
    await products.createIndex({ name: 1 })
    await products.createIndex({ category: 1 })

    console.log("Database setup completed successfully!")
    await client.close()
  } catch (error) {
    console.error("Database setup error:", error)
  }
}

setupDatabase()
