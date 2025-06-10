import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CarService } from "../services/api";
import Background from "../components/common/Background";
import { Heading } from "../components/common/Typography";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Header from "../components/layout/Header";
import {
  CheckIcon,
  UnCheckIcon,
  SelectIcon,
  UnSelectIcon,
} from "../components/icons/Icons";

const AddCarPage: React.FC = () => {
  const navigate = useNavigate();
  const [carTypes, setCarTypes] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableSpecifications, setAvailableSpecifications] = useState<
    string[]
  >([
    "Engine type",
    "Displacement",
    "Fuel Type",
    "Mileage",
    "Seats",
    "Horsepower",
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    carType: "",
    tags: [] as string[],
    specifications: [] as string[],
  });

  const [errors, setErrors] = useState({
    name: "",
    carType: "",
    CarTag: "",
  });

  // Car Type dropdown state
  const [carTypeDropdownOpen, setCarTypeDropdownOpen] = useState(false);

  // Specifications dropdown state
  const [specificationsDropdownOpen, setSpecificationsDropdownOpen] =
    useState(false);

  useEffect(() => {
    // Fetch car types and tags when component mounts
    const fetchFilters = async () => {
      try {
        const carTypes = await CarService.getCarTypes();
        setCarTypes(carTypes);

        const tags = await CarService.getCarTags();
        setAvailableTags(tags);
      } catch (error: any) {
        if (error.response) {
          // Server responded with 400 or other error

          alert(
            `Error ${error.response.status}: ${
              error.response.data?.message || "Bad Request"
            }`
          );
        } else if (error.request) {
          // No response received
          console.error("No response received:", error.request);
          alert("No response received from the server.");
        } else {
          // Something went wrong setting up the request
          console.error("Unexpected error:", error.message);
          alert("Unexpected error occurred");
        }
        // console.error('Failed to load filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error if field is filled
    if (name === "name" && value.trim() !== "") {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const toggleCarType = (carType: string) => {
    setFormData((prev) => ({ ...prev, carType }));
    setCarTypeDropdownOpen(false);

    // Clear error if car type is selected
    if (carType) {
      setErrors((prev) => ({ ...prev, carType: "" }));
    }
  };

  const toggleSpecification = (specification: string) => {
    if (specification) {
      setErrors((prev) => ({ ...prev, CarTag: "" }));
    }

    setFormData((prev) => {
      const isAlreadySelected = prev.specifications.includes(specification);

      if (isAlreadySelected) {
        return {
          ...prev,
          specifications: prev.specifications.filter(
            (spec) => spec !== specification
          ),
        };
      } else {
        return {
          ...prev,
          specifications: [...prev.specifications, specification],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      name: formData.name.trim() === "" ? "Car name is required" : "",
      carType: formData.carType === "" ? "Car type is required" : "",
      CarTag: formData.specifications.length === 0 ? "Car tag is required" : "",
    };

    setErrors(newErrors);

    // If there are errors, don't submit
    if (newErrors.name || newErrors.carType || newErrors.CarTag) {
      return;
    }

    // try {
    //    await CarService.createCar({
    //     name: formData.name,
    //     description: formData.description,
    //     imageUrl: formData.imageUrl,
    //     carType: formData.carType,
    //     tags: formData.specifications,
    //     // specifications: formData.specifications
    //   });

    //   // Redirect back to home page
    //   navigate('/');
    // } catch (error) {
    //   alert()
    //   console.error('Error adding car:', error);
    // }

    try {
      await CarService.createCar({
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        carType: formData.carType,
        tags: formData.specifications,
      });

      navigate("/");
    } catch (error: any) {
      if (error.response) {
        // Server responded with 400 or other error

        alert(
          `Error ${error.response.status}: ${
            error.response.data?.message || "Bad Request"
          }`
        );
      } else if (error.request) {
        // No response received
        console.error("No response received:", error.request);
        alert("No response received from the server.");
      } else {
        // Something went wrong setting up the request
        console.error("Unexpected error:", error.message);
        alert("Unexpected error occurred");
      }
    }
  };

  const removeSpecification = (specification: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter(
        (spec) => spec !== specification
      ),
    }));
  };

  return (
    <Background variant="light" className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Title */}
          <div className="w-full md:w-1/4">
            <Heading className="text-3xl font-bold font-nunito" as="h1">
              Add Car
            </Heading>
          </div>

          {/* Right column - Form */}
          <div className="w-full md:w-1/2 bg-white shadow-sm rounded-[20px] p-8">
            <form onSubmit={handleSubmit}>
              {/* Car Name Input */}
              <div className="mb-6">
                <div className="flex justify-between mb-1 ">
                  <label className="block text-sm font-regular font-nunito text-black">
                    Car name<span className="text-red-500">*</span>
                  </label>
                  {errors.name && (
                    <span className="text-red-500 text-xs">{errors.name}</span>
                  )}
                </div>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  maxLength={50}
                  placeholder="Enter car name"
                  className={`w-full rounded-[51px] ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/* Description Textarea */}
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-regular font-nunito text-black">
                    Description
                  </label>

                  <span className="text-gray-400 text-xs">
                    {formData.description.length}/280 char
                  </span>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter car description"
                  rows={5}
                  maxLength={280}
                  className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#9370DB]/30 focus:border-[#9370DB]"
                />
              </div>

              {/* Car Type Dropdown */}
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-regular font-nunito text-black">
                    Car type<span className="text-red-500">*</span>
                  </label>
                  {errors.carType && (
                    <span className="text-red-500 text-xs">
                      {errors.carType}
                    </span>
                  )}

                  {/* {!errors.carType && <span className="text-red-500 text-xs">Mandatory!</span>} */}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    className={`w-full px-4 py-2 text-left border ${
                      errors.carType ? "border-red-500" : "border-gray-300"
                    } rounded-[51px] focus:outline-none focus:ring-2 focus:ring-[#9370DB]/30 focus:border-[#9370DB] flex justify-between items-center`}
                    onClick={() => setCarTypeDropdownOpen(!carTypeDropdownOpen)}
                  >
                    {formData.carType || "Select"}
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        carTypeDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>

                  {carTypeDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="py-1 max-h-60 overflow-y-auto">
                        {carTypes.map((type) => (
                          <div
                            key={type}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => toggleCarType(type)}
                          >
                            {formData.carType === type ? (
                              <CheckIcon size={24} />
                            ) : (
                              <UnCheckIcon size={20} />
                            )}
                            <input
                              type="radio"
                              checked={formData.carType === type}
                              readOnly
                              className="appearance-none h-4 w-4 text-[#9370DB] focus:ring-[#9370DB]"
                            />
                            <label className="ml-2 block text-[14px] font-regular font-nunito text-black">
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications Dropdown */}
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-regular font-nunito text-black">
                    Specifications<span className="text-red-500">*</span>
                  </label>
                  {errors.CarTag && (
                    <span className="text-red-500 text-xs">
                      {errors.CarTag}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    className={`w-full px-4 py-2 text-left border  ${
                      errors.CarTag ? "border-red-500" : "border-gray-300"
                    } rounded-[51px] focus:outline-none focus:ring-2 focus:ring-[#9370DB]/30 focus:border-[#9370DB] flex justify-between items-center`}
                    onClick={() =>
                      setSpecificationsDropdownOpen(!specificationsDropdownOpen)
                    }
                  >
                    {formData.specifications.length > 0
                      ? `${formData.specifications.length} selected`
                      : "Select"}
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        specificationsDropdownOpen ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>

                  {specificationsDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="py-1 max-h-60 overflow-y-auto">
                        {availableSpecifications.map((spec) => (
                          <div
                            key={spec}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => toggleSpecification(spec)}
                          >
                            <input
                              type="checkbox"
                              checked={formData.specifications.includes(spec)}
                              readOnly
                              className="appearance-none text-[#9370DB] focus:ring-[#9370DB]"
                            />
                            {/* Custom image checkbox */}
                            {formData.specifications.includes(spec) ? (
                              <SelectIcon size={24} />
                            ) : (
                              <UnSelectIcon size={20} />
                            )}
                            <label className="ml-2 block text-sm text-[14px] font-regular font-nunito text-black">
                              {spec}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Specifications Tags */}
                {formData.specifications.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.specifications.map((spec) => (
                      <div
                        key={spec}
                        className="bg-[rgba(155,114,210,0.1)] rounded-lg px-3 py-1 text-sm flex items-center"
                      >
                        <p className="text-[#000000] font-regular font-nunito text-base">
                          {" "}
                          {spec}
                        </p>
                        <button
                          type="button"
                          className="ml-1 text-[#000000] hover:text-gray-700"
                          onClick={() => removeSpecification(spec)}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags Selection */}
              {/* <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {availableTags.map(tag => (
                      <div 
                        key={tag}
                        onClick={() => {
                          const isSelected = formData.tags.includes(tag);
                          setFormData(prev => ({
                            ...prev,
                            tags: isSelected 
                              ? prev.tags.filter(t => t !== tag)
                              : [...prev.tags, tag]
                          }));
                        }}
                        className={`cursor-pointer px-3 py-1 rounded-full text-sm ${formData.tags.includes(tag) 
                          ? 'bg-[#9370DB] text-white' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {formData.tags.length} tag{formData.tags.length !== 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>
              </div> */}

              {/* Car Image URL */}
              <div className="mb-10">
                <label className="block text-sm font-regular font-nunito text-black mb-1">
                  Car Image URL<span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://unsplash.com/photos/black-ford-mustang-coupe-parked-near-green..."
                  className="w-full text-sm font-regular font-nunito text-black rounded-[51px]"
                />
              </div>

              {/* Submit Button - centered */}
              <div className="flex justify-center ">
                <Button
                  type="submit"
                  variant="primary"
                  className="px-[50px] py-3 "
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default AddCarPage;
