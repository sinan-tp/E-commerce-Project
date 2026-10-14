
const SearchBar = ({ value, onChange }) => (
  <div className="w-full max-w-xl">
    <input
      type="text"
      placeholder="Search cakes and pastries..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        px-5
        py-3.5
        rounded-xl
        border
        border-gray-200
        bg-white
        text-[#423640]
        placeholder:text-gray-400
        shadow-sm
        outline-none
        transition-all
        duration-300
        focus:border-[#ad4058]
        focus:ring-2
        focus:ring-[#ad4058]/20
        hover:shadow-md
      "
    />
  </div>
);

export default SearchBar;