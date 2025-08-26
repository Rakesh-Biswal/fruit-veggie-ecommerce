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
    await client.close()

    if (!user) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return Response.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return Response.json({ success: false, error: "Invalid token" }, { status: 401 })
  }
}
