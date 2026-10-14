import React from "react";

const AdminCard = ({
  title,
  value,
  icon: Icon,
  description,
}) => {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        p-6
        border
        border-gray-100
        shadow-sm
        hover:shadow-md
        transition-all
        duration-200
      "
    >
      <div className="flex items-center justify-between">

        {/* Left */}
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#423640]">
            {value}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Icon */}
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-[#ad4058]/10
          "
        >
          {Icon && (
            <Icon
              size={24}
              className="text-[#ad4058]"
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminCard;