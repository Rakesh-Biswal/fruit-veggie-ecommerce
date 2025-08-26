import jwt from "jsonwebtoken"
import { MongoClient, ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.MONGODB_URI

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return Response.json({ success: false, error: "No token provided" }, { status: 401 })
    }


    const decoded = jwt.verify(token, JWT_SECRET)
    const { productId, quantity = 1 } = await request.json()

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("freshmart")
    const users = db.collection("users")

    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      await client.close()
      return Response.json({ success: false, error: "User not found" }, { status: 404 })
    }


    const existingItem = user.cart?.find((item) => item.productId === productId)

    if (existingItem) {

      await users.updateOne(
        { _id: new ObjectId(decoded.userId), "cart.productId": productId },
        { $inc: { "cart.$.quantity": quantity } },
      )
    } else {

      await users.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $push: { cart: { productId, quantity, addedAt: new Date() } } },
      )
    }

    const updatedUser = await users.findOne({ _id: new ObjectId(decoded.userId) })
    
    await client.close()

    return Response.json({
      success: true,
      message: "Item added to cart",
      cart: updatedUser.cart || []
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    return Response.json({ success: false, error: "Failed to add item to cart" }, { status: 500 })
  }
}