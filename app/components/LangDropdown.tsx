"use client";
interface LangDropdownProps {
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const LangDropdown: React.FC<LangDropdownProps> = ({
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-1 outline-none bg-neutral-200 border border-neutral-400 rounded"
    >
      {options.map((option, index) => (
        <option key={`${name}_${index}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
