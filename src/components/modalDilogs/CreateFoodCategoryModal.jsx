"use client";

import { useState } from "react";
import { useModal } from "@/hooks/zusthook";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { createCategory } from "@/actions/category";
import { useTheme } from "@/hooks/use-theme";

const CreateFoodCategoryModal = () => {
  const { theme } = useTheme();
  const params = useParams();
  const hotelId = params.hotelId;
  const { isOpen, type, reloadCom, onClose } = useModal();
  const isModelOpen = isOpen && type === "create-food-category";
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
  });

  if (!isModelOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createCategory({
        hotelId,
        categoryName: formData.categoryName,
        description: formData.description,
      });
      if (response.success) {
        setFormData({ categoryName: "", description: "" });
        toast.success("category created successfully");
        reloadCom();
      } else {
        toast.error("somthing went wrong");
        throw new Error(response.message || "Failed to create category");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent
        className={`w-[480px] overflow-y-scroll theme-${theme} border border-color5`}
        aria-describedby="create-food-category"
      >
        <DialogHeader>
          <DialogTitle>
            <div className="font-semibold text-2xl text-color5 mb-3 mx-5">
              Create Category
            </div>
            <div className="h-[2px] bg-color5 mx-5"></div>
          </DialogTitle>
        </DialogHeader>
        <div className="px-5">
          <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
            <div className="text-color5 font-semibold">Category Name:</div>
            <input
              type="text"
              name="categoryName"
              placeholder="Enter the category name"
              className="p-2 w-full text-color5 border border-color1 outline-color3 rounded hover:border-color4 placeholder:text-color3 mb-1"
              required
              value={formData.categoryName}
              onChange={handleChange}
            />

            <div className="text-color5 font-semibold">Category Description:</div>
            <input
              type="text"
              name="description"
              placeholder="Enter the category description"
              className="p-2 w-full text-color5 border border-color1 outline-color3 rounded hover:border-color4 placeholder:text-color3 mb-1"
              required
              value={formData.description}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full bg-color5 text-white p-2 rounded hover:opacity-90"
            >
              Create Category
            </button>
            <button
              type="button"
              className="w-full bg-white text-color5 p-2 rounded border border-color5 hover:opacity-90"
              onClick={onClose}
            >
              Cancel
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFoodCategoryModal;
