const Input = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 rounded-lg border text-sm
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500
          ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-700'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Input;