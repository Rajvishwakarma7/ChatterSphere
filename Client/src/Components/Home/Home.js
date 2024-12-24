import React, { useEffect, useState } from "react";
import { GetApi, PostApi, PutApi } from "../../Services/ApiServices";
import { FaEdit, FaPlus, FaRegEye, FaTimes } from "react-icons/fa";
import { getUserInfo } from "../../Pages/AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";

function Home() {
  const userInfo = getUserInfo().loginInf;
  const [categoryData, setCategoryData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditOrAdd, setisEditOrAdd] = useState("Add");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEdit, setIsEdit] = useState(false); // New state to track edit mode
  const [editCategoryId, setEditCategoryId] = useState(null); // Track which category is being edited
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    GetApi("/category", (err, res) => {
      if (err) {
        console.log(err);
      } else if (res.status === 200) {
        setCategoryData(res.data.allCategory);
      } else {
        console.log(res);
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    // Generate a preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleEdit = (category) => {
    setShowAddForm(true);
    setIsEdit(true);
    setEditCategoryId(category._id); // Assuming each category has a unique `_id`
    setFormData({
      title: category.title,
      description: category.description,
      image: null, // Reset the image, as the user will upload a new one if needed
    });
    setPreviewImage(category?.imageDetail?.url || null); // Set the preview image
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.image) {
      data.append("image", formData.image);
    }
    data.append("userId", userInfo.userId);

    if (isEditOrAdd === "Add") {
      PostApi(
        "/category",
        data,
        (err, res) => {
          if (err) {
            console.error("Error:", err);
          } else if (res.status === 200) {
            console.log(
              isEdit
                ? "Category updated successfully:"
                : "Category added successfully:",
              res.data
            );
            fetchCategories();
            setShowAddForm(false);
            setFormData({ title: "", description: "", image: null });
            setPreviewImage(null); // Clear preview after submission
            setIsEdit(false); // Reset edit mode
            setEditCategoryId(null); // Clear edit category ID
          } else {
            console.error("Failed to submit category:", res);
          }
        },
        {}
      );
    } else if (isEditOrAdd === "Edit") {
      PutApi(
        `/category/update?categoryId=${editCategoryId ? editCategoryId : ""}`,
        data,
        (err, res) => {
          if (err) {
            console.error("Error:", err);
          } else if (res.status === 200) {
            console.log(
              isEdit
                ? "Category updated successfully:"
                : "Category added successfully:",
              res.data
            );
            // fetchCategories();
            // setShowAddForm(false);
            // setFormData({ title: "", description: "", image: null });
            // setPreviewImage(null); // Clear preview after submission
            // setIsEdit(false); // Reset edit mode
            // setEditCategoryId(null); // Clear edit category ID
          } else {
            console.error("Failed to submit category:", res);
          }
        },
        {}
      );
    }
  };
  // console.log("is edit", isEditOrAdd);
  return (
    <div className="container mx-auto px-4 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

        <button
          onClick={() => {
            setisEditOrAdd("Add");
            setShowAddForm(!showAddForm);
            if (showAddForm) {
              // Reset form on closing
              setFormData({ title: "", description: "", image: null });
              setPreviewImage(null);
              setIsEdit(false);
              setEditCategoryId(null);
            }
          }}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
        >
          {showAddForm ? (
            <>
              <FaTimes className="mr-2" />
              Cancel
            </>
          ) : (
            <>
              <FaPlus className="mr-2" />
              Category
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">
              Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required={!isEdit} // Make image optional for updates
            />
            {previewImage && (
              <div className="mt-4">
                <p className="text-gray-600 text-sm mb-2">Preview:</p>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover border rounded"
                />
              </div>
            )}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow transition"
            >
              {isEdit ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoryData.map((catItem, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-transform duration-300"
          >
            {/* Image Section */}
            <div className="relative">
              <img
                className="w-full h-48 object-cover"
                src={
                  catItem?.imageDetail?.url || "https://via.placeholder.com/150"
                }
                alt={catItem.title}
              />
              {/* Action Icons */}
              <div className="absolute top-2 right-2 flex flex-col items-center gap-2">
                <div
                  className="text-white bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 shadow-md transition"
                  title="Edit Item"
                  onClick={() => {
                    setisEditOrAdd("Edit");
                    handleEdit(catItem);
                  }}
                >
                  <FaEdit className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {catItem.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {catItem.description}
              </p>
              {/* View Button */}
              <button
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition"
                onClick={() => {
                  navigate("/blogs", { state: catItem });
                }}
              >
                <FaRegEye className="w-5 h-5" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
