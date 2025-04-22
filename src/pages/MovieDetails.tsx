
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMovieDetails, MovieResult } from "@/services/movieApi";
import { useMovies } from "@/context/MovieContext";
import { Skeleton } from "@/components/ui/skeleton";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCollection, removeFromCollection, isInCollection, toggleWatched, collection } = useMovies();
  
  const inCollection = id ? isInCollection(id) : false;
  const watched = id ? collection.find(m => m.id === id)?.watched || false : false;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const details = await getMovieDetails(id);
        setMovie(details);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Skeleton className="h-10 w-40" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="aspect-[2/3] rounded-lg" />
            
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
              <div className="pt-4">
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Movie not found</p>
          <Button asChild>
            <Link to="/">Go Back Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  const handleCollectionAction = () => {
    if (inCollection) {
      removeFromCollection(movie.id);
    } else {
      addToCollection(movie);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Button asChild variant="outline" className="mb-8">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Movies
          </Link>
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="sticky top-24 rounded-lg overflow-hidden border border-border">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <p className="text-muted-foreground">{year}</p>
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                ★ {movie.vote_average.toFixed(1)}
              </div>
            </div>
            
            <div className="flex gap-3 mb-8">
              <Button
                onClick={handleCollectionAction}
                className="flex-1 sm:flex-none"
                variant={inCollection ? "destructive" : "default"}
              >
                {inCollection ? (
                  <>
                    <Trash className="mr-2 h-4 w-4" /> Remove from Collection
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add to Collection
                  </>
                )}
              </Button>
              
              {inCollection && (
                <Button
                  onClick={() => toggleWatched(movie.id)}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  {watched ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" /> Mark Unwatched
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" /> Mark Watched
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <div className="prose text-foreground max-w-none">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-muted-foreground">{movie.overview || "No overview available."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
