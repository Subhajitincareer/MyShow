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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";

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

interface AddMovieModalProps {
  onMovieAdded: () => void;
  movie?: Movie | null;
  mode?: "add" | "edit";
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({
  onMovieAdded,
  movie = null,
  mode = "add",
}) => {
  const [movieData, setMovieData] = useState({
    title: "",
    type: "",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
  });
  const [open, setOpen] = useState(false);

  const isEditMode = mode === "edit" && movie !== null;

  // Pre-populate form when editing
  useEffect(() => {
    if (isEditMode && movie) {
      setMovieData({
        title: movie.title,
        type: movie.type,
        director: movie.director,
        budget: movie.budget.toString(),
        location: movie.location,
        duration: movie.duration,
        year: movie.year.toString(),
      });
    }
  }, [movie, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Update existing movie
        await axios.put(`https://myshow-r1l8.onrender.com/movies/update/${movie.id}`, movieData);
        toast.success(`🎬 ${movieData.title} updated successfully!`);
      } else {
        // Create new movie
        await axios.post("/movies/create", movieData);
        toast.success(`🎬 ${movieData.title} added successfully!`);
      }

      // Reset form
      setMovieData({
        title: "",
        type: "",
        director: "",
        budget: "",
        location: "",
        duration: "",
        year: "",
      });

      // Close modal
      setOpen(false);

      // Refresh parent movie list
      onMovieAdded();
    } catch (error) {
      const errorMessage = isEditMode
        ? "❌ Failed to update movie. Try again!"
        : "❌ Failed to add movie. Try again!";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (isEditMode && movie) {
      setMovieData({
        title: movie.title,
        type: movie.type,
        director: movie.director,
        budget: movie.budget.toString(),
        location: movie.location,
        duration: movie.duration,
        year: movie.year.toString(),
      });
    } else {
      setMovieData({
        title: "",
        type: "",
        director: "",
        budget: "",
        location: "",
        duration: "",
        year: "",
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <button className="text-blue-500 hover:text-blue-700 transition">
            <Pencil size={18} />
          </button>
        ) : (
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            + Add Movie
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Movie" : "Add New Movie"}
          </DialogTitle>
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
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className={
                isEditMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {isEditMode ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMovieModal;
