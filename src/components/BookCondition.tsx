import React, { useState } from "react";

type Condition = "new" | "good" | "fair" | "poor";

type BookConditionProps = {
  onConditionChange: (condition: Condition) => void;
  initial:Condition
};

const BookCondition: React.FC<BookConditionProps> = ({ onConditionChange,initial}) => {
  const [selectedCondition, setSelectedCondition] = useState<Condition>(initial);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const condition = event.target.value as Condition;
    setSelectedCondition(condition);
    onConditionChange(condition);
  };

  return (
    <div className="flex tappa items-center w-full justify-start">
        <h1 className="w-[50%] font-semibold text-white">Condition</h1>
    <div className="wrapper1 m-10">
      {["new", "good", "fair", "poor"].map((condition) => (
          <div className="option1" key={condition}>
          <input
            value={condition}
            name="book-condition" 
            type="radio"
            className="input1"
            checked={selectedCondition === condition}
            onChange={handleChange}
            />
          <div className="btn1">
            <span className="span1">{condition}</span>
          </div>
        </div>
      ))}
    </div>
      </div>
  );
};

export default BookCondition;
