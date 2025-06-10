import React, { ReactNode } from 'react';
import { Caption } from './Typography';

export type TagVariant = 
  | 'specification'  // Detail/Specifications 
  | 'safety'         // Detail/Safety
  | 'filter'         // Filter tag base style
  | 'filter-selected' // Selected filter tag
  | 'manual'         // Manual transmission tag
  | 'automatic'      // Automatic transmission tag
  | 'outline'     // Outline style for specifications
  | 'nooutline';

interface TagProps {
  variant: TagVariant;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  variant,
  children,
  onClick,
  className = '',
}) => {
  const variantStyles = {
    // Specifications tag (light gray pill with dark text)
    'specification': 'bg-gray-100 text-gray-800',
    
    // Safety tag (light blue pill with blue text)
    'safety': 'bg-blue-50 text-blue-700',
    
    // Filter tag (light gray with border)
    // 'filter': 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 ',
    'filter': 'bg-[rgba(0,0,0,0.04)] text-[#000000] text-[14px] font-nunito font-normal border border-[rgba(0,0,0,0.08)] hover:border-gray-300 rounded-[36px]',
    
    // Selected filter tag (purple with white text)
    'filter-selected': 'bg-[rgba(155,114,210,0.1)] text-[#9B72D2] text-[14px] font-nunito font-normal  border-purple-600 rounded-[36px] ',
    // 'filter-selected': 'bg-[#9B72D2] text-[#9B72D2] text-[14px] font-nunito font-normal  border-purple-600 ',

    // Manual transmission tag (green with light green background)
    'manual': 'bg-[#D6F9DB] text-[#10A024] text-[16px] font-nunito font-normal',
    
    // Automatic transmission tag (orange with light orange background)
    'automatic': 'bg-[#F5E7D0] text-[#997C4C] text-[16px] font-nunito font-normal',
    
    // Outline style for specifications (white with border)
    'outline': 'bg-white text-gray-800 border border-gray-200',

    'nooutline': 'bg-white text-gray-800 border border-[#9B72D2]',
  };
  
  const isClickable = !!onClick;
  const clickableStyles = isClickable ? 'cursor-pointer hover:opacity-80' : '';
  const baseStyles = 'inline-flex items-center px-3 py-2 rounded-lg text-sm transition-all';


  return (
    <div 
      className={``}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}>
      {/* className="font-medium" */}
      <Caption as="span" className={`${baseStyles} ${variantStyles[variant]} ${clickableStyles} ${className}`}>
       
       {children}
      </Caption>
    </div>
  );
};

export default Tag;
