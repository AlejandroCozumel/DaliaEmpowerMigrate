"use client";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface InputProps {
  id: string;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  registerOptions?: any;
  errors?: FieldErrors;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  placeholder,
  type = "text",
  disabled,
  formatPrice,
  required,
  register,
  registerOptions,
  errors,
}) => {
  return (
    <div className="w-full relative">
      {label && (
        <label
          htmlFor={id}
          className={`text-md ${errors?.[id] ? "text-red-500" : ""}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="w-full relative mt-2">
        {formatPrice && (
          <BiDollar
            size={24}
            className="text-neutral-700 absolute top-5 left-2"
          />
        )}
        <input
          id={id}
          disabled={disabled}
          {...register(id, { required, ...registerOptions })}
          placeholder={placeholder}
          type={type}
          className={`
            peer
            w-full
            p-2
            pt-6
            font-light
            bg-white
            border-2
            rounded-md
            outline-none
            transition
            disabled:opacity-70
            disabled:cursor-not-allowed
            text-base
            placeholder:text-transparent
            ${formatPrice ? "pl-9" : "pl-4"}
            ${errors?.[id] ? "border-red-500" : "border-neutral-300"}
            ${errors?.[id] ? "focus:border-red-500" : "focus:border-black"}
          `}
        />
        <span
          className={`
            absolute
            text-sm
            duration-150
            transform
            -translate-y-3
            top-5
            z-10
            origin-[0]
            pointer-events-none
            ${formatPrice ? "left-9" : "left-4"}
            peer-focus:scale-75
            peer-focus:-translate-y-4
            peer-placeholder-shown:scale-100
            peer-placeholder-shown:translate-y-0
            peer-[:not(:placeholder-shown)]:scale-75
            peer-[:not(:placeholder-shown)]:-translate-y-4
            ${errors?.[id] ? "text-red-500" : "text-zinc-400"}
          `}
        >
          {placeholder} {required && <span className="text-red-500">*</span>}
        </span>
        {errors?.[id] && (
          <p className="text-red-500 text-xs mt-1">
            {String(errors?.[id]?.message)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;
