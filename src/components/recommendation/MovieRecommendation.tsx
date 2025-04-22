
import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { MovieResult } from "@/services/movieApi";

interface MovieRecommendationProps {
  recommendation: MovieResult;
  onTryAgain: () => void;
}

const MovieRecommendation = ({ recommendation, onTryAgain }: MovieRecommendationProps) => {
  return (
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
        <Button variant="outline" onClick={onTryAgain} className="flex-1">
          Try Again
        </Button>
        <Button className="flex-1" asChild>
          <a href={`/movie/${recommendation.id}`}>See Details</a>
        </Button>
      </div>
    </div>
  );
};

export default MovieRecommendation;
