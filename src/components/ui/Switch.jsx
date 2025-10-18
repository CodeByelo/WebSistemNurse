import React from "react";

const Switch = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors"></div>
    <div className="absolute top-0.5 left-[2px] bg-white border-gray-300 border rounded-full w-5 h-5 transition-transform peer-checked:translate-x-full"></div>
  </label>
);

export default Switch;