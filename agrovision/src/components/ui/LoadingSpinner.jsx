export default function LoadingSpinner({ size = 'md', message = '', fullPage = false }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-gray-200 border-t-brand-600 animate-spin`}
      />
      {message && (
        <p className="text-sm text-gray-500 text-center">{message}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="h-10 w-10 rounded-full border-2 border-gray-100 border-t-brand-600 animate-spin" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function ScannerLoader({ message = 'Analyzing image...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      {/* Scanner animation */}
      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-brand-200 bg-brand-50">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute w-full border-t border-brand-400" style={{ top: `${(i + 1) * 25}%` }} />
          ))}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute h-full border-l border-brand-400" style={{ left: `${(i + 1) * 25}%` }} />
          ))}
        </div>
        {/* Scanner line */}
        <div
          className="absolute left-0 right-0 h-0.5 bg-brand-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] scanner-line"
          style={{ top: 0 }}
        />
        {/* Corner markers */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-brand-600 rounded-tl" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-brand-600 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-brand-600 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-brand-600 rounded-br" />
        {/* Leaf icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl opacity-30">🌿</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-800">{message}</p>
        <p className="text-sm text-gray-500 mt-1">Powered by EfficientNetV2-B0</p>
      </div>
      {/* Animated dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
