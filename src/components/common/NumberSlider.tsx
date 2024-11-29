// SliderPicker.tsx
import React, { useState } from 'react';

interface SliderPickerProps {
  onChange: (value: number) => void;
}

const SliderPicker: React.FC<SliderPickerProps> = ({ onChange }) => {
  const [value, setValue] = useState<number>(5);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={handleChange}
        className="w-64"
      />
      <div className="text-lg font-bold mt-2">Rating: {value}</div>
    </div>
  );
};

export default SliderPicker;
