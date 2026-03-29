const StatCard = ({ label, value, icon, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    green:   'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    orange:  'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    purple:  'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value ?? '—'}</p>
      </div>
    </div>
  );
};

export default StatCard;