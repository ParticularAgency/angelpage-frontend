import { ArrowDownIcon } from '@/icons';
import React from 'react';
import Checkbox from '../input-fields/checkbox';
interface Product {
  category: string;
  subcategory: string;
  brand: string;
  condition: string;
}
interface FilterSidebarProps {
  availableProducts?: Product[];
  selectedFilters: {
    // Accept selectedFilters as a prop from the parent
    category: string[];
    subCategory: string[];
    brand: string[];
    condition: string[];
  };
  onFilterChange: (filters: {
    category: string[];
    subCategory: string[];
    brand: string[];
    condition: string[];
  }) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  availableProducts = [],
  selectedFilters,
  onFilterChange,
}) => {
  const [openSections, setOpenSections] = React.useState({
    categories: false,
    subcategories: false,
    brand: false,
    condition: false,
  });

  // Extract filter options from availableProducts
  const extractFilterOptions = (products: Product[]) => {
    const categoriesSet = new Set<string>();
    const subCategoriesMap = new Map<string, Set<string>>();
    const brandsSet = new Set<string>();
    const conditionsSet = new Set<string>();

    products.forEach(product => {
      categoriesSet.add(product.category || '');
      if (!subCategoriesMap.has(product.category)) {
        subCategoriesMap.set(product.category, new Set<string>());
      }
      subCategoriesMap
        .get(product.category)
        ?.add(product.subcategory || 'Unknown');
      brandsSet.add(product.brand || 'Unknown');
      conditionsSet.add(product.condition || 'Unknown');
    });

    const categoriesArray = Array.from(categoriesSet).map(category => ({
      category,
      subCategories: Array.from(subCategoriesMap.get(category) || []),
    }));

    return {
      categories: categoriesArray,
      brands: Array.from(brandsSet),
      conditions: Array.from(conditionsSet),
    };
  };

  const { categories, brands, conditions } =
    extractFilterOptions(availableProducts);

  // Update filters when a checkbox is toggled
  const handleFilterChange = (
    filterType: keyof typeof selectedFilters,
    value: string
  ) => {
    const updatedFilter = selectedFilters[filterType].includes(value)
      ? selectedFilters[filterType].filter(item => item !== value)
      : [...selectedFilters[filterType], value];

    const updatedFilters = { ...selectedFilters, [filterType]: updatedFilter };
    onFilterChange(updatedFilters); // Pass filters to parent component
  };

  // Toggle open/close sections
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Calculate total selected counts
  const totalSelectedCategories = selectedFilters?.category?.length;
  const totalSelectedSubcategories = selectedFilters?.subCategory?.length;
  const totalSelectedBrands = selectedFilters?.brand?.length;
  const totalSelectedConditions = selectedFilters?.condition?.length;

  return (
    <div className="filter-sidebar">
      {/* Render Unique Category Filters */}
      <div>
        <div
          className="filter-item-title-box flex items-center  justify-between"
          onClick={() => toggleSection('categories')}
          style={{ cursor: 'pointer' }}
        >
          <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
            Categories{' '}
            <span className="text-primary-color-100 absolute right-2">
              {totalSelectedCategories > 0
                ? `(${totalSelectedCategories})`
                : ''}
            </span>
          </h4>
          <span
            className={`arrow ${openSections.condition ? 'open' : 'closed'}`}
          >
            <ArrowDownIcon />
          </span>
        </div>
        {openSections.categories && (
          <ul className="pb-[14px] pl-3 sm:pl-1 flex flex-col gap-2">
            {categories.map(category => (
              <li key={category.category}>
                <label className="flex items-center gap-2 capitalize caption">
                  {/* <input /> */}
                  <Checkbox
                    checked={selectedFilters.category.includes(
                      category.category
                    )}
                    onChange={() =>
                      handleFilterChange('category', category.category)
                    }
                  />
                  {category.category || 'Unknown'}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Render Unique Sub-Category Filters */}
      <div>
        <div
          className="filter-item-title-box flex items-center  justify-between"
          onClick={() => toggleSection('subcategories')}
          style={{ cursor: 'pointer' }}
        >
          <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
            Subcategories{' '}
            <span className="text-primary-color-100 absolute right-2">
              {totalSelectedSubcategories > 0
                ? `(${totalSelectedSubcategories})`
                : ''}
            </span>
          </h4>
          <span
            className={`arrow ${openSections.condition ? 'open' : 'closed'}`}
          >
            <ArrowDownIcon />
          </span>
        </div>
        {openSections.subcategories && (
          <ul className="pb-[14px] pl-3 flex  sm:pl-1 flex-col gap-2">
            {categories.map(category => (
              <li key={category.category}>
                <ul className="flex flex-col gap-2">
                  {category.subCategories.map(subCategory => (
                    <li key={subCategory}>
                      <label className="flex items-center capitalize gap-2 caption">
                        {/* <input type="checkbox" className="!bg-[#fff]" /> */}
                        <Checkbox
                          checked={selectedFilters.subCategory.includes(
                            subCategory
                          )}
                          onChange={() =>
                            handleFilterChange('subCategory', subCategory)
                          }
                        />
                        {subCategory || 'Unknown'}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Brand Filter */}
      <div>
        <div
          className="filter-item-title-box flex items-center  justify-between"
          onClick={() => toggleSection('brand')}
          style={{ cursor: 'pointer' }}
        >
          <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
            Brand{' '}
            <span className="text-primary-color-100 absolute right-2">
              {totalSelectedBrands > 0 ? `(${totalSelectedBrands})` : ''}
            </span>
          </h4>
          <span
            className={`arrow ${openSections.condition ? 'open' : 'closed'}`}
          >
            <ArrowDownIcon />
          </span>
        </div>
        {openSections.brand && (
          <ul className="pb-[14px] pl-3 flex  sm:pl-1 flex-col gap-2">
            {brands.map(brand => (
              <li key={brand}>
                <label className="flex items-center capitalize gap-2 caption">
                  {/* <input type="checkbox" className="!bg-[#fff]" /> */}
                  <Checkbox
                    checked={selectedFilters.brand.includes(brand)}
                    onChange={() => handleFilterChange('brand', brand)}
                  />
                  {brand || 'Unknown'}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Condition Filter */}
      <div>
        <div
          className="filter-item-title-box flex items-center  justify-between"
          onClick={() => toggleSection('condition')}
          style={{ cursor: 'pointer' }}
        >
          <h4 className="filter-sidebar-title pr-8 relative eyebrow-small flex items-center  gap-1 justify-start pl-2 py-[13px]">
            Condition{' '}
            <span className="text-primary-color-100 absolute right-2">
              {totalSelectedConditions > 0
                ? `(${totalSelectedConditions})`
                : ''}
            </span>
          </h4>
          <span
            className={`arrow ${openSections.condition ? 'open' : 'closed'}`}
          >
            <ArrowDownIcon />
          </span>
        </div>

        {openSections.condition && (
          <ul className="pb-[14px] pl-3 flex  sm:pl-1 flex-col gap-2">
            {conditions.map(condition => (
              <li key={condition}>
                <label className="flex items-center capitalize gap-2 caption">
                  <Checkbox
                    checked={selectedFilters.condition.includes(condition)}
                    onChange={() => handleFilterChange('condition', condition)}
                  />
                  {condition || 'Unknown'}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
