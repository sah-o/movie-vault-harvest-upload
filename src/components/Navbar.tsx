
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import RecommendationQuestionnaire from "./RecommendationQuestionnaire";

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendationOpen, setRecommendationOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      <nav className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border p-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-primary font-bold text-2xl">Movie Vault</span>
            </Link>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 max-w-md flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Button type="submit" className="ml-2">Search</Button>
          </form>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setRecommendationOpen(true)}
                    className="text-primary"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span className="sr-only">Get Movie Recommendations</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get Movie Recommendations</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Link to="/collection">
              <Button variant="outline">My Collection</Button>
            </Link>
          </div>
        </div>
      </nav>
      
      <RecommendationQuestionnaire 
        open={recommendationOpen} 
        onOpenChange={setRecommendationOpen} 
      />
    </>
  );
};

export default Navbar;
