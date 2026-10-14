
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchProducts,
} from "../../redux/slices/productSlice";

import ProductCard from "../../components/ProductCard/ProductCard";

// Pagination component
import Pagination from "../../components/Pagination/Pagination";

const Products = () => {
  const dispatch = useDispatch();

  // ========================================
  // REDUX
  // ========================================

  const {
    products = [],
    loading,
    error,
  } = useSelector(
    (state) => state.products
  );

  // ========================================
  // SEARCH
  // ========================================

  const [search, setSearch] = useState("");

  // ========================================
  // CATEGORY
  // ========================================

  const [category, setCategory] = useState("All");

  // ========================================
  // SORT
  // ========================================

  const [sort, setSort] = useState("");

  // ========================================
  // PAGINATION
  // ========================================

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  // ========================================
  // FETCH PRODUCTS
  // ========================================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ========================================
  // CATEGORIES
  // ========================================

  const categories = useMemo(() => {
    const safeProducts =
      Array.isArray(products)
        ? products
        : [];

    return [
      "All",
      ...new Set(
        safeProducts.map(
          (product) =>
            product.category
        )
      ),
    ];
  }, [products]);

  // ========================================
  // FILTER + SORT
  // ========================================

  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products)
      ? [...products]
      : [];

    // SEARCH
    if (search.trim()) {
      result = result.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }

    // CATEGORY
    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    // SORT
    if (sort === "low") {
      result.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );
    }

    if (sort === "high") {
      result.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b.rating) -
          Number(a.rating)
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    sort,
  ]);

  // ========================================
  // RESET PAGINATION
  // ========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    category,
    sort,
  ]);

  // ========================================
  // PAGINATION CALCULATION
  // ========================================

  const totalPages = Math.ceil(
    filteredProducts.length /
      productsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >
        <p
          className="
            text-[#ad4058]
            font-semibold
          "
        >
          Loading products...
        </p>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-6
        "
      >
        <div
          className="
            text-center
            bg-red-50
            border
            border-red-200
            rounded-xl
            p-6
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              text-red-600
            "
          >
            Failed to load products
          </h2>

          <p
            className="
              text-sm
              text-red-500
              mt-2
            "
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div
      className="
        min-h-screen
        bg-[#f8f5f6]
        px-6
        py-10
      "
    >

      {/* HEADER */}

      <div
        className="
          max-w-7xl
          mx-auto
          mb-8
        "
      >
        <h1
          className="
            text-4xl
            font-bold
            text-[#423640]
          "
        >
          Cakes & Pastries
        </h1>

        <p
          className="
            text-gray-500
            mt-2
          "
        >
          Freshly baked treats
          made with love.
        </p>
      </div>

      {/* FILTERS */}

      <div
        className="
          max-w-7xl
          mx-auto
          flex
          flex-col
          md:flex-row
          gap-4
          mb-8
        "
      >

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search cakes and pastries..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            flex-1
            px-4
            py-3
            rounded-xl
            border
            border-gray-200
            bg-white
            outline-none
            focus:ring-2
            focus:ring-[#ad4058]
          "
        />

        {/* CATEGORY */}

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          className="
            px-4
            py-3
            rounded-xl
            border
            border-gray-200
            bg-white
            outline-none
          "
        >
          {categories.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>

        {/* SORT */}

        <select
          value={sort}
          onChange={(e) =>
            setSort(
              e.target.value
            )
          }
          className="
            px-4
            py-3
            rounded-xl
            border
            border-gray-200
            bg-white
            outline-none
          "
        >
          <option value="">
            Sort By
          </option>

          <option value="low">
            Price: Low to High
          </option>

          <option value="high">
            Price: High to Low
          </option>

          <option value="rating">
            Highest Rating
          </option>
        </select>
      </div>

      {/* PRODUCTS */}

      {currentProducts.length > 0 ? (
        <div
          className="
            max-w-7xl
            mx-auto
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-6
          "
        >
          {currentProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </div>
      ) : (
        /* EMPTY */
        <div
          className="
            text-center
            py-20
            text-gray-500
          "
        >
          No products found.
        </div>
      )}

      {/* PAGINATION */}

      {filteredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

    </div>
  );
};

export default Products;
