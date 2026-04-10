import React, { useState } from "react";

interface InputFieldProps {
    label: string;
    type?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    placeholder?: string;
    required?: boolean;
    options?: { label: string; value: string }[];
    error?: string;
    accept?: string;
}

export default function InputField({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required = false,
    options,
    error,
    accept,
}: InputFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const currentType = isPassword && showPassword ? "text" : type;

    return (
        <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative">
                {options ? (
                    <select
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className="w-full border p-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    >
                        <option value="">Select an option</option>
                        {options.map((opt, i) => (
                            <option key={i} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : type === "file" ? (
                    <input
                        type="file"
                        name={name}
                        onChange={onChange}
                        required={required}
                        accept={accept || "image/*"}
                        className="w-full border p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
                    />
                ) : (
                    <input
                        type={currentType}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        className="w-full border p-3 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    />
                )}

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-orange-500 text-sm focus:outline-none"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}
