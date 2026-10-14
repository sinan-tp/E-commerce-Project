const API_URL = "http://localhost:3000/products";

// ========================================
// GET ALL PRODUCTS
// ========================================

export const getProducts = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

// ========================================
// GET SINGLE PRODUCT
// ========================================

export const getProductById = async (id) => {
  const response = await fetch(
    `${API_URL}/${id}`
  );

  if (!response.ok) {
    throw new Error("Product not found");
  }

  return response.json();
};

// ========================================
// UPDATE PRODUCT STOCK
// ONLY CALLED WHEN ORDER IS PLACED
// ========================================

export const updateProductStock = async (
  productId,
  newStock
) => {
  const response = await fetch(
    `${API_URL}/${productId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stock: newStock,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update product stock"
    );
  }

  return response.json();
};