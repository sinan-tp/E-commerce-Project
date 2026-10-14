const API_URL = "http://localhost:3000/orders";

const PRODUCTS_URL =
  "http://localhost:3000/products";

// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (
  orderData
) => {
  // ======================================
  // 1. CHECK STOCK
  // ======================================

  for (const item of orderData.items) {
    const response = await fetch(
      `${PRODUCTS_URL}/${item.id}`
    );

    if (!response.ok) {
      throw new Error(
        `Product ${item.name} not found`
      );
    }

    const product =
      await response.json();

    const currentStock =
      Number(product.stock) || 0;

    const orderQuantity =
      Number(item.quantity) || 0;

    if (
      orderQuantity > currentStock
    ) {
      throw new Error(
        `${product.name} has only ${currentStock} items available`
      );
    }
  }

  // ======================================
  // 2. UPDATE STOCK
  // ======================================

  for (const item of orderData.items) {
    const response = await fetch(
      `${PRODUCTS_URL}/${item.id}`
    );

    const product =
      await response.json();

    const currentStock =
      Number(product.stock) || 0;

    const orderQuantity =
      Number(item.quantity) || 0;

    const newStock =
      currentStock - orderQuantity;

    const stockResponse =
      await fetch(
        `${PRODUCTS_URL}/${item.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            stock: newStock,
          }),
        }
      );

    if (!stockResponse.ok) {
      throw new Error(
        `Failed to update stock for ${item.name}`
      );
    }
  }

  // ======================================
  // 3. CREATE ORDER
  // ======================================

  const orderResponse =
    await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        orderData
      ),
    });

  if (!orderResponse.ok) {
    throw new Error(
      "Failed to create order"
    );
  }

  return orderResponse.json();
};