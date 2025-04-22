
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { searchMovies, MovieResult } from "@/services/movieApi";
import { useMovies } from "@/context/MovieContext";
import { questions } from "./recommendation/types";
import QuestionsList from "./recommendation/QuestionsList";
import LoadingState from "./recommendation/LoadingState";
import MovieRecommendation from "./recommendation/MovieRecommendation";

interface RecommendationQuestionnaireProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecommendationQuestionnaire = ({ open, onOpenChange }: RecommendationQuestionnaireProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<MovieResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { collection } = useMovies();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = async (optionId: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
    
    if (isLastQuestion) {
      setLoading(true);
      await generateRecommendation(optionId);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const generateRecommendation = async (lastOptionId: string) => {
    // Collect all selected genres based on answers
    const selectedGenres = new Set<string>();
    
    questions.forEach((question) => {
      const answerId = question.id === currentQuestion.id ? lastOptionId : answers[question.id];
      if (answerId) {
        const option = question.options.find(opt => opt.id === answerId);
        option?.genres.forEach(genre => selectedGenres.add(genre));
      }
    });
    
    // Create a query from selected genres
    const genreQuery = Array.from(selectedGenres).slice(0, 3).join(" ");
    
    try {
      const results = await searchMovies(genreQuery);
      
      // Filter out movies that are already in the collection
      const collectionIds = collection.map(movie => movie.id);
      const newMovies = results.filter(movie => !collectionIds.includes(movie.id));
      
      if (newMovies.length > 0) {
        // Get a random movie from the filtered results
        const randomIndex = Math.floor(Math.random() * newMovies.length);
        setRecommendation(newMovies[randomIndex]);
      } else if (results.length > 0) {
        // If all results are in collection, just pick a random one anyway
        const randomIndex = Math.floor(Math.random() * results.length);
        setRecommendation(results[randomIndex]);
      }
    } catch (error) {
      console.error("Error finding recommendation:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetQuestionnaire = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setRecommendation(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after a short delay to allow the closing animation
    setTimeout(resetQuestionnaire, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {recommendation ? "Your Recommendation" : "Find Your Perfect Movie"}
          </DialogTitle>
          <DialogDescription>
            {!recommendation && !loading && `Question ${currentQuestionIndex + 1} of ${questions.length}`}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <LoadingState />
        ) : recommendation ? (
          <MovieRecommendation 
            recommendation={recommendation} 
            onTryAgain={resetQuestionnaire} 
          />
        ) : (
          <QuestionsList 
            currentQuestion={currentQuestion} 
            onAnswer={handleAnswer} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecommendationQuestionnaire;
