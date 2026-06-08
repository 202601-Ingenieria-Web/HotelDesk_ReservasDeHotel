interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs md:text-sm text-gray-700 font-medium">{label}</label>
      <input
        className="w-full px-3 md:px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-sm md:text-base"
        {...props}
      />
    </div>
  );
}
