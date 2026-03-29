const ArticleSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
      {/* Image */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />

      <div className="p-5 flex flex-col gap-3">
        {/* Rubrique + date */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Titre */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>

        {/* Contenu */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ArticleSkeleton;