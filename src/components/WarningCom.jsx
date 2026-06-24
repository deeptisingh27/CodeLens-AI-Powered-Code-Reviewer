import React from 'react'

const WarningCom = ({data}) => {
  return (
    <div className="warningCom p-[15px] bg-[#13151B] rounded-lg flex items-start justify-between mb-2">
      <h3  className="text-[17px]">{data.title}</h3>
      <div className="bg-[#34343D] px-[20px] py-[3px] text-[13px] rounded-lg">
        <p className="font-[700]">Line {data.line}</p>
        </div>
    </div>
  )
}

export default WarningCom
