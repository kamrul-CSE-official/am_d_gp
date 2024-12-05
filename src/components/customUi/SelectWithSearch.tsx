import React, { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FixedSizeList as List } from "react-window";

interface SelectWithSearchProps {
  options: { label: string; value: string }[];
  placeholder?: string;
  onSelect: (option: { label: string; value: string }) => void;
}

const SelectWithSearch: React.FC<SelectWithSearchProps> = ({
  options,
  placeholder = "Search...",
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState<{ label: string; value: string } | null>(null);

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [options, searchQuery]
  );

  const handleSelect = (value: string) => {
    const option = options.find(option => option.value === value);
    if (option) {
      setSelectedOption(option);
      onSelect(option);
    }
  };

  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="max-h-64 overflow-auto">
          <List
            className="text-sm"
            height={250}
            itemCount={filteredOptions.length}
            itemSize={35}
            width="100%"
          >
            {({ index, style }) => (
              <div style={style}>
                <SelectItem
                  key={filteredOptions[index].value}
                  value={filteredOptions[index].value}
                >
                  {filteredOptions[index].label}
                </SelectItem>
              </div>
            )}
          </List>
        </div>
      </SelectContent>
    </Select>
  );
};

export default SelectWithSearch;
