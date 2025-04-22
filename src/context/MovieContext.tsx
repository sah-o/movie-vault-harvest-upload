
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

interface Movie {
  id: string;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
  watched: boolean;
}

interface MovieContextType {
  collection: Movie[];
  addToCollection: (movie: Omit<Movie, "watched">) => void;
  removeFromCollection: (id: string) => void;
  toggleWatched: (id: string) => void;
  isInCollection: (id: string) => boolean;
}

const MovieContext = createContext<MovieContextType | null>(null);

export const MovieProvider = ({ children }: { children: React.ReactNode }) => {
  const [collection, setCollection] = useState<Movie[]>(() => {
    const saved = localStorage.getItem("movieCollection");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("movieCollection", JSON.stringify(collection));
  }, [collection]);

  const addToCollection = (movie: Omit<Movie, "watched">) => {
    if (isInCollection(movie.id)) {
      toast.info("Movie already in collection");
      return;
    }
    
    setCollection([...collection, { ...movie, watched: false }]);
    toast.success("Added to collection");
  };

  const removeFromCollection = (id: string) => {
    setCollection(collection.filter((movie) => movie.id !== id));
    toast.success("Removed from collection");
  };

  const toggleWatched = (id: string) => {
    setCollection(
      collection.map((movie) =>
        movie.id === id ? { ...movie, watched: !movie.watched } : movie
      )
    );
  };

  const isInCollection = (id: string) => {
    return collection.some((movie) => movie.id === id);
  };

  return (
    <MovieContext.Provider
      value={{
        collection,
        addToCollection,
        removeFromCollection,
        toggleWatched,
        isInCollection,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};
