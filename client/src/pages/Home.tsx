import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddMovieModal from "@/components/AddMovieModal";
import { ToastContainer,toast} from "react-toastify";
import { Pencil, Trash2 } from "lucide-react";
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

  useEffect(() => {
    const moviesData = async () => {
      try {
        const response = await axios.get("/movies/all");
        setMovies(response.data.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    moviesData();
  }, []); // ✅ dependency array added


  const handleDelete = async (id: number) => {
  try {
    // Confirm before delete
    const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
    if (!confirmDelete) return;

    // API call
    const response = await axios.delete(`/movies/delete/${id}`);

    if (response.status === 200) {
      toast.success("Movie deleted successfully ✅", {
        position: "top-right",
        autoClose: 2000,
      });

      // UI refresh
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete movie ❌", {
      position: "top-right",
      autoClose: 3000,
    });
  }
};

  const handleEdit = () => {};


  return (
    <>
      {/* Mobile View */}
      <div className="w-screen h-screen space-y-6 md:hidden">
      <ToastContainer />
        {/* Search Bar */}
        <div className="w-full flex justify-center">
          <div className="flex p-4 space-x-4">
            <Input
              id="search"
              type="text"
              placeholder="Enter movie name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline">Search</Button>
          </div>
        </div>
<AddMovieModal />
        {/* Table Section */}
        <div className="flex justify-center">
          <div className="overflow-x-auto">
            <Table className="border border-gray-300">
              <TableCaption>List of Movies</TableCaption>
              <TableHeader>
                <TableRow className="border-b border-gray-300">
                  <TableHead className="w-[100px] border-r border-gray-300">Title</TableHead>
                  <TableHead className="border-r border-gray-300">Type</TableHead>
                  <TableHead className="border-r border-gray-300">Director</TableHead>
                  <TableHead className="text-right border-r border-gray-300">Budget</TableHead>
                  <TableHead className="text-right border-r border-gray-300">Location</TableHead>
                  <TableHead className="text-right border-r border-gray-300">Duration</TableHead>
                  <TableHead className="text-right border-r border-gray-300">Year</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
               {movies.length > 0 ? (
  movies.map((movie) => (
    <TableRow key={movie.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
      <TableCell className="font-medium border-r border-gray-200">
        {movie.title}
      </TableCell>
      <TableCell className="border-r border-gray-200">{movie.type}</TableCell>
      <TableCell className="border-r border-gray-200">{movie.director}</TableCell>
      <TableCell className="text-right border-r border-gray-200">
        ${movie.budget.toFixed(2)}
      </TableCell>
      <TableCell className="text-right border-r border-gray-200">
        {movie.location}
      </TableCell>
      <TableCell className="text-right border-r border-gray-200">
        {movie.duration}
      </TableCell>
      <TableCell className="text-right border-r border-gray-200">
        {movie.year}
      </TableCell>

      {/* 🟢 Edit & Delete Buttons */}
      <TableCell className="text-right flex justify-end space-x-3 pr-3">
        <button
          onClick={() => handleEdit()}
          className="text-blue-500 hover:text-blue-700 transition"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => handleDelete(movie.id)}
          className="text-red-500 hover:text-red-700 transition"
        >
          <Trash2 size={18} />
        </button>
      </TableCell>
    </TableRow>
  ))
) : (
  <TableRow>
    <TableCell colSpan={8} className="text-center py-4">
      No movies found.
    </TableCell>
  </TableRow>
)}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Desktop View Placeholder */}
      <div className="hidden md:block w-screen h-screen from-black via-black to-gray-800"></div>
    </>
  );
};

export default Home;
