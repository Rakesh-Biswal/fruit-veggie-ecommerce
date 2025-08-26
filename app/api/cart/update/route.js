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
    const { productId, quantity } = await request.json()

    if (quantity < 0) {
      return Response.json({ success: false, error: "Quantity cannot be negative" }, { status: 400 })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("freshmart")
    const users = db.collection("users")


    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      await client.close()
      return Response.json({ success: false, error: "User not found" }, { status: 404 })
    }

    if (quantity === 0) {

      await users.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $pull: { cart: { productId } } },
      )
    } else {

      await users.updateOne(
        { _id: new ObjectId(decoded.userId), "cart.productId": productId },
        { $set: { "cart.$.quantity": quantity } },
      )
    }

    const updatedUser = await users.findOne({ _id: new ObjectId(decoded.userId) })
    
    await client.close()

    return Response.json({
      success: true,
      message: quantity === 0 ? "Item removed from cart" : "Quantity updated",
      cart: updatedUser.cart || []
    })
  } catch (error) {
    console.error("Update cart error:", error)
    return Response.json({ success: false, error: "Failed to update cart" }, { status: 500 })
  }
}