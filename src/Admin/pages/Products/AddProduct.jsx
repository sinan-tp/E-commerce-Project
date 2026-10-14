import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Image as ImageIcon,
  Package,
  Save,
} from "lucide-react";

const API_URL = "http://localhost:3000/products";

const AddProduct = () => {
  const navigate = useNavigate();

  // =====================================
  // FORM STATE
  // =====================================

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Validation
    if (
      !form.name.trim() ||
      !form.category ||
      form.price === "" ||
      form.stock === "" ||
      !form.image.trim() ||
      !form.description.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (Number(form.price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (Number(form.stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const newProduct = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image.trim(),
        description: form.description.trim(),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Add product error:", error);

      setError(
        "Unable to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // IMAGE ERROR
  // =====================================

  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";
  };

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="min-h-full w-full bg-[#f8f5f6] p-6 lg:p-8">

      {/* =================================
          HEADER
      ================================= */}

      <div className="mb-8 flex items-center gap-4">

        {/* Back Button */}

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          disabled={loading}
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-white
            text-gray-500
            shadow-sm
            transition
            hover:bg-gray-50
            hover:text-[#ad4058]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ArrowLeft size={20} />
        </button>

        {/* Title */}

        <div>
          <h1 className="text-3xl font-bold text-[#423640]">
            Add Product
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add a new cake or pastry to your Bonvivant store.
          </p>
        </div>
      </div>

      {/* =================================
          ERROR MESSAGE
      ================================= */}

      {error && (
        <div
          className="
            mb-6
            rounded-xl
            border
            border-red-100
            bg-red-50
            px-5
            py-4
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* =================================
          MAIN FORM
      ================================= */}

      <form onSubmit={handleSubmit}>

        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-2
          "
        >

          {/* =================================
              LEFT COLUMN
          ================================= */}

          <div
            className="
              rounded-2xl
              border
              border-gray-100
              bg-white
              p-6
              shadow-sm
              lg:p-8
            "
          >

            {/* Section Header */}

            <div className="mb-7 flex items-center gap-3">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#ad4058]/10
                "
              >
                <Package
                  size={22}
                  className="text-[#ad4058]"
                />
              </div>

              <div>
                <h2 className="font-semibold text-[#423640]">
                  Product Information
                </h2>

                <p className="text-sm text-gray-400">
                  Enter the basic product details.
                </p>
              </div>

            </div>

            {/* PRODUCT NAME */}

            <div className="mb-5">

              <label
                htmlFor="name"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-600
                "
              >
                Product Name *
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Chocolate Fudge Cake"
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-[#423640]
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#ad4058]
                  focus:ring-2
                  focus:ring-[#ad4058]/10
                "
              />
            </div>

            {/* CATEGORY + PRICE */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* CATEGORY */}

              <div>

                <label
                  htmlFor="category"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-600
                  "
                >
                  Category *
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-[#423640]
                    outline-none
                    transition
                    focus:border-[#ad4058]
                    focus:ring-2
                    focus:ring-[#ad4058]/10
                  "
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="Birthday Cakes">
                    Birthday Cakes
                  </option>

                  <option value="Chocolate Cakes">
                    Chocolate Cakes
                  </option>

                  <option value="Fruit Cakes">
                    Fruit Cakes
                  </option>

                  <option value="Specialty Cakes">
                    Specialty Cakes
                  </option>

                  <option value="Cheesecakes">
                    Cheesecakes
                  </option>

                  <option value="Cupcakes">
                    Cupcakes
                  </option>

                  <option value="Pastries">
                    Pastries
                  </option>

                  <option value="Brownies">
                    Brownies
                  </option>

                  <option value="Desserts">
                    Desserts
                  </option>
                </select>

              </div>

              {/* PRICE */}

              <div>

                <label
                  htmlFor="price"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-600
                  "
                >
                  Price *
                </label>

                <div className="relative">

                  <span
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      text-gray-400
                    "
                  >
                    ₹
                  </span>

                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="699"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      pl-9
                      text-sm
                      text-[#423640]
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#ad4058]
                      focus:ring-2
                      focus:ring-[#ad4058]/10
                    "
                  />

                </div>

              </div>

            </div>

            {/* STOCK */}

            <div className="mt-5">

              <label
                htmlFor="stock"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-600
                "
              >
                Stock *
              </label>

              <input
                id="stock"
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                required
                placeholder="10"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-[#423640]
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#ad4058]
                  focus:ring-2
                  focus:ring-[#ad4058]/10
                "
              />

            </div>

            {/* IMAGE URL */}

            <div className="mt-5">

              <label
                htmlFor="image"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-600
                "
              >
                Image URL *
              </label>

              <input
                id="image"
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                required
                placeholder="Enter product image URL"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-[#423640]
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#ad4058]
                  focus:ring-2
                  focus:ring-[#ad4058]/10
                "
              />

              <p className="mt-2 text-xs text-gray-400">
                Paste a direct image URL.
              </p>

            </div>

            {/* DESCRIPTION */}

            <div className="mt-5">

              <label
                htmlFor="description"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-600
                "
              >
                Description *
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                required
                placeholder="Soft vanilla sponge layered with smooth whipped cream."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-[#423640]
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#ad4058]
                  focus:ring-2
                  focus:ring-[#ad4058]/10
                "
              />

            </div>

          </div>

          {/* =================================
              RIGHT COLUMN
          ================================= */}

          <div className="space-y-6">

            {/* =================================
                PRODUCT PREVIEW
            ================================= */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-white
                shadow-sm
              "
            >

              <div
                className="
                  border-b
                  border-gray-100
                  px-6
                  py-5
                "
              >
                <h2 className="font-semibold text-[#423640]">
                  Product Preview
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Preview how your product will appear.
                </p>
              </div>

              <div className="p-6">

                {/* IMAGE */}

                <div
                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-100
                    bg-gray-50
                  "
                >
                  {form.image ? (
                    <img
                      src={form.image}
                      alt={
                        form.name || "Product preview"
                      }
                      className="
                        h-64
                        w-full
                        object-cover
                      "
                      onError={handleImageError}
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-64
                        items-center
                        justify-center
                        text-gray-400
                      "
                    >
                      <div className="text-center">

                        <ImageIcon
                          size={42}
                          className="mx-auto mb-3"
                        />

                        <p className="text-sm">
                          Product image preview
                        </p>

                      </div>
                    </div>
                  )}
                </div>

                {/* PRODUCT DETAILS */}

                <div className="mt-5">

                  <p className="text-xs font-medium text-gray-400">
                    {form.category || "Category"}
                  </p>

                  <h3
                    className="
                      mt-1
                      text-xl
                      font-semibold
                      text-[#423640]
                    "
                  >
                    {form.name || "Product Name"}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xl
                      font-bold
                      text-[#ad4058]
                    "
                  >
                    ₹{form.price || "0"}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {form.description ||
                      "Product description will appear here."}
                  </p>

                </div>

              </div>

            </div>

            {/* =================================
                ACTIONS
            ================================= */}

            <div
              className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-6
                shadow-sm
              "
            >

              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#ad4058]
                  px-5
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#852f43]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <span
                      className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-white
                        border-t-transparent
                      "
                    />

                    Adding Product...
                  </>
                ) : (
                  <>
                    <Save size={18} />

                    Add Product
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products")
                }
                disabled={loading}
                className="
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-5
                  py-3.5
                  text-sm
                  font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      </form>

    </div>
  );
};

export default AddProduct;