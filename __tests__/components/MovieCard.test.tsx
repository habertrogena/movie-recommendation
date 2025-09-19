import { render, screen } from "@testing-library/react";
import MovieCard from "@/components/MovieCard";
import type { Movie } from "@/types/tmdb";

const mockMovie: Movie = {
  id: 1,
  title: "Inception",
  original_title: "Inception",
  overview: "A mind-bending thriller",
  poster_path: "/poster.jpg",
  backdrop_path: null,
  release_date: "2010-07-16",
  vote_average: 8.8,
  vote_count: 10000,
  popularity: 5000,
  adult: false,
  video: false,
  genre_ids: [28, 878],
  original_language: "en",
};

describe("MovieCard", () => {
  it("renders movie title and overview", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("A mind-bending thriller")).toBeInTheDocument();
  });
});
