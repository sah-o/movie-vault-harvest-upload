
import { toast } from "sonner";

const API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c"; // This is a demo key from TMDB's documentation
const BASE_URL = "https://api.themoviedb.org/3";

export interface MovieResult {
  id: string;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
}

export const searchMovies = async (query: string): Promise<MovieResult[]> => {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    toast.error("Failed to fetch movies");
    return [];
  }
};

export const getMovieDetails = async (id: string): Promise<MovieResult | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    toast.error("Failed to fetch movie details");
    return null;
  }
};

export const getPopularMovies = async (): Promise<MovieResult[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    toast.error("Failed to fetch popular movies");
    return [];
  }
};
