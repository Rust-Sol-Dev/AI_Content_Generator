import React, { ChangeEvent } from 'react';

interface DropdownProps {
  label: string;
  options: string[];
  onSelectOption: (selectedOption: string) => void;
}

const DropdownComponent: React.FC<DropdownProps> = ({ label, options, onSelectOption }) => {
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    onSelectOption(selectedOption);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <label className="block">{label}</label>
      <select className="border border-gray-300 p-2 rounded-md" onChange={handleSelect}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownComponent;
