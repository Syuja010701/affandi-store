// app/components/form/input/BaseTextarea.tsx
'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const BaseTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, helperText, error, id, className, ...rest }, ref) => {
    const inputId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-900 dark:text-white"
          >
            {label}
          </label>
        )}

        <textarea
          id={inputId}
          ref={ref}
          rows={4}
          className={clsx(
            'block w-full rounded-lg border p-2.5 text-sm',
            'bg-gray-50 text-gray-900',
            'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
            'dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
            'dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...rest}
        />

        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}

        {error && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

BaseTextarea.displayName = 'BaseTextarea';
export default BaseTextarea;