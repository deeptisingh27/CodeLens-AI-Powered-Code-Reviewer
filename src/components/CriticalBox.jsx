import React from "react";
import * as FaIcons from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";

const CriticalBox = ({ data }) => {
    const iconName =
  typeof data?.icon === "string"
    ? data.icon
    : "FaExclamationTriangle";

const IconComponent =
  FaIcons[iconName] ?? FaExclamationTriangle;

  console.log("CriticalBox data:", data);
console.log("Icon:", data?.icon);
console.log("Resolved:", FaIcons[data?.icon]);

  return (
    <div className="criticalbox mb-2 mt-4 p-[15px] bg-[#16181E] rounded-lg flex items-start gap-[10px]">
      <i className="text-[25px] text-[#FFB4AB] mt-2">
        <IconComponent />
      </i>
      <div>
        <h3 className="text-[20px] font-[700] mb-1">{data?.title}</h3>
        <p className="text-gray-500 text-[14px]">{data?.description}</p>
      </div>
    </div>
  );
};

export default CriticalBox;