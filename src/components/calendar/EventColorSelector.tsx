
import { EventColor } from "@/types/calendar";

interface EventColorSelectorProps {
  selectedColor: EventColor;
  onColorChange: (color: EventColor) => void;
}

const colorOptions: { value: EventColor; label: string; class: string }[] = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'gray', label: 'Gray', class: 'bg-gray-500' },
];

export const EventColorSelector = ({ selectedColor, onColorChange }: EventColorSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colorOptions.map(color => (
        <button
          key={color.value}
          type="button"
          className={`w-8 h-8 rounded ${color.class} ${
            selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
          }`}
          onClick={() => onColorChange(color.value)}
        />
      ))}
    </div>
  );
};
