
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { QuestionOptionType } from "./types";

interface QuestionOptionProps {
  option: QuestionOptionType;
  onSelect: () => void;
}

export const QuestionOption = ({ option, onSelect }: QuestionOptionProps) => {
  return (
    <div key={option.id} className="flex items-center space-x-2">
      <RadioGroupItem 
        id={option.id} 
        value={option.id} 
        onClick={onSelect}
      />
      <Label htmlFor={option.id} className="cursor-pointer flex-1 py-2">
        {option.text}
      </Label>
    </div>
  );
};
