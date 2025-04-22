
import React from "react";
import MovieCard from "./MovieCard";

interface Movie {
  id: string;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface MovieGridProps {
  movies: Movie[];
  inCollectionView?: boolean;
  isLoading?: boolean;
}

const MovieGrid = ({ movies, inCollectionView = false, isLoading = false }: MovieGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="h-[400px] rounded-md overflow-hidden">
            <div className="h-[300px] bg-secondary shimmer"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-secondary shimmer rounded"></div>
              <div className="h-4 w-1/2 bg-secondary shimmer rounded"></div>
              <div className="h-8 w-full bg-secondary shimmer rounded mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          posterPath={movie.poster_path}
          releaseDate={movie.release_date}
          rating={movie.vote_average}
          inCollectionView={inCollectionView}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
