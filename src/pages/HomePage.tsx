import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CarListItem, Car, FilterOptions, SortOptions } from "../types/car";
import { CarService } from "../services/api";
import Header from "../components/layout/Header";
import SearchBar from "../components/common/SearchBar";
import SortDropdown from "../components/common/SortDropdown";
import FilterSelector from "../components/common/FilterSelector";
import CarCard from "../components/cars/CarCard";
import CarDetails from "../components/cars/CarDetails";
import CarForm from "../components/cars/CarForm";
import Background from "../components/common/Background";
import { PlusIcon, NoCarFound } from "../components/icons/Icons";
import { Caption } from "../components/common/Typography";
import Button from "../components/common/Button";
import DeleteDialog from "../components/common/DeleteDialog";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarListItem[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [carToDelete, setCarToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [carTypes, setCarTypes] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [deleteCarName, setDeleteCarName] = useState("");
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showCarDetailsModal, setShowCarDetailsModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: "",
    carType: undefined,
    tags: [],
  });

  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortBy: "name",
    sortOrder: "ASC",
  });

  // Fetch initial data on component mount
  useEffect(() => {
    fetchCars();
    fetchFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch cars when filters or sorting changes
  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOptions, sortOptions]);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const data = await CarService.getAllCars(filterOptions, sortOptions);
      setCars(data);
      setError(null);
    } catch (error: any) {
      // setError('Failed to load cars. Please try again later.');
      // console.error('Error fetching cars:', err);
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      // Fetch car types and tags in parallel
      const [typesData, tagsData] = await Promise.all([
        CarService.getCarTypes(),
        CarService.getCarTags(),
      ]);
      localStorage.setItem("carTypes", JSON.stringify(typesData));
      localStorage.setItem("carTags", JSON.stringify(tagsData));
      setCarTypes(typesData);
      setTags(tagsData);
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

  const handleCarClick = async (id: number) => {
    try {
      setIsLoading(true);
      const car = await CarService.getCarById(id);
      setSelectedCar(car);
      setShowCarDetailsModal(true);
      setIsLoading(false);
    } catch (error: any) {
      // alert('Error fetching car details:');
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
      setIsLoading(false);
    }
  };

  const handleAddCar = async (car: Omit<Car, "id" | "createdAt">) => {
    try {
      await CarService.createCar(car);
      setShowAddCarModal(false);
      fetchCars();
    } catch (error: any) {
      // alert('Error fetching car details:');
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
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: number, name: string) => {
    setCarToDelete(id);
    setDeleteCarName(name);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (carToDelete) {
      try {
        await CarService.deleteCar(carToDelete);
        setShowDeleteConfirmation(false);
        setCarToDelete(null);

        // Close detail modal if the deleted car was being viewed
        if (selectedCar && selectedCar.id === carToDelete) {
          setShowCarDetailsModal(false);
        }

        fetchCars();
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
    }
  };

  const handleSearch = (query: string) => {
    setFilterOptions((prev) => ({ ...prev, search: query }));
  };

  const handleSortChange = (sort: SortOptions) => {
    setSortOptions(sort);
  };

  // const handleCarTypeFilter = (selected: string[]) => {
  //   // Since car type is a single select, use the first value or undefined

  //   const carType = selected.length > 0 ? selected[0] : undefined;
  //   setFilterOptions(prev => ({ ...prev, carType }));
  //   alert("AD : "+JSON.stringify(selected))
  // };

  const handleCarTypeFilter = (selected: Record<string, string[]>) => {
    const selectedCarTypeList = selected["carType"] || [];
    const selectedTagsList = selected["tags"] || [];

    const carType =
      selectedCarTypeList.length > 0 ? selectedCarTypeList[0] : undefined;
    const tags = selectedTagsList;

    setFilterOptions((prev) => ({
      ...prev,
      carType,
      tags,
    }));
  };

  // const handleTagsFilter = (selected: string[]) => {
  //   setFilterOptions(prev => ({ ...prev, tags: selected }));
  // };

  // Don't show modals if data isn't loaded
  const showDetails = showCarDetailsModal && selectedCar !== null;

  // Check if any filters are applied
  // const hasActiveFilters = filterOptions.search || filterOptions.carType || (filterOptions.tags && filterOptions.tags.length > 0);

  // Get currently applied car type
  // const activeCarType = filterOptions.carType || '';

  // Formatted result count text
  // const resultsCountText = `${cars.length} ${cars.length === 1 ? 'Car' : 'Cars'} Found`;

  return (
    <Background variant="light" className="min-h-screen pb-16 ">
      <Header />

      <main className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 pt-10 pb-16">
        {/* Page title and search section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-1 gap-6">
          {/* <div>
            <Heading className="text-[28px] mb-1">Car Library</Heading>
            <Caption className="text-gray-500">{resultsCountText}</Caption>
          </div> */}

          <div className="w-full flex justify-between ">
            <div className="w-full  md:w-[320px]">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search a car"
                initialValue={filterOptions.search || ""}
                className="w-full font-regular font-nunito text-sm"
              />
            </div>
            {/* Filters section */}
            <div className="mb-10 flex flex-col gap-6  ">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Car Type Filter */}
                <div className="relative ">
                  <FilterSelector
                    title="Filter"
                    options={carTypes}
                    selectedOptions={
                      filterOptions.carType ? [filterOptions.carType] : []
                    }
                    onChange={handleCarTypeFilter}
                  />
                </div>

                {/* Tags Filter */}
                {/* <div className="relative">
              <FilterSelector
                title="Tags"
                options={tags}
                selectedOptions={filterOptions.tags || []}
                onChange={handleTagsFilter}
                multiSelect
              />
            </div> */}

                {/* Sort Dropdown */}
                <div className="relative ml-auto">
                  <SortDropdown onSort={handleSortChange} />
                </div>
              </div>

              {/* Applied filters */}
              {/* {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-3">
              <Caption className="text-gray-600 mr-1">Applied Filters:</Caption>
              
              
              {filterOptions.carType && (
                <Tag 
                  variant="filter-selected" 
                  onClick={() => handleCarTypeFilter([])}
                >
                  {activeCarType}
                  <span className="ml-2">×</span>
                </Tag>
              )}
              
             
              {filterOptions.tags && filterOptions.tags.map(tag => (
                <Tag 
                  key={tag}
                  variant="filter-selected"
                  onClick={() => handleTagsFilter(filterOptions.tags?.filter(t => t !== tag) || [])}
                >
                  {tag}
                  <span className="ml-2">×</span>
                </Tag>
              ))}
              
             
              {hasActiveFilters && (
                <button 
                  onClick={() => {
                    setFilterOptions({
                      search: '',
                      carType: undefined,
                      tags: []
                    });
                  }}
                  className="text-sm text-gray-600 underline hover:text-purple-600 ml-2"
                >
                  Clear All
                </button>
              )}
            </div>
          )} */}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center">
            <span className="text-red-500 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mb-4"></div>
            <Caption className="text-gray-500">Loading cars...</Caption>
          </div>
        )}

        {/* {isLoading && cars.length === 0 && (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mb-4"></div>
    <Caption className="text-gray-500">Loading cars...</Caption>
  </div>
)} */}

        {/* Empty state */}
        {!isLoading && cars.length === 0 && (
          <div className="text-center  flex items-center justify-center">
            <div className="flex flex-col items-center justify-center  min-h-[300px]">
              <NoCarFound size={100} />
              <p className="text-[rgba(0,0,0,0.5)] font-extrabold font-nunito text-[24px]">
                No results found with {filterOptions.search}.
              </p>
            </div>
          </div>
        )}

        {/* Car grid */}
        {!isLoading && cars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onClick={handleCarClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CarDetails
        car={
          selectedCar as Car
        } /* Cast is safe because we only open modal when selectedCar has been fully fetched */
        isOpen={showDetails}
        onClose={() => setShowCarDetailsModal(false)}
        onDelete={handleDeleteClick}
      />

      <CarForm
        isOpen={showAddCarModal}
        onClose={() => setShowAddCarModal(false)}
        onSubmit={handleAddCar}
        carTypes={carTypes}
        availableTags={tags}
      />

      <DeleteDialog
        isOpen={showDeleteConfirmation}
        onCancel={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        title={"Delete " + deleteCarName + " ?"}
        message={" Are you sure you want to delete this item? "}
      />

      {/* <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Delete Car"
        message="Are you sure you want to delete this car? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
        danger
      /> */}

      {/* Floating Add Car Button */}
      <div className="fixed bottom-8 right-8">
        <Button
          variant="action"
          onClick={() => navigate("/add-car")}
          startIcon={<PlusIcon size={16} color="white" />}
          className="shadow-lg hover:shadow-xl "
        >
          Add Car
        </Button>
      </div>
    </Background>
  );
};

export default HomePage;
