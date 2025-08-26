import jwt from "jsonwebtoken"
import { MongoClient, ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.MONGODB_URI

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return Response.json({ success: false, error: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("freshmart")
    const users = db.collection("users")

    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      await client.close()
      return Response.json({ success: false, error: "User not found" }, { status: 404 })
    }

    await client.close()

    return Response.json({
      success: true,
      cart: user.cart || []
    })
  } catch (error) {
    console.error("Get cart error:", error)
    return Response.json({ success: false, error: "Failed to get cart" }, { status: 500 })
  }
}