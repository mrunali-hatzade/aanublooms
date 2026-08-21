import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { LayoutGrid, List, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { api } from '../services/api';

export const ShopPage = ({ onNavigate, initialCategory = 'all', searchQuery = '' }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedYarn, setSelectedYarn] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({
            category: selectedCategory,
            search: searchQuery,
            maxPrice: priceRange,
            yarnMaterial: selectedYarn,
            difficulty: selectedDifficulty,
            inStock: inStockOnly,
            sort: sortOption
          })
        ]);
        setCategories(catsRes.data || []);
        setProducts(prodsRes.data || []);
      } catch (err) {
        console.error('Catalog error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, [selectedCategory, searchQuery, priceRange, selectedYarn, selectedDifficulty, inStockOnly, sortOption]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setPriceRange(10000);
    setSelectedYarn('all');
    setSelectedDifficulty('all');
    setInStockOnly(false);
    setSortOption('featured');
  };

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Title */}
      <div className="mb-8 pb-6 border-b border-warmgray-200 dark:border-warmgray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-bloom-600 dark:text-bloom-400 block mb-1">
              Handmade Collections
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-warmgray-900 dark:text-white">
              {activeCategoryObj ? activeCategoryObj.name : 'All Handmade Creations'}
            </h1>
          </div>

          {/* Sort & View toggles */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-warmgray-100 dark:bg-warmgray-800 rounded-xl text-xs font-bold text-warmgray-800 dark:text-warmgray-200 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Sort Select */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="text-xs font-semibold py-2 px-3.5 rounded-xl bg-white dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-bloom-400"
            >
              <option value="featured">Featured Blooms</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
              <option value="newest">Fresh New Drops</option>
            </select>

            {/* View Mode Grid/List */}
            <div className="hidden sm:flex bg-warmgray-100 dark:bg-warmgray-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white dark:bg-warmgray-900 text-bloom-600 shadow-xs' : 'text-warmgray-400'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white dark:bg-warmgray-900 text-bloom-600 shadow-xs' : 'text-warmgray-400'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Category Filter Pills */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-warmgray-900 text-white dark:bg-white dark:text-warmgray-900 shadow-sm'
              : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-700 dark:text-warmgray-300 hover:bg-warmgray-200'
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-bloom-500 text-white shadow-cozy'
                : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-700 dark:text-warmgray-300 hover:bg-warmgray-200'
            }`}
          >
            {cat.icon || '🌸'} {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        
        {/* Desktop Sidebar Filters (Sticky) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-warmgray-200 dark:scrollbar-thumb-warmgray-700">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedYarn={selectedYarn}
            onSelectYarn={setSelectedYarn}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs lg:hidden">
            <div className="relative bg-white dark:bg-warmgray-900 rounded-3xl max-w-sm w-full p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif font-bold text-base">Filter Creations</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => { setSelectedCategory(cat); setMobileFilterOpen(false); }}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                selectedYarn={selectedYarn}
                onSelectYarn={setSelectedYarn}
                selectedDifficulty={selectedDifficulty}
                onSelectDifficulty={setSelectedDifficulty}
                inStockOnly={inStockOnly}
                onToggleInStock={setInStockOnly}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>
        )}

        {/* Products Results List */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border-4 border-bloom-200 border-t-bloom-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-warmgray-500">Unraveling handmade stitches...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-warmgray-900 rounded-3xl border border-warmgray-200 dark:border-warmgray-800 p-8">
              <Sparkles className="w-10 h-10 text-bloom-400 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white mb-1">
                No matching creations found
              </h3>
              <p className="text-xs text-warmgray-500 dark:text-warmgray-400 max-w-sm mx-auto mb-6">
                Try widening your price range or clearing selected yarn filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-3.5'
                : 'space-y-3'
            }>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onNavigate={onNavigate}
        />
      )}

    </div>
  );
};
