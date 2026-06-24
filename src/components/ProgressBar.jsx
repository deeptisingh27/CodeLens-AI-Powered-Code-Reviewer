import React from 'react'

const ProgressBar = ({name, score}) => {
    let width = "10vw";

  return (
    <div className="progressbar rounded-lg p-[15px] rounded-lg w-full" style={{borderLeft:`5px solid ${score < 50 ? '#EF4444' : score < 75 ? '#EAB308' : '#22C55E'}`}}>
        <div className="flex items-center justify-between">
            <p className="text-gray-400 text-[15px] font-[700]">{name}</p>
            <p className="text-gray-400 text-[13px] font-[700]">{score}</p>
        </div>

        <div className="progress">
            <div className="bg w-full h-[8px] rounded-[30px] bg-[#1F1F2E] mt-2 relative">
                <div style={{ width: score + "%"}} className={`absolute left-0 top-0 score h-[8px] rounded-[30px] ${
                    score<50?"bg-red-500"
                    :score<75?"bg-yellow-500"
                    :"bg-green-500"}`} >

                </div>

            </div>
        </div>
    </div>
  )
}

export default ProgressBar
