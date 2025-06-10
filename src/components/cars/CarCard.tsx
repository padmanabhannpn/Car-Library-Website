import React, { useState, memo } from "react";
import { CarListItem } from "../../types/car";
import { DeleteIcon } from "../icons/Icons";
import { Title, BodyText, Caption } from "../common/Typography";
import Tag from "../common/Tag";
import { NoCarImageIcon } from "../../components/icons/Icons";

interface CarCardProps {
  car: CarListItem;
  onClick: (id: number) => void;
  onDelete: (id: number, name: string) => void;
}

const CarCard: React.FC<CarCardProps> = memo(({ car, onClick, onDelete }) => {
  const truncateText = (
    text: string | undefined | null,
    maxLength: number
  ): string => {
    if (!text) return "";
    const textStr = String(text);
    if (textStr.length <= maxLength) return textStr;
    return `${textStr.substring(0, maxLength)}...`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    onDelete(car.id, car.name);
  };

  // Determine tag variant based on car type
  const tagVariant =
    car.carType?.toLowerCase() === "manual" ? "manual" : "automatic";
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-white relative rounded-[20px] shadow-[-6px_-2px_12px_0px_rgba(0,0,0,0.04),6px_12px_12px_0px_rgba(0,0,0,0.02)] cursor-pointer hover:translate-y-[-4px] transition-all duration-300"
      onClick={() => onClick(car.id)}
    >
      <div className="flex flex-col w-full">
        {/* Image Section with Transmission Tag */}
        <div className="relative h-[180px] w-full overflow-hidden rounded-t-[20px]">
          {!imageError && car.imageUrl ? (
            <img
              src={car.imageUrl}
              alt={car.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-[180px]  bg-[#FAF7FF] flex items-center justify-center">
              <NoCarImageIcon className=" inset-0 w-[80px] h-[80px] object-cover" />
            </div>
          )}

          {/* Transmission Tag (Manual/Automatic) */}
          {car.carType && (
            <Tag variant={tagVariant} className="absolute top-4 right-4">
              {tagVariant}
            </Tag>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 relative">
          <div className="flex">
            <div className="w-[90%] ">
              {/* Title and Description */}
              <Title className="mb-2 pr-8 mt-2 line-clamp-1">{car.name}</Title>
              <BodyText className="text-gray-700 mb-3 line-clamp-2">
                {car.description ? truncateText(car.description, 85) : ""}
              </BodyText>
            </div>
            <div className="w-[10%] ">
              {/* Delete Button */}
              <button
                onClick={handleDelete}
                className="absolute top-5 right-5 text-red-500 hover:text-red-700 focus:outline-none p-2 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete car"
              >
                <DeleteIcon size={18} />
              </button>
            </div>
          </div>

          {/* Added Date - now using optional createdAt from updated type */}
          {car.createdAt && (
            <Caption className="text-gray-500">
              Added:{" "}
              {new Date(car.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Caption>
          )}
        </div>
      </div>
    </div>
  );
});

export default CarCard;
