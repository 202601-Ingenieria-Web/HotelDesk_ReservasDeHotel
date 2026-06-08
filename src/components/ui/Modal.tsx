import { X } from "lucide-react";

interface ModalProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
}

export default function Modal({
  title,
  subtitle,
  onClose,
  children,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-blue-300 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-200 sticky top-0 bg-white">
          <div className="pr-4">
            <h2 className="text-gray-900 font-semibold text-base md:text-lg">{title}</h2>
            {subtitle && (
              <p className="text-gray-600 text-xs mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
