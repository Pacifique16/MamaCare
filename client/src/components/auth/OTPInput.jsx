import React, { useRef, useState } from 'react';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every(val => val !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-2 md:gap-4 justify-between">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-16 md:w-16 md:h-20 text-center text-2xl font-bold rounded-xl bg-gray-100 border-2 border-transparent focus:border-mamacare-teal/20 focus:bg-white outline-none transition-all shadow-sm"
        />
      ))}
    </div>
  );
};

export default OTPInput;
