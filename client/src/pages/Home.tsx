// Home.tsx (Parent Component)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddMovieModal from "@/components/AddMovieModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2 } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  type: string;
  director: string;
  budget: number;
  location: string;
  duration: string;
  year: number;
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  // Fetch movies from API
  const fetchMovies = async () => {
    try {
      const response = await axios.get("https://myshow-r1l8.onrender.com/movies/all");
      setMovies(response.data.data);
      setFilteredMovies(response.data.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies ❌");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Search functionality
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [search, movies]);

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this movie?"
      );
      if (!confirmDelete) return;

      const response = await axios.delete(`https://myshow-r1l8.onrender.com/movies/delete/${id}`);

      if (response.status === 200) {
        toast.success("Movie deleted successfully ✅");
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete movie ❌");
    }
  };

  return (
    <>
{/* Mobile View */}
<div className="w-screen min-h-screen md:hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <ToastContainer position="top-right" autoClose={2000} />

  {/* Header */}
  <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
    <div className="px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🎬</span>
          </div>
          <h1 className="text-lg font-bold text-white">Movies</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Total</p>
          <p className="text-sm font-bold text-white">{movies.length}</p>
        </div>
      </div>
    </div>
  </header>

  {/* Search Bar */}
  <div className="px-4 py-4 bg-slate-800/30">
    <div className="relative">
      <Input
        id="search"
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>
  </div>

  {/* Add Movie Button */}
  <div className="px-4 pb-4">
    <AddMovieModal onMovieAdded={fetchMovies} />
  </div>

  {/* Movies Grid - Card Layout */}
  <div className="px-4 pb-4 space-y-4">
    {filteredMovies.length > 0 ? (
      filteredMovies.map((movie) => (
        <div
          key={movie.id}
          className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-4 py-3 border-b border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg leading-tight">
                  {movie.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      movie.type === "Movie"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    }`}
                  >
                    {movie.type}
                  </span>
                  <span className="text-slate-400 text-xs">{movie.year}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2 ml-2">
                <AddMovieModal
                  onMovieAdded={fetchMovies}
                  movie={movie}
                  mode="edit"
                />
                <button
                  onClick={() => handleDelete(movie.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-4 py-3 space-y-3">
            {/* Director */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Director</span>
              <span className="text-white text-sm font-medium">{movie.director}</span>
            </div>

            {/* Budget */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Budget</span>
              <span className="text-green-400 text-sm font-mono font-semibold">
                ${movie.budget.toLocaleString()}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Location</span>
              <span className="text-white text-sm">{movie.location}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Duration</span>
              <span className="text-white text-sm">{movie.duration} mins</span>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-slate-800/30 px-4 py-2 border-t border-slate-700">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>ID: {movie.id}</span>
              <span>Year: {movie.year}</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-slate-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
          </svg>
        </div>
        <p className="text-slate-300 font-medium text-center mb-2">
          {search ? "No movies found" : "No movies yet"}
        </p>
        <p className="text-slate-500 text-sm text-center mb-6">
          {search
            ? "Try adjusting your search"
            : "Add your first movie to get started"}
        </p>
        {!search && <AddMovieModal onMovieAdded={fetchMovies} />}
      </div>
    )}
  </div>

  {/* Footer Stats */}
  {filteredMovies.length > 0 && (
    <div className="sticky bottom-0 bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">
          Showing {filteredMovies.length} of {movies.length}
        </span>
        <span className="text-slate-400">
          Budget: ${movies.reduce((sum, m) => sum + m.budget, 0).toLocaleString()}
        </span>
      </div>
    </div>
  )}
</div>


 {/* Desktop View */}
<div className="hidden md:block w-screen min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <ToastContainer position="top-right" autoClose={2000} />
  
  {/* Header */}
  <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">🎬</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Movie Management</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-slate-400">Total Movies</p>
            <p className="text-xl font-bold text-white">{movies.length}</p>
          </div>
        </div>
      </div>
    </div>
  </header>

  {/* Main Content */}
  <main className="container mx-auto px-6 py-8">
    {/* Search & Actions Bar */}
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Input
              id="search-desktop"
              type="text"
              placeholder="Search movies by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <AddMovieModal onMovieAdded={fetchMovies} />
        </div>
      </div>
    </div>

    {/* Table Card */}
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">
          {search ? `Search Results (${filteredMovies.length})` : 'All Movies'}
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-700 hover:bg-slate-700/30">
              <TableHead className="text-slate-300 font-semibold">Title</TableHead>
              <TableHead className="text-slate-300 font-semibold">Type</TableHead>
              <TableHead className="text-slate-300 font-semibold">Director</TableHead>
              <TableHead className="text-slate-300 font-semibold text-right">Budget</TableHead>
              <TableHead className="text-slate-300 font-semibold">Location</TableHead>
              <TableHead className="text-slate-300 font-semibold text-center">Duration</TableHead>
              <TableHead className="text-slate-300 font-semibold text-center">Year</TableHead>
              <TableHead className="text-slate-300 font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie, index) => (
                <TableRow
                  key={movie.id}
                  className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                    index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/10'
                  }`}
                >
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{movie.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        movie.type === "Movie"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}
                    >
                      {movie.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-300">{movie.director}</TableCell>
                  <TableCell className="text-right text-slate-300 font-mono">
                    ${movie.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-slate-300">{movie.location}</TableCell>
                  <TableCell className="text-center text-slate-300">
                    {movie.duration} mins
                  </TableCell>
                  <TableCell className="text-center text-slate-300">{movie.year}</TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      {/* Edit Button */}
                      <AddMovieModal
                        onMovieAdded={fetchMovies}
                        movie={movie}
                        mode="edit"
                      />

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete movie"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-slate-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-300 font-medium">
                        {search ? "No movies match your search" : "No movies found"}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        {search
                          ? "Try adjusting your search terms"
                          : "Add your first movie to get started"}
                      </p>
                    </div>
                    {!search && (
                      <AddMovieModal onMovieAdded={fetchMovies} />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer */}
      {filteredMovies.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/20">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              Showing {filteredMovies.length} of {movies.length} movies
            </span>
          </div>
        </div>
      )}
    </div>
  </main>
</div>

    </>
  );
};

export default Home;
