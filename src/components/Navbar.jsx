import React from "react";
import { GoCodeReview } from "react-icons/go";

const Navbar = () => {
  return (
    <div className="navbar flex items-center gap-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--blue)]">
        <GoCodeReview className="text-l text-white" />
      </div>

      <div className="text-[20px] font-[700] text-[var(--blue)]">
        CodeLens
      </div>
    </div>
  );
};

export default Navbar;