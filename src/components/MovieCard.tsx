
import React from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Plus, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMovies } from "@/context/MovieContext";

interface MovieCardProps {
  id: string;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  rating: number;
  inCollectionView?: boolean;
}

const MovieCard = ({
  id,
  title,
  posterPath,
  releaseDate,
  rating,
  inCollectionView = false,
}: MovieCardProps) => {
  const { addToCollection, removeFromCollection, isInCollection, toggleWatched, collection } = useMovies();
  const inCollection = isInCollection(id);
  const watched = collection.find(m => m.id === id)?.watched || false;

  const year = releaseDate ? new Date(releaseDate).getFullYear() : "Unknown";
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <Card className="overflow-hidden h-full flex flex-col bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 border border-border">
      <Link to={`/movie/${id}`} className="relative overflow-hidden aspect-[2/3] flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute bottom-2 left-2 z-20 px-2 py-1 bg-black/60 rounded text-xs font-semibold">
          ★ {rating.toFixed(1)}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-muted-foreground text-sm mb-3">{year}</p>
        
        <div className="mt-auto flex gap-2">
          {inCollectionView ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => toggleWatched(id)}
              >
                {watched ? <Eye className="mr-1 h-4 w-4" /> : <EyeOff className="mr-1 h-4 w-4" />}
                {watched ? "Watched" : "Unwatched"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFromCollection(id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant={inCollection ? "outline" : "default"}
              size="sm"
              className="flex-1"
              onClick={() => {
                if (!inCollection) {
                  addToCollection({
                    id,
                    title,
                    poster_path: posterPath || "",
                    release_date: releaseDate,
                    overview: "",
                    vote_average: rating,
                  });
                }
              }}
              disabled={inCollection}
            >
              {inCollection ? "In Collection" : <><Plus className="mr-1 h-4 w-4" /> Add to Collection</>}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MovieCard;
