import React, { useState, useRef, useEffect } from 'react';
import { SortOptions } from '../../types/car';
import { Caption } from './Typography';
import Button from './Button';
import {  SortIcon } from '../../components/icons/Icons';

interface SortOption {
  label: string;
  value: SortOptions;
}

interface SortDropdownProps {
  onSort: (sortOptions: SortOptions) => void;
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSort, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // const sortOptions: SortOption[] = [
  //   { label: 'Sort by A - Z  ↓', value: { sortBy: 'createdAt', sortOrder: 'ASC' } }, //ASC DESC
  //    { label: 'Sort by Z - A  ↓', value: { sortBy: 'createdAt', sortOrder: 'DESC' } }, //ASC DESC
  //   { label: 'Sort by Date Modified  ↑', value: { sortBy: 'createdAt', sortOrder: 'ASC' } },
  // ];\
  const sortOptions: SortOption[] = [
    { label: 'Sort by Name (A-Z)', value: { sortBy: 'name', sortOrder: 'ASC' } },
    { label: 'Sort by Name (Z-A)', value: { sortBy: 'name', sortOrder: 'DESC' } },
    { label: 'Newest First', value: { sortBy: 'createdAt', sortOrder: 'DESC' } },
    { label: 'Oldest First', value: { sortBy: 'createdAt', sortOrder: 'ASC' } },
  ];
  
  const [selectedOption, setSelectedOption] = useState<SortOption>(sortOptions[0]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when ESC key is pressed
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  const handleSelect = (option: SortOption) => {
    setSelectedOption(option);
    onSort(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
     
      <Button
        variant="sort"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="px-5 py-[10px]"
      >
        
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
             <SortIcon  className='mr-1' />
            {/* {selectedOption.label} */}
           <p className='font-bold font-nunito text-[14px] text-black'> Sort </p>
          </div>
          
       
        </div>
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-[200px] mt-2 bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-gray-200 overflow-auto focus:outline-none sm:text-sm">
          {sortOptions.map((option, index) => (
            <div
              key={index}
              className={`${
                selectedOption.label === option.label
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-700'
              } cursor-pointer select-none relative py-2 px-4 hover:bg-gray-50 transition-colors duration-150`}
              onClick={() => handleSelect(option)}
            >
              <div className='flex'>
                <Caption as="span" className={selectedOption.label === option.label ? "font-medium" : "font-normal"}>
                {/* {option.label} */}
                <p className='font-bold font-nunito text-[14px] text-black'> {option.label} </p>
              </Caption>
                {/* Arrow icons */}
   
              </div>
              
              {selectedOption.label === option.label && (
                <span className="absolute inset-y-0 right-2 flex items-center">
                  
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
