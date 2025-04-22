
export type QuestionOptionType = {
  id: string;
  text: string;
  genres: string[];
};

export type Question = {
  id: string;
  text: string;
  options: QuestionOptionType[];
};

export const questions: Question[] = [
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
