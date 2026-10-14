
import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import Pagination from "../../../components/Pagination/Pagination";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/products";

const Products = () => {
  const navigate = useNavigate();

  

  // =====================================
  // STATE
  // =====================================
              
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination,setpagination]=useState(1)
  

  // =====================================
  // FETCH PRODUCTS
  // =====================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Products fetch error:", error);

      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // INITIAL FETCH
  // =====================================

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================
  // CATEGORIES
  // =====================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products.map((product) => product.category)
      ),
    ];

    return [
      "All",
      ...uniqueCategories.filter(Boolean),
    ];
  }, [products]);

  // =====================================
  // FILTER PRODUCTS
  // =====================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(searchText) ||
        product.category
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);


  // page


const itemsPerPage = 5;

const totalPages = Math.ceil(
  filteredProducts.length / itemsPerPage
);

const startIndex = (pagination - 1) * itemsPerPage;

const currentProducts = filteredProducts.slice(
  startIndex,
  startIndex + itemsPerPage
);




  // =====================================
  // DELETE PRODUCT
  // =====================================

  const handleDeleteProduct = async () => {
    if (!deleteProduct) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_URL}/${deleteProduct.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.id !== deleteProduct.id
        )
      );

      setDeleteProduct(null);
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert("Unable to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  // =====================================
  // EDIT PRODUCT
  // =====================================

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  // =====================================
  // ADD PRODUCT
  // =====================================

  const handleAddProduct = () => {
    navigate("/admin/products/add");
  };



  // total product price


  const totalproductprice = products.price
  

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f8f5f6]
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">
          <div
            className="
              w-10
              h-10
              mx-auto
              rounded-full
              border-4
              border-[#ad4058]
              border-t-transparent
              animate-spin
            "
          />

          <p className="mt-4 text-gray-500">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f8f5f6]
          p-6
          lg:p-8
        "
      >
        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-100
            p-10
            text-center
          "
        >
          <AlertCircle
            size={45}
            className="mx-auto text-red-500"
          />

          <h2
            className="
              mt-4
              text-xl
              font-semibold
              text-[#423640]
            "
          >
            Something went wrong
          </h2>

          <p className="mt-2 text-gray-500">
            {error}
          </p>

          <button
            onClick={fetchProducts}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-[#ad4058]
              text-white
              hover:bg-[#852f43]
              transition
            "
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <div
      className="
        min-h-screen
        bg-[#f8f5f6]
        p-6
        lg:p-8
      "
    >. 
      {/* =================================
          HEADER
      ================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
          mb-8
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
              text-[#423640]
            "
          >
            Products
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your Bonvivant products.
          </p>
        </div>

        <button
          onClick={handleAddProduct}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#ad4058]
            px-5
            py-3
            font-medium
            text-white
            shadow-sm
            hover:bg-[#852f43]
            transition
          "
        >
          <Plus size={19} />
          Add Product
        </button>
      </div>

      {/* =================================
          SUMMARY
      ================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-4
          mb-6
        "
      >
        {/* Total Products */}

        <div
          className="
            rounded-2xl
            bg-white
            border
            border-gray-100
            p-5
            shadow-sm
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <div>
              <p className="text-sm text-gray-500">
                Total Products
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-[#423640]
                "
              >
                {products.length}
              </p>
            </div>

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-[#ad4058]/10
                flex
                items-center
                justify-center
              "
            >
              <Package
                size={22}
                className="text-[#ad4058]"
              />
            </div>
          </div>
        </div>

        {/* In Stock */}

        <div
          className="
            rounded-2xl
            bg-white
            border
            border-gray-100
            p-5
            shadow-sm
          "
        >
          <p className="text-sm text-gray-500">
            In Stock
          </p>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-green-600
            "
          >
            {
              products.filter(
                (product) =>
                  Number(product.stock) > 0
              ).length
            }
          </p>
        </div>

        {/* Out of Stock */}

        <div
          className="
            rounded-2xl
            bg-white
            border
            border-gray-100
            p-5
            shadow-sm
          "
        >
          <p className="text-sm text-gray-500">
            Out of Stock
          </p>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-red-500
            "
          >
            {
              products.filter(
                (product) =>
                  Number(product.stock) === 0
              ).length
            }
          </p>
        </div>
        <div>
          <h1>total products price $ {totalproductprice}</h1>
        </div>
      </div>

      {/* =================================
          SEARCH + FILTER
      ================================= */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-100
          p-4
          mb-6
          shadow-sm
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            md:flex-row
          "
        >
          {/* Search */}

          <div className="relative flex-1">
            <Search
              size={19}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setpagination(1);
                }}
              
              placeholder="Search products..."
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-3
                pl-11
                pr-4
                text-sm
                outline-none
                transition
                focus:border-[#ad4058]
                focus:ring-2
                focus:ring-[#ad4058]/10
              " 
            />
          </div>

          {/* Category */}

          <select
            value={category}
            onChange={(event) => {
            setCategory(event.target.value);
            setpagination(1);
            }}
            className="
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              px-4
              py-3
              text-sm
              text-gray-600
              outline-none
              focus:border-[#ad4058]
            "
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          {/* Refresh */}

          <button
            onClick={fetchProducts}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-200
              px-5
              py-3
              text-sm
              font-medium
              text-[#423640]
              hover:bg-gray-50
              transition
            "
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>
      </div>

      {/* =================================
          PRODUCT TABLE
      ================================= */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          bg-white
          border
          border-gray-100
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-100
            px-6
            py-5
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-semibold
                text-[#423640]
              "
            >
              All Products
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-400
              "
            >
              Showing {filteredProducts.length} of{" "}
              {products.length} products
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div
            className="
              px-6
              py-16
              text-center
            "
          >
            <Package
              size={45}
              className="
                mx-auto
                text-gray-300
              "
            />

            <h3
              className="
                mt-4
                text-lg
                font-semibold
                text-[#423640]
              "
            >
              No products found
            </h3>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              Try changing your search or category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">

                  {/* Product */}

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Product
                  </th>

                  {/* Category */}

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Category
                  </th>

                  {/* Price */}

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Price
                  </th>

                  {/* Stock */}

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Stock
                  </th>

                  {/* Actions */}

                  <th
                    className="
                      px-6
                      py-4
                      text-right
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>
                {currentProducts.map((product) => {
                  const stock = Number(product.stock);

                  const isOutOfStock = stock === 0;

                  const isLowStock =
                    stock > 0 && stock <= 5;

                  return (
                    <tr
                      key={product.id}
                      className="
                        border-t
                        border-gray-100
                        hover:bg-gray-50/70
                        transition
                      "
                    >
                      {/* Product */}

                      <td className="px-6 py-4">
                        <div
                          className="
                            flex
                            items-center
                            gap-4
                            min-w-[260px]
                          "
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="
                              h-14
                              w-14
                              rounded-xl
                              object-cover
                              border
                              border-gray-100
                            "
                          />

                          <div>
                            <p
                              className="
                                font-semibold
                                text-[#423640]
                              "
                            >
                              {product.name}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-gray-400
                              "
                            >
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}

                      <td className="px-6 py-4">
                        <span
                          className="
                            rounded-full
                            bg-[#ad4058]/10
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-[#ad4058]
                          "
                        >
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          font-semibold
                          text-[#423640]
                        "
                      >
                        ₹{product.price}
                      </td>

                      {/* Stock */}

                      <td className="px-6 py-4">
                        {isOutOfStock ? (
                          <span
                            className="
                              inline-flex
                              rounded-full
                              bg-red-100
                              px-3
                              py-1
                              text-xs
                              font-medium
                              text-red-600
                            "
                          >
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span
                            className="
                              inline-flex
                              rounded-full
                              bg-orange-100
                              px-3
                              py-1
                              text-xs
                              font-medium
                              text-orange-600
                            "
                          >
                            {stock} left
                          </span>
                        ) : (
                          <span
                            className="
                              inline-flex
                              rounded-full
                              bg-green-100
                              px-3
                              py-1
                              text-xs
                              font-medium
                              text-green-600
                            "
                          >
                            {stock} in stock
                          </span>
                        )}
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-4">
                        <div
                          className="
                            flex
                            justify-end
                            items-center
                            gap-2
                          "
                        >
                          {/* Edit */}

                          <button
                            onClick={() =>
                              handleEdit(product.id)
                            }
                            title="Edit Product"
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-gray-200
                              text-gray-500
                              hover:border-[#ad4058]
                              hover:bg-[#ad4058]/10
                              hover:text-[#ad4058]
                              transition
                            "
                          >
                            <Pencil size={17} />
                          </button>

                          {/* Delete */}

                          <button
                            onClick={() =>
                              setDeleteProduct(product)
                            }
                            title="Delete Product"
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-gray-200
                              text-gray-500
                              hover:border-red-300
                              hover:bg-red-50
                              hover:text-red-600
                              transition
                            "
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================
          DELETE CONFIRMATION MODAL
      ================================= */}

      {deleteProduct && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
        >
          <div
            className="
              relative
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-6
              shadow-2xl
            "
          >
            {/* Close */}

            <button
              onClick={() =>
                setDeleteProduct(null)
              }
              disabled={deleting}
              className="
                absolute
                right-4
                top-4
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-gray-400
                hover:bg-gray-100
                hover:text-gray-600
              "
            >
              <X size={19} />
            </button>

            {/* Icon */}

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-red-100
              "
            >
              <Trash2
                size={23}
                className="text-red-600"
              />
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-bold
                text-[#423640]
              "
            >
              Delete Product?
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-gray-500
              "
            >
              Are you sure you want to delete{" "}
              <span
                className="
                  font-semibold
                  text-[#423640]
                "
              >
                {deleteProduct.name}
              </span>
              ? This action cannot be undone.
            </p>

            {/* Buttons */}

            <div
              className="
                mt-6
                flex
                justify-end
                gap-3
              "
            >
              <button
                onClick={() =>
                  setDeleteProduct(null)
                }
                disabled={deleting}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-gray-600
                  hover:bg-gray-50
                  transition
                "
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-white
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  transition
                "
              >
                {deleting ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete
                  </>
                )}
              </button>
              
            </div>
            
          </div>
        </div>
      )}
      <div className="mt-6">
  <Pagination
    currentPage={pagination}
    totalPages={totalPages}
    onPageChange={setpagination}
  />
</div>
     
    </div>
  );
};

export default Products;
