'use client';

import React from 'react';

type PermissionCheckboxesProps = {
  allKeys: string[];
  labels: Record<string, string>;
  selected: string[];
  onChange: (next: string[]) => void;
  presets?: { id: string; label: string; permissions: string[] }[];
};

const PermissionCheckboxes = ({
  allKeys,
  labels,
  selected,
  onChange,
  presets = [],
}: PermissionCheckboxesProps) => {
  const toggle = (key: string) => {
    onChange(
      selected.includes(key)
        ? selected.filter(k => k !== key)
        : [...selected, key]
    );
  };

  return (
    <div className="space-y-4">
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => (
            <button
              key={preset.id}
              type="button"
              className="caption px-3 py-1.5 rounded-full border border-mono-40 hover:bg-[#FCF2FF] hover:border-primary-color-100"
              onClick={() => onChange([...preset.permissions])}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {allKeys.map(key => (
          <label
            key={key}
            className="flex items-center gap-2 body-caption cursor-pointer rounded-lg border border-mono-40 px-3 py-2 hover:bg-mono-0"
          >
            <input
              type="checkbox"
              checked={selected.includes(key)}
              onChange={() => toggle(key)}
            />
            <span>{labels[key] || key}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PermissionCheckboxes;
