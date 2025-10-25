interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      {/* Animated spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-600 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animation-delay-150"></div>
      </div>
      
      {/* Loading text with pulse animation */}
      <div className="mt-6 text-center">
        <p className="text-white text-lg font-medium animate-pulse">{message}</p>
        <div className="flex justify-center mt-2 space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-200"></div>
        </div>
      </div>
    </div>
  );
}; 