import { NextResponse } from 'next/server'

const API_BASE_URL = "https://vegfru-api.vercel.app/api"

export async function GET(request) {
  let query = ''
  
  try {
    const { searchParams } = new URL(request.url)
    query = searchParams.get('q') || ''

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      return NextResponse.json(getMockSuggestions(query))
    }

    const data = await response.json()
    return NextResponse.json(data.suggestions || [])
  } catch (error) {
    return NextResponse.json(getMockSuggestions(query))
  }
}

function getMockSuggestions(query) {
  const suggestions = [
    "Mango",
    "Apple",
    "Banana",
    "Orange",
    "Grapes",
    "Pomegranate",
    "Papaya",
    "Watermelon",
    "Tomato",
    "Onion",
    "Potato",
    "Carrot",
    "Broccoli",
    "Spinach",
    "Cauliflower",
    "Bell Pepper",
    "Cucumber",
    "Lettuce",
    "Cabbage",
    "Green Beans",
    "Eggplant",
    "Okra",
    "Bitter Gourd",
    "Bottle Gourd",
  ]

  if (!query) {
    return []
  }

  return suggestions
    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8)
}