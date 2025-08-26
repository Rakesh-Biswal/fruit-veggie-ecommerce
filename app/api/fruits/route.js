import { NextResponse } from 'next/server'

const API_BASE_URL = "https://vegfru-api.vercel.app/api"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = searchParams.get('page') || 1
        const limit = searchParams.get('limit') || 12
        const search = searchParams.get('search') || ""

        const response = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}&search=${search}`)

        if (!response.ok) {
            return NextResponse.json(getMockData(page, limit, search))
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("API Error:", error)
        return NextResponse.json(getMockData(1, 12, ""))
    }
}

function getMockData(page = 1, limit = 12, search = "") {
    const allProducts = [

        { id: 1, name: "Fresh Apples", price: 3.99, image: "/red-apples.png", category: "fruits", unit: "per kg" },
        { id: 2, name: "Bananas", price: 2.49, image: "/yellow-bananas.png", category: "fruits", unit: "per kg" },
        {
            id: 3,
            name: "Organic Tomatoes",
            price: 4.99,
            image: "/red-tomatoes.png",
            category: "vegetables",
            unit: "per kg",
        },
        {
            id: 4,
            name: "Fresh Carrots",
            price: 2.99,
            image: "/orange-carrots.png",
            category: "vegetables",
            unit: "per kg",
        },
        {
            id: 5,
            name: "Green Broccoli",
            price: 3.49,
            image: "/green-broccoli.png",
            category: "vegetables",
            unit: "per piece",
        },
        {
            id: 6,
            name: "Orange Oranges",
            price: 4.49,
            image: "/orange-oranges.png",
            category: "fruits",
            unit: "per kg",
        },
        {
            id: 7,
            name: "Fresh Spinach",
            price: 2.99,
            image: "/green-spinach-leaves.png",
            category: "leafy",
            unit: "per bunch",
        },
        {
            id: 8,
            name: "Bell Peppers",
            price: 5.99,
            image: "/colorful-bell-peppers.png",
            category: "vegetables",
            unit: "per kg",
        },
        {
            id: 9,
            name: "Fresh Mangoes",
            price: 6.99,
            image: "/ripe-mangoes.png",
            category: "fruits",
            unit: "per kg",
        },
        {
            id: 10,
            name: "Cucumber",
            price: 2.49,
            image: "/green-cucumber.png",
            category: "vegetables",
            unit: "per piece",
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