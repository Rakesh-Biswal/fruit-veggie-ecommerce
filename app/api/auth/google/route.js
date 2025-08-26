import jwt from "jsonwebtoken"
import { MongoClient } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.MONGODB_URI

export async function POST(request) {
  try {
    const { credential } = await request.json()


    const decoded = jwt.decode(credential)
    const { email, name, picture } = decoded

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("freshmart")
    const users = db.collection("users")

    let user = await users.findOne({ email })

    if (!user) {

      user = {
        email,
        name,
        picture,
        cart: [],
        createdAt: new Date(),
      }
      await users.insertOne(user)
    }


    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    await client.close()

    return Response.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    })
  } catch (error) {
    console.error("Google auth error:", error)
    return Response.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
