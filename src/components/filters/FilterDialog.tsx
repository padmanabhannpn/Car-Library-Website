import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Tag from "../common/Tag";
import { Heading } from "../common/Typography";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CrossIcon,
  ResetIcon,
} from "../icons/Icons";

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
}

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedFilters: Record<string, string[]>) => void;
  initialFilters?: Record<string, string[]>;
  filterSections?: FilterSection[];
  multiSelect?: boolean;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters = {},
  filterSections: providedSections = [],
  multiSelect = true,
}) => {
  const storedCarTypes = localStorage.getItem("carTypes");
  const parsedCarTypes = storedCarTypes ? JSON.parse(storedCarTypes) : [];
  const carTypeOptions = parsedCarTypes.map((type: string) => ({
    id: type.toLowerCase(),
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type.toLowerCase(),
  }));

  const storedCarTags = localStorage.getItem("carTags");
  const parsedCarTags = storedCarTags ? JSON.parse(storedCarTags) : [];
  const carTagsOptions = parsedCarTags.map((type: string) => ({
    id: type.toLowerCase(),
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type.toLowerCase(),
  }));

  // Define default filter sections if none are provided
  const defaultCarTypeFilterSections: FilterSection[] = [
    {
      id: "carType",
      title: "CAR TYPE",
      options: carTypeOptions,
    },
  ];

  const defaultSpecFilterSections: FilterSection[] = [
    {
      id: "tags",
      title: "TAGS",
      options: carTagsOptions,
    },
  ];

  // Use provided sections if available, otherwise use default sections
  //const activeSections = providedSections.length > 0 ? providedSections : defaultFilterSections;
  const activeCarTypeSections = defaultCarTypeFilterSections;
  const activeSpecSections = defaultSpecFilterSections;

  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    carType: true,
    specifications: true,
  });

  // Track selected filters
  const [selectedFilters, setSelectedFilters] =
    useState<Record<string, string[]>>(initialFilters);

  // Toggle section expand/collapse
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Toggle filter selection
  const toggleFilter = (sectionId: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[sectionId] || [];
      const exists = currentValues.includes(value);

      if (exists) {
        // Remove the item if it's already selected
        return {
          ...prev,
          [sectionId]: currentValues.filter((item) => item !== value),
        };
      } else {
        // If multiSelect is false, replace the entire array with just this value
        // Otherwise add this value to the existing array
        const isCarType = sectionId === "carType";
        return {
          ...prev,
          [sectionId]: isCarType ? [value] : [...currentValues, value],
        };
        // return {
        //   ...prev,
        //   [sectionId]: multiSelect ? [...currentValues, value] : [value]
        // };
      }
    });
  };

  // Reset all filters
  const handleReset = () => {
    // setSelectedFilters({});
    setSelectedFilters(initialFilters);
    // alert(JSON.stringify(initialFilters))
    onApply({});
    onClose();
  };

  // Handle apply button click
  const handleApply = () => {
    onApply(selectedFilters);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 max-w-[485px] w-full bg-white rounded-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className=" h-full py-2">
          <div className="flex items-center justify-between w-full ">
            {/* {selectedFilters} */}

            {selectedFilters?.carType?.length > 0 ||
            selectedFilters?.tags?.length > 0 ? (
              <div
                className="flex items-center cursor-pointer"
                onClick={handleReset}
              >
                <ResetIcon size={20} />
                <p className="text-base font-bold ml-2 font-nunito text-[#000000]">
                  Reset
                </p>
              </div>
            ) : (
              <div></div>
            )}

            <div onClick={onClose} className="cursor-pointer">
              <CrossIcon className="opacity-30 w-5 h-5" />
            </div>
          </div>
        </div>

        <Heading className="text-3xl font-bold mb-8 mt-3">Filter By</Heading>

        {activeCarTypeSections.map((section: FilterSection, index: number) => (
          <div key={section.id} className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer mb-6"
              onClick={() => toggleSection(section.id)}
            >
              <h2 className="text-[14px] font-extrabold font-nunito tracking-wide">
                CAR TYPE
              </h2>
              <button className="text-gray-500">
                {expandedSections[section.id] ? (
                  <ChevronUpIcon size={24} />
                ) : (
                  <ChevronDownIcon size={24} />
                )}
              </button>
            </div>

            {expandedSections[section.id] && (
              <div className="flex flex-wrap gap-3 mb-6 rounded-full">
                {section.options.map((option) => {
                  const isSelected = selectedFilters[section.id]?.includes(
                    option.value
                  );

                  return (
                    <button
                      key={option.id}
                      className="focus:outline-none rounded-full"
                      onClick={() => toggleFilter(section.id, option.value)}
                    >
                      <Tag
                        variant={isSelected ? "filter-selected" : "filter"}
                        className="px-4 py-2  text-sm rounded-[36px]"
                      >
                        <p
                          className={`font-regular font-nunito text-sm ${
                            !isSelected ? "text-[#000000]" : "text-[#9B72D2]"
                          }`}
                        >
                          {" "}
                          {option.label}
                        </p>
                      </Tag>
                    </button>
                  );
                })}
              </div>
            )}

            {index < activeCarTypeSections.length - 1 && (
              <div className="border-b border-gray-200 my-6"></div>
            )}
          </div>
        ))}

        <div className="w-full h-[1px] mb-3 bg-[rgba(0,0,0,0.07)]"></div>

        {activeSpecSections.map((section: FilterSection, index: number) => (
          <div key={section.id} className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer mb-6"
              onClick={() => toggleSection(section.id)}
            >
              {/* //SPECIFICATIONS */}
              <h2 className="text-[14px] font-extrabold font-nunito tracking-wide">
                TAGS
              </h2>
              <button className="text-gray-500">
                {expandedSections[section.id] ? (
                  <ChevronUpIcon size={24} />
                ) : (
                  <ChevronDownIcon size={24} />
                )}
              </button>
            </div>

            {expandedSections[section.id] && (
              <div className="flex flex-wrap gap-3 mb-6 rounded-full">
                {section.options.map((option) => {
                  const isSelected = selectedFilters[section.id]?.includes(
                    option.value
                  );

                  return (
                    <button
                      key={option.id}
                      className="focus:outline-none rounded-full"
                      onClick={() => toggleFilter(section.id, option.value)}
                    >
                      <Tag
                        variant={isSelected ? "filter-selected" : "filter"}
                        className="px-4 py-2  text-sm rounded-[36px]"
                      >
                        {/* {option.label} */}
                        <p
                          className={`font-regular font-nunito text-sm ${
                            !isSelected ? "text-[#000000]" : "text-[#9B72D2]"
                          }`}
                        >
                          {" "}
                          {option.label}
                        </p>
                      </Tag>
                    </button>
                  );
                })}
              </div>
            )}

            {index < activeSpecSections.length - 1 && (
              <div className="border-b border-gray-200 my-6"></div>
            )}
          </div>
        ))}

        <div className="mt-12 flex justify-center">
          <Button
            variant="primary"
            className="px-16 py-4 text-lg rounded-full w-full max-w-sm"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterDialog;
