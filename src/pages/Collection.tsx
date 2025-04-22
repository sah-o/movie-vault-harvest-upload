
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import MovieGrid from "@/components/MovieGrid";
import { useMovies } from "@/context/MovieContext";
import { Button } from "@/components/ui/button";
import { searchMovies } from "@/services/movieApi";

const Collection = () => {
  const { collection } = useMovies();
  const [filter, setFilter] = useState<"all" | "watched" | "unwatched">("all");
  const [searchResults, setSearchResults] = useState<typeof collection | null>(null);

  const filteredMovies = searchResults || collection.filter((movie) => {
    if (filter === "watched") return movie.watched;
    if (filter === "unwatched") return !movie.watched;
    return true;
  });

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const results = collection.filter(movie => 
      movie.title.toLowerCase().includes(lowercaseQuery)
    );
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />
      
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">My Collection</h1>
          
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "watched" ? "default" : "outline"}
              onClick={() => setFilter("watched")}
            >
              Watched
            </Button>
            <Button
              variant={filter === "unwatched" ? "default" : "outline"}
              onClick={() => setFilter("unwatched")}
            >
              Unwatched
            </Button>
          </div>
        </div>
        
        {collection.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-xl mb-4">Your collection is empty</p>
            <Button onClick={() => window.location.href = "/"}>Browse Movies</Button>
          </div>
        ) : (
          <MovieGrid movies={filteredMovies} inCollectionView={true} />
        )}
      </main>
    </div>
  );
};

export default Collection;
