
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  User,
  Package,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";

import { logout } from "../../redux/slices/authSlice";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const { items, totalQuantity } = useSelector(
  (state) => state.cart
);
      const wishlistItems = useSelector(
    (state) => state.wishlist.items
    );
    
  
  const dispatch = useDispatch();

  const navLinkClass = ({ isActive }) =>
    `relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200
    ${
      isActive
        ? "text-[#ad4058]"
        : "text-gray-700 hover:text-[#ad4058]"
    }`;

  const handleLogout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmLogout) {
    return;
  }

  dispatch(logout());
  navigate("/login");
};

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">

      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
           <div className="w-10 h-11 rounded-xl overflow-hidden bg-[rgb(173,64,88)]/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <img style={{width:30}} src="src/assets/IMG_3535.PNG"></img>
            </div> 

            <div className="hidden sm:block">
              <h1 className="giflika text-xl text-[#ad4058] leading-none ">
              Bonvivant
              </h1>

              <p className="text-[10px] uppercase tracking-[0.1em] text-gray-400 mt-1">
                cakes & pastries
              </p>
            </div>
          </Link>


         
          <div className="hidden lg:flex items-center gap-1">

            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/products" className={navLinkClass}>
              Shop
            </NavLink>
            
          <NavLink to="/wishlist" className={navLinkClass}>
          <div className="relative">
          <Heart size={17} />
          {user && wishlistItems.length > 0 && (
          <span className="absolute -top-3 -right-3 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#ad4058] text-white text-[10px] font-bold">
          {wishlistItems.length}
          </span>
          )}
          </div>
          Wishlist
          </NavLink>

                <NavLink to="/cart" className={navLinkClass}>
                <div className="relative">
                <ShoppingCart size={18} />
                {user && items.length > 0 && (
                <span className="absolute -top-3 -right-3 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#ad4058] text-white text-[10px] font-bold">
                {items.length}
                </span>
                )} 
                </div>
                Cart
                </NavLink>

            {isAuthenticated && (
              <NavLink to="/orders" className={navLinkClass}>
                <Package size={17} />
                Orders
              </NavLink>
            )}
          </div>


          
          <div className="hidden lg:flex items-center gap-3">

            {isAuthenticated ? (
              <>
                {/* PROFILE */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-50 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-[#ad4058] flex items-center justify-center text-white">
                    <User size={18} />
                  </div>

                  <div className="max-w-[120px]">
                    <p className="text-xs text-gray-400">
                      Welcome
                    </p>

                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user?.name || "User"}
                    </p>
                  </div>
                </Link>

               
              {/* LOGOUT */}
<button
  type="button"
  onClick={handleLogout}
  className="
    flex
    items-center
    gap-2
    px-4
    py-2.5
    rounded-xl
    border
    border-gray-200
    text-gray-600
    text-sm
    font-medium
    hover:bg-red-50
    hover:text-red-500
    hover:border-red-200
    transition-all
  "
>
  <LogOut size={17} />
  Logout
</button>
              </>
            ) : (
              <>
                {/* LOGIN */}
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-700 text-sm font-medium hover:bg-[#ad4058] hover:text-white transition"
                >
                  <LogIn size={17} />
                  Login
                </Link>

                {/* REGISTER */}
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ad4058] text-white text-sm font-semibold hover:bg-[#ad4058] hover:shadow-lg hover:shadow-[#ad4058]/30 transition-all"
                >
                  <UserPlus size={17} />
                  Register
                </Link>
              </>
            )}
          </div>


          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
          >
            {isMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>


        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">

            <div className="flex flex-col gap-1">

              <NavLink
                to="/"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </NavLink>

              <NavLink
                to="/wishlist"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={17} />
                Wishlist
              </NavLink>

              <NavLink
                to="/cart"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart size={17} />
                Cart

                {totalQuantity > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-[#ad4058] text-white text-xs">
                    {totalQuantity}
                  </span>
                )}
              </NavLink>

              {isAuthenticated && (
                <>
                  <NavLink
                    to="/orders"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package size={17} />
                    Orders
                  </NavLink>

                  <NavLink
                    to="/profile"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={17} />
                    {user?.name || "Profile"}
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#ad4058] hover:bg-red-50 rounded-lg text-left"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">

                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>

                 <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#ad4058] hover:bg-[#8f3549] text-white text-sm font-semibold transition-colors"
                  >
                    <UserPlus size={16} />
                    Register
                  </Link>

                </div>
              )}

            </div>
          </div>
        )}

      </nav>
    </header>
  );
};

export default Navbar;

