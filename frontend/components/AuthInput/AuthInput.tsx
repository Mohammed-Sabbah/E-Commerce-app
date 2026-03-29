import React from "react";

type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export default function AuthInput({ error, className, ...props }: AuthInputProps) {
  return (
    <div className="w-full">
      <input
        {...props}
        className={[
          "h-10 w-full border-b border-[#c7c7c7] bg-transparent text-sm text-[#111] outline-none transition focus:border-[#111]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

