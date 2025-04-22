
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { searchMovies, MovieResult } from "@/services/movieApi";
import { useMovies } from "@/context/MovieContext";
import { Loader2, ThumbsUp } from "lucide-react";
import { DialogDescription } from "@/components/ui/dialog";

type Question = {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    genres: string[];
  }[];
};

const questions: Question[] = [
  {
    id: "mood",
    text: "What kind of mood are you in today?",
    options: [
      { id: "happy", text: "Cheerful and Upbeat", genres: ["comedy", "animation", "family"] },
      { id: "thoughtful", text: "Thoughtful and Reflective", genres: ["drama", "documentary"] },
      { id: "excited", text: "Looking for Excitement", genres: ["action", "adventure", "thriller"] },
      { id: "scared", text: "Want to be Scared", genres: ["horror", "thriller"] },
    ],
  },
  {
    id: "time",
    text: "How much time do you have?",
    options: [
      { id: "short", text: "Under 2 hours", genres: ["comedy", "thriller", "horror"] },
      { id: "medium", text: "2-3 hours", genres: ["drama", "action", "adventure"] },
      { id: "long", text: "I have all day", genres: ["sci-fi", "fantasy"] },
    ],
  },
  {
    id: "company",
    text: "Who are you watching with?",
    options: [
      { id: "alone", text: "Just myself", genres: ["thriller", "horror", "drama"] },
      { id: "family", text: "Family", genres: ["family", "animation", "comedy"] },
      { id: "friends", text: "Friends", genres: ["action", "comedy", "adventure"] },
      { id: "date", text: "Date night", genres: ["romance", "comedy", "drama"] },
    ],
  },
];

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
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-center">Finding the perfect movie for you...</p>
          </div>
        ) : recommendation ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative aspect-[2/3] w-48 overflow-hidden rounded-md">
              {recommendation.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w342${recommendation.poster_path}`} 
                  alt={recommendation.title} 
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold">{recommendation.title}</h3>
            
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-primary" />
              <span>Based on your preferences</span>
            </div>
            
            <p className="text-sm text-center line-clamp-3">{recommendation.overview}</p>
            
            <div className="flex w-full gap-2">
              <Button variant="outline" onClick={resetQuestionnaire} className="flex-1">
                Try Again
              </Button>
              <Button className="flex-1" asChild>
                <a href={`/movie/${recommendation.id}`}>See Details</a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">{currentQuestion.text}</p>
            
            <RadioGroup>
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    id={option.id} 
                    value={option.id} 
                    onClick={() => handleAnswer(option.id)}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer flex-1 py-2">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecommendationQuestionnaire;
