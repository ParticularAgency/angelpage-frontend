'use client';

import React from 'react';

type TagPillsProps = {
  tags: string[];
  onRemove?: (tag: string) => void;
};

const TagPills = ({ tags, onRemove }: TagPillsProps) => {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-[#FCF2FF] text-primary-color-100 px-3 py-1 text-xs font-medium"
        >
          {tag}
          {onRemove && (
            <button
              type="button"
              className="ml-1 text-mono-70 hover:text-error"
              onClick={() => onRemove(tag)}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          )}
        </span>
      ))}
    </div>
  );
};

export default TagPills;
