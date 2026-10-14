
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
  className="
    min-h-screen
    bg-[url('src/assets/sweet.jpg')]
    bg-cover
    bg-center
    bg-no-repeat
    flex
    items-center
    justify-center
    px-6
    relative
    overflow-hidden
    rounded-[40px]
  "
>

    <div className="absolute inset-0 bg-black/70"></div>
      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl">

        {/* Small heading */}
        <p
          className="
            text-[#e58a9b]
            uppercase
            tracking-[0.35em]
            text-sm
            md:text-base
            font-semibold
            mb-5
          "
        >
          Welcome to
        </p>

        {/* Main heading */}
        <h1
          className="
            giflika
            text-6xl
            sm:text-7xl
            md:text-8xl
            text-white
            leading-none
            mb-5
            drop-shadow-lg
          "
        >
          Bonvivant
        </h1>

        {/* Subtitle */}
        <h2
          className="
            boldena
            text-2xl
            md:text-3xl
            text-[#f3dfe3]
            tracking-wide
            mb-6
          "
        >
          Cakes & Pastries
        </h2>

        {/* Description  */}
        <p
          className="
            text-[#eee5e9]
            text-base
            md:text-lg
            leading-relaxed
            max-w-xl
            mx-auto
            mb-9
          "
        >
          Freshly baked cakes, cupcakes, and pastries
          <br className="hidden md:block" />
          delivered fresh to your door.
        </p>

        {/* Button */}
        <Link
          to="/products"
          className="
            inline-flex
            items-center
            justify-center
            px-9
            py-3.5
            rounded-xl
            bg-[#ad4058]
            text-white
            font-semibold
            tracking-wide
            shadow-lg
            shadow-[#ad4058]/20
            hover:bg-[#852f43]
            hover:shadow-xl
            hover:shadow-[#ad4058]/30
            hover:-translate-y-1
            transition-all
            duration-300
          "
        >
          Shop Now
        </Link>

      </div>
    </div>
  );
};

export default Home;