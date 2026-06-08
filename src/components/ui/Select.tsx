interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  readonly label: string;
  readonly options: { value: string; label: string }[];
}

export default function Select({ label, options, ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs md:text-sm text-gray-700 font-medium">{label}</label>
      <select
        className="w-full px-3 md:px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-sm md:text-base"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
