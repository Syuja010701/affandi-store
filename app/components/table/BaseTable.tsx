'use client';

import React from 'react';

type TableColumn = {
  key: string;
  header: string;
};

type TableProps<T> = {
  columns: TableColumn[];
  data: T[];
};

export default function BaseTable<T extends Record<string, any>>({ columns, data }: TableProps<T>) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className="px-6 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                rowIndex === data.length - 1 ? '' : 'border-b'
              }`}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col.key}
                  className={`px-6 py-4 ${
                    colIndex === 0 ? 'font-medium text-gray-900 whitespace-nowrap dark:text-white' : ''
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
