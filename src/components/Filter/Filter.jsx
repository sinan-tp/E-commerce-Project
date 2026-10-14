
const Filter = ({ categories, selected, onSelect }) => (
  <div className="relative w-full sm:w-56">
    <select
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
      className="
        w-full
        appearance-none
        px-4
        py-3
        pr-10
        rounded-xl
        border
        border-gray-200
        bg-white
        text-[#423640]
        font-medium
        shadow-sm
        outline-none
        cursor-pointer

        hover:border-[#ad4058]
        hover:shadow-md
        focus:border-[#ad4058]
        focus:ring-2
        focus:ring-[#ad4058]/20

        transition-all
        duration-300
      "
    >
      {categories.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>

    {/* Dropdown Arrow */}
    <div
      className="
        pointer-events-none
        absolute
        right-4
        top-1/2
        -translate-y-1/2
        text-[#ad4058]
        text-sm
      "
    >
      ▼
    </div>
  </div>
);

export default Filter;
