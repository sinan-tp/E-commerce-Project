
const Loader = () => (
  <div className="
    min-h-screen
    flex
    flex-col
    items-center
    justify-center
    bg-[#f7f1f3]
  ">

    {/* Animated Image */}
    <img
      src="src/assets/image.png"
      alt="Loading"
      className="
        w-50
        h-30
        object-contain
        animate-bounce
      "
    />

    {/* Loading Text */}
    <p className="
      mt-5
      text-lg
      font-semibold
      text-[#ad4058]
      animate-pulse
    ">
      Loading...
    </p>

  </div>
);

export default Loader;

