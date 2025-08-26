export async function fetchFruitsAndVegetables(page = 1, limit = 12, search = "") {
  try {
    const response = await fetch(`/api/fruits?page=${page}&limit=${limit}&search=${search}`)

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("API Error:", error)
    return getMockData(page, limit, search)
  }
}

export async function searchSuggestions(query) {
  if (!query || query.length < 2) return []

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      return getMockSuggestions(query)
    }

    const data = await response.json()
    return data
  } catch (error) {
    return getMockSuggestions(query)
  }
}

function getMockData(page = 1, limit = 12, search = "") {
  const allProducts = [
    // Fruits
    {
      id: 1,
      name: "Mango",
      category: "fruit",
      price: 120,
      unit: "1 kg",
      image: "/fresh-mango.png",
      description: "Sweet Alphonso mangoes",
    },
    {
      id: 2,
      name: "Apple",
      category: "fruit",
      price: 180,
      unit: "1 kg",
      image: "/red-apple.png",
      description: "Fresh red apples",
    },
    {
      id: 3,
      name: "Banana",
      category: "fruit",
      price: 60,
      unit: "1 dozen",
      image: "/yellow-banana.png",
      description: "Ripe yellow bananas",
    },
    {
      id: 4,
      name: "Orange",
      category: "fruit",
      price: 100,
      unit: "1 kg",
      image: "/ripe-orange.png",
      description: "Juicy oranges",
    },
    {
      id: 5,
      name: "Grapes",
      category: "fruit",
      price: 150,
      unit: "500g",
      image: "/green-grapes.png",
      description: "Sweet green grapes",
    },
    {
      id: 6,
      name: "Pomegranate",
      category: "fruit",
      price: 200,
      unit: "1 kg",
      image: "/ripe-pomegranate.png",
      description: "Fresh pomegranates",
    },
    {
      id: 7,
      name: "Papaya",
      category: "fruit",
      price: 80,
      unit: "1 piece",
      image: "/papaya-fruit.png",
      description: "Ripe papaya",
    },
    {
      id: 8,
      name: "Watermelon",
      category: "fruit",
      price: 40,
      unit: "1 kg",
      image: "/ripe-watermelon.png",
      description: "Sweet watermelon",
    },

    // Vegetables
    {
      id: 9,
      name: "Tomato",
      category: "vegetable",
      price: 50,
      unit: "1 kg",
      image: "/red-tomato.png",
      description: "Fresh red tomatoes",
    },
    {
      id: 10,
      name: "Onion",
      category: "vegetable",
      price: 40,
      unit: "1 kg",
      image: "/single-onion.png",
      description: "Fresh onions",
    },
  ]

  let filteredProducts = allProducts

  if (search) {
    filteredProducts = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()),
    )
  }

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  return {
    products: paginatedProducts,
    totalProducts: filteredProducts.length,
    currentPage: page,
    totalPages: Math.ceil(filteredProducts.length / limit),
    hasNextPage: endIndex < filteredProducts.length,
    hasPrevPage: page > 1,
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

  return suggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
}
