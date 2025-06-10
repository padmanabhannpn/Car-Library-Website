import React, { useEffect, useState } from "react";
import { Car } from "../../types/car";
import Modal from "../common/Modal";
import { Heading, BodyText, Caption, Title } from "../common/Typography";
import { CrossIcon } from "../icons/Icons";
import Tag from "../common/Tag";
import DeleteConfirmation from "./DeleteConfirmation";
import { NoCarImageIcon } from "../../components/icons/Icons";

interface CarDetailsProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number, name: string) => void;
}

const CarDetails: React.FC<CarDetailsProps> = ({
  car,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (car?.imageUrl) {
      setImageError(false);
    }
  }, [car?.imageUrl]);

  if (!car) return null;

  // Format the date to match the Figma design
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options).replace(",", " |");
  };

  const handleDeleteConfirm = () => {
    onDelete(car.id, car.name);
    setShowDeleteConfirmation(false);
    onClose();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const tagVariant =
    car.carType?.toLowerCase() === "manual" ? "manual" : "automatic";

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} cardetailspage={true}>
        <div className="relative px-8 py-6 max-w-4xl w-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <CrossIcon size={20} />
          </button>

          {/* Car Title */}
          <Heading className="mb-6 text-[56px] font-bold font-nunito text-[#000000]">
            {car.name}
          </Heading>

          {/* Car Image */}
          <div className="w-full h-[320px] mb-6 rounded-xl overflow-hidden bg-[#FAF7FF]">
            {!imageError && car.imageUrl ? (
              <img
                src={car.imageUrl}
                alt={car.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="w-full  bg-[#FAF7FF] flex items-center justify-center"
                onLoad={() => setImageError(false)}
              >
                <NoCarImageIcon className=" inset-0 w-[180px] h-[180px] object-cover" />
              </div>
            )}
          </div>

          {/* Transmission Badge */}
          <div className="mb-6">
            <Tag
              variant={tagVariant}
              className="px-4 py-1.5 text-sm font-medium  tracking-wide"
            >
              {car.carType.charAt(0).toUpperCase() + car.carType.slice(1) ||
                "Unknown"}
            </Tag>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <Title className="text-sm font-extrabold font-nunito text-[#000000] mb-2 uppercase tracking-wider">
              Description
            </Title>
            <BodyText className="text-[#000000] font-regular font-nunito text-base leading-6">
              {car.description}
            </BodyText>
          </div>

          {/* Specifications Section */}
          <div className="mb-8">
            <Title className="text-sm font-extrabold font-nunito text-[#000000] mb-3 uppercase tracking-wider">
              Specifications
            </Title>
            <div className="flex flex-wrap gap-2">
              {car.tags && car.tags.length > 0 ? (
                car.tags.map((tag, index) => (
                  <Tag
                    key={index}
                    variant="nooutline"
                    className="px-3 py-1.5 text-sm font-regular font-nunito text-[#000000]"
                  >
                    {tag}
                  </Tag>
                ))
              ) : (
                <Tag
                  variant="nooutline"
                  className="px-3 py-1.5 text-sm font-regular font-nunito text-[#000000]"
                >
                  No specifications available
                </Tag>
              )}
            </div>
          </div>

          {/* Last Updated  */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <Caption className="text-xs text-gray-400 text-sm font-regular italic font-nunito">
              Last updated:{" "}
              {car.createdAt ? formatDate(car.createdAt) : "Unknown"}
            </Caption>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteConfirm}
        carName={car.name}
      />
    </>
  );
};

export default CarDetails;
