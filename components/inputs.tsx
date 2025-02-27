import React from "react";

interface InputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ label, type = "text", name, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full px-3 py-2 border rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
      />
    </div>
  );
};

export default Input;
