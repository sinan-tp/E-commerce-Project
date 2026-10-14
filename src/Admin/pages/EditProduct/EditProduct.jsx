import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Image as ImageIcon,
  Package,
  RefreshCw,
  Save,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:3000/products";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  // ================================
  // FETCH PRODUCT
  // ================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const product = await response.json();

        setForm({
          name: product.name || "",
          category: product.category || "",
          price: product.price ?? "",
          stock: product.stock ?? "",
          image: product.image || "",
          description: product.description || "",
        });
      } catch (error) {
        console.error("Fetch product error:", error);
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ================================
  // HANDLE CHANGE
  // ================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================================
  // SUBMIT
  // ================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

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
      setSaving(true);

      const updatedProduct = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image.trim(),
        description: form.description.trim(),
      };

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Update product error:", error);
      setError("Unable to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f8f5f6]">
        <div className="text-center">
          <div
            className="
              mx-auto flex h-11 w-11 items-center justify-center
              rounded-full border-4 border-[#ad4058]
              border-t-transparent animate-spin
            "
          />

          <p className="mt-4 text-sm text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // ================================
  // PRODUCT NOT FOUND
  // ================================

  if (error && !form.name) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#f8f5f6] p-6 lg:p-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Package size={26} className="text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#423640]">
            Product Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            The product could not be loaded.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="
              mt-6 inline-flex items-center gap-2
              rounded-xl bg-[#ad4058] px-5 py-3
              text-sm font-medium text-white
              transition hover:bg-[#852f43]
            "
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-[#f8f5f6] p-6 lg:p-8">

      {/* ================================
          HEADER
      ================================= */}

      <div className="mb-8 flex items-center gap-4">

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          disabled={saving}
          className="
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-xl bg-white text-gray-500 shadow-sm
            transition hover:bg-gray-50 hover:text-[#ad4058]
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-[#423640]">
            Edit Product
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update your product information.
          </p>
        </div>
      </div>

      {/* ================================
          ERROR
      ================================= */}

      {error && (
        <div
          className="
            mb-6 rounded-xl border border-red-100
            bg-red-50 px-5 py-4 text-sm text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* ================================
          FORM
      ================================= */}

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* =================================
              LEFT - PRODUCT INFORMATION
          ================================== */}

          <div
            className="
              rounded-2xl border border-gray-100
              bg-white p-6 shadow-sm lg:p-8
            "
          >

            {/* CARD HEADER */}

            <div className="mb-7 flex items-center gap-3">

              <div
                className="
                  flex h-11 w-11 shrink-0 items-center
                  justify-center rounded-xl bg-[#ad4058]/10
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

                <p className="mt-1 text-sm text-gray-400">
                  Update the basic product details.
                </p>
              </div>

            </div>

            {/* PRODUCT NAME */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-600"
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
                  w-full rounded-xl border border-gray-200
                  bg-white px-4 py-3 text-sm text-[#423640]
                  outline-none transition
                  placeholder:text-gray-400
                  focus:border-[#ad4058]
                  focus:ring-2 focus:ring-[#ad4058]/10
                "
              />
            </div>

            {/* CATEGORY */}

            <div className="mt-5">

              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-600"
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
                  w-full rounded-xl border border-gray-200
                  bg-white px-4 py-3 text-sm text-[#423640]
                  outline-none transition
                  focus:border-[#ad4058]
                  focus:ring-2 focus:ring-[#ad4058]/10
                "
              >
                <option value="">
                  Select Category
                </option>

                <option value="Birthday Cakes">
                  Birthday Cakes
                </option>

                <option value="Fruit Cakes">
                  Fruit Cakes
                </option>

                <option value="Chocolate Cakes">
                  Chocolate Cakes
                </option>

                <option value="Cupcakes">
                  Cupcakes
                </option>

                <option value="Pastries">
                  Pastries
                </option>

                <option value="Specialty Cakes">
                  Specialty Cakes
                </option>

                <option value="Cheesecakes">
                  Cheesecakes
                </option>

                <option value="Brownies">
                  Brownies
                </option>

                <option value="Desserts">
                  Desserts
                </option>
              </select>

            </div>

            {/* PRICE + STOCK */}

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* PRICE */}

              <div>

                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  Price *
                </label>

                <div className="relative">

                  <span
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2 text-sm text-gray-400
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
                      w-full rounded-xl border border-gray-200
                      bg-white px-4 py-3 pl-9
                      text-sm text-[#423640]
                      outline-none transition
                      placeholder:text-gray-400
                      focus:border-[#ad4058]
                      focus:ring-2 focus:ring-[#ad4058]/10
                    "
                  />

                </div>
              </div>

              {/* STOCK */}

              <div>

                <label
                  htmlFor="stock"
                  className="mb-2 block text-sm font-medium text-gray-600"
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
                    w-full rounded-xl border border-gray-200
                    bg-white px-4 py-3
                    text-sm text-[#423640]
                    outline-none transition
                    placeholder:text-gray-400
                    focus:border-[#ad4058]
                    focus:ring-2 focus:ring-[#ad4058]/10
                  "
                />

              </div>

            </div>

            {/* PRODUCT ID */}

            <div
              className="
                mt-6 rounded-xl bg-[#f8f5f6]
                px-4 py-3
              "
            >
              <div className="flex items-center justify-between">

                <span className="text-xs font-medium text-gray-400">
                  Product ID
                </span>

                <span className="text-sm font-semibold text-[#423640]">
                  #{id}
                </span>

              </div>
            </div>

          </div>

          {/* =================================
              RIGHT - IMAGE & DESCRIPTION
          ================================== */}

          <div className="space-y-6">

            {/* IMAGE CARD */}

            <div
              className="
                rounded-2xl border border-gray-100
                bg-white p-6 shadow-sm lg:p-8
              "
            >

              <div className="mb-7">

                <h2 className="font-semibold text-[#423640]">
                  Image
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Update the product image.
                </p>

              </div>

              {/* IMAGE URL */}

              <div>

                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-medium text-gray-600"
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
                    w-full rounded-xl border border-gray-200
                    bg-white px-4 py-3
                    text-sm text-[#423640]
                    outline-none transition
                    placeholder:text-gray-400
                    focus:border-[#ad4058]
                    focus:ring-2 focus:ring-[#ad4058]/10
                  "
                />

                <p className="mt-2 text-xs text-gray-400">
                  Paste a direct image URL.
                </p>

              </div>

              {/* IMAGE PREVIEW */}

              <div className="mt-5">

                <p className="mb-2 text-sm font-medium text-gray-600">
                  Image Preview
                </p>

                <div
                  className="
                    flex h-64 w-full items-center
                    justify-center overflow-hidden
                    rounded-xl border border-gray-200
                    bg-gray-50
                  "
                >

                  {form.image ? (
                    <img
                      src={form.image}
                      alt={form.name || "Product preview"}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="text-center text-gray-400">

                      <ImageIcon
                        size={42}
                        className="mx-auto mb-3"
                      />

                      <p className="text-sm">
                        Product image preview
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* DESCRIPTION CARD */}

            <div
              className="
                rounded-2xl border border-gray-100
                bg-white p-6 shadow-sm lg:p-8
              "
            >

              <div className="mb-5">

                <h2 className="font-semibold text-[#423640]">
                  Description
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Update the product description.
                </p>

              </div>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                required
                placeholder="Enter product description..."
                className="
                  w-full resize-none rounded-xl
                  border border-gray-200 bg-white
                  px-4 py-3 text-sm leading-6
                  text-[#423640] outline-none transition
                  placeholder:text-gray-400
                  focus:border-[#ad4058]
                  focus:ring-2 focus:ring-[#ad4058]/10
                "
              />

            </div>

          </div>

        </div>

        {/* ================================
            ACTIONS
        ================================= */}

        <div
          className="
            mt-6 flex flex-col-reverse gap-3
            rounded-2xl border border-gray-100
            bg-white p-6 shadow-sm
            sm:flex-row sm:justify-end
          "
        >

          {/* CANCEL */}

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            disabled={saving}
            className="
              rounded-xl border border-gray-200
              bg-white px-6 py-3
              text-sm font-medium text-gray-600
              transition hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          {/* SAVE */}

          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex items-center justify-center
              gap-2 rounded-xl bg-[#ad4058]
              px-6 py-3 text-sm font-semibold text-white
              transition hover:bg-[#852f43]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {saving ? (
              <>
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditProduct;