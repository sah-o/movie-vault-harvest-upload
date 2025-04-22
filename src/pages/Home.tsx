
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MovieGrid from "@/components/MovieGrid";
import { getPopularMovies, searchMovies, MovieResult } from "@/services/movieApi";

const Home = () => {
  const [movies, setMovies] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const results = await getPopularMovies();
        setMovies(results);
      } catch (error) {
        console.error("Failed to fetch popular movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (error) {
      console.error("Failed to search movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />
      
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Movies"}
        </h1>
        
        <MovieGrid movies={movies} isLoading={loading} />
      </main>
    </div>
  );
};

export default Home;
