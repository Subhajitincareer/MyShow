import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMovieModal = () => {
  const [movieData, setMovieData] = useState({
    title: "",
    type: "",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/movies/create", movieData);
      toast.success(`🎬 ${movieData.title} added successfully!`);
      setMovieData({
        title: "",
        type: "",
        director: "",
        budget: "",
        location: "",
        duration: "",
        year: "",
      });
    } catch (error) {
      toast.error("❌ Failed to add movie. Try again!");
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            + Add Movie
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Movie</DialogTitle>
          </DialogHeader>

          <form className="space-y-3 mt-3" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter movie title"
                value={movieData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                value={movieData.type}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select type</option>
                <option value="Movie">Movie</option>
                <option value="TvShow">TV Show</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="director">Director</Label>
              <Input
                id="director"
                name="director"
                placeholder="Enter director name"
                value={movieData.director}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="Enter budget"
                value={movieData.budget}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Enter shooting location"
                value={movieData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (mins)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="Enter duration"
                value={movieData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="year">Release Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                placeholder="Enter release year"
                value={movieData.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Save
              </Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AddMovieModal;
