import React from "react";
import { cva } from "class-variance-authority";

export const H1: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <h1 className="my-4 text-3xl font-bold text-gray-800">{children}</h1>
      <hr className="border-1 mb-8 border-gray-300" />
    </div>
  );
};

export const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <h2 className="my-4 text-2xl font-bold text-gray-800">{children}</h2>
      <hr className="border-1 my-4 border-gray-300" />
    </div>
  );
};

export const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800">{children}</h3>
    </div>
  );
};

export const P: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <p className="font-normal text-gray-700 ">{children}</p>;
};

export const Container: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="mx-auto mt-20 max-w-7xl px-2 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const buttonClasses = cva(
  "inline-flex justify-center rounded-md border py-2 px-4 ",
  {
    variants: {
      variant: {
        primary: [
          "border-transparent bg-indigo-600 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ease-in-out duration-150",
        ],
        secondary: [
          "border-indigo-500 bg-white text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ease-in-out duration-150",
        ],
        normal: [
          "border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ease-in-out duration-150",
        ],
        danger: [
          // "border-transparent bg-red-600 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
          "border-red-600 bg-red-50 text-sm font-medium text-red-600 shadow-sm hover:bg-red-600 focus:bg-red-600 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ease-in-out duration-150",
        ],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);
export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "normal" | "danger";
  }
> = ({ children, variant, ...props }) => {
  return (
    <button className={buttonClasses({ variant })} {...props}>
      {children}
    </button>
  );
};
