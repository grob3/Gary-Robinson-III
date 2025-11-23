import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center text-2xl tracking-widest font-black select-none cursor-pointer group font-sans" aria-label="Gary Robinson III">
      <div className="flex items-center text-gray-900 dark:text-white relative transition-colors duration-300">
        <span>G</span>
        <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[4ch] group-hover:opacity-100 transition-all duration-500 ease-out text-gray-500 dark:text-gray-300">
          ary
        </span>
        <span className="ml-[1px]">R</span>
        <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[8ch] group-hover:opacity-100 transition-all duration-500 ease-out text-gray-500 dark:text-gray-300">
          obinson
        </span>
      </div>
      {/* Suffix / Slashes representing 'III' */}
      <div className="flex ml-2 md:ml-3 space-x-[4px] items-center pb-1">
        <span className="text-[#CE191D] transform -skew-x-12 text-xl font-bold">/</span>
        <span className="text-[#70B786] transform -skew-x-12 text-xl font-bold">/</span>
        <span className="text-[#1F6B91] transform -skew-x-12 text-xl font-bold">/</span>
      </div>
    </div>
  );
};

export default Logo;