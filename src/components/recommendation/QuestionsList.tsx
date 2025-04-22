
import React from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { QuestionOption } from "./QuestionOption";
import { Question } from "./types";

interface QuestionsListProps {
  currentQuestion: Question;
  onAnswer: (optionId: string) => void;
}

const QuestionsList = ({ currentQuestion, onAnswer }: QuestionsListProps) => {
  return (
    <div className="space-y-4">
      <p className="text-lg">{currentQuestion.text}</p>
      
      <RadioGroup>
        {currentQuestion.options.map((option) => (
          <QuestionOption 
            key={option.id}
            option={option}
            onSelect={() => onAnswer(option.id)}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuestionsList;
