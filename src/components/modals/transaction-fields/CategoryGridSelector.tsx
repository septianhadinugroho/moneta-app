'use client';

import CategoryIcon from '@/components/ui/CategoryIcon';

interface CategoryGridSelectorProps {
  categories: any[];
  selectedCategoryId: string;
  categorySearch: string;
  onSearchChange: (val: string) => void;
  onSelectCategory: (id: string) => void;
  error?: string;
}

export default function CategoryGridSelector({
  categories,
  selectedCategoryId,
  categorySearch,
  onSearchChange,
  onSelectCategory,
  error,
}: CategoryGridSelectorProps) {
  const searchedCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-slate-700 dark:text-slate-300 font-bold block">
          Kategori <span className="text-rose-500">*</span>
        </label>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          {categories.length} Pilihan
        </span>
      </div>

      {categories.length > 6 && (
        <input
          type="text"
          placeholder="Cari kategori..."
          value={categorySearch}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-xl text-[11px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 transition mb-1"
        />
      )}

      {searchedCategories.length === 0 ? (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic py-2">
          Tidak ada kategori yang cocok.
        </p>
      ) : (
        <div className="relative">
          <div className="grid grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
            {searchedCategories.map((cat) => {
              const isSelected = String(cat.id) === selectedCategoryId;
              const catColor = cat.color || '#64748b';

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(String(cat.id))}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                      : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white mb-1 shrink-0 shadow-2xs"
                    style={{ backgroundColor: catColor }}
                  >
                    <CategoryIcon name={cat.icon || 'Tag'} className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate w-full">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {categories.length > 6 && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-3 bg-linear-to-t from-white dark:from-slate-900 to-transparent opacity-80" />
          )}
        </div>
      )}

      {error && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-extrabold">{error}</p>}
    </div>
  );
}