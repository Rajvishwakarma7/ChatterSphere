import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { getUserInfo } from "../../Pages/AuthProvider/AuthProvider";
import { GetApi, PostApi, deleteApi } from "../../Services/ApiServices";

function Blogs() {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryData = location.state;
  const userInfo = getUserInfo().loginInf;
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    blog_title: "",
    description: "",
    imageUrl: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!categoryData) {
      navigate(-1);
    } else {
      getBlogs();
    }
  }, [categoryData, navigate]);

  function getBlogs() {
    GetApi(`/blog?categoryId=${categoryData._id}`, async (err, res) => {
      if (err) {
        console.log(err);
      } else if (res.status === 200) {
        if (res.data.blogs.length > 0) {
          let getAllBlogs = await Promise.all(
            res.data.blogs.map(async (blogsItems) => {
              let getRes = await getBlogComments(blogsItems);
              return getRes;
            })
          );
          setBlogs(getAllBlogs);
        }
      } else {
        console.log(res);
      }
    });
  }

  const handleAddBlog = (e) => {
    if (!newBlog.blog_title || !newBlog.description || !newBlog.imageUrl) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    // e.preventDefault();
    const data = new FormData();
    data.append("blog_title", newBlog.blog_title);
    data.append("description", newBlog.description);
    data.append("image", newBlog.imageUrl);
    data.append("categoryId", categoryData._id);

    PostApi(
      "/blog/create",
      data,
      (err, res) => {
        if (err) {
          console.error("Error:", err);
        } else if (res.status === 200) {
          console.log("Category added successfully:", res.data);
          setNewBlog({ blog_title: "", description: "", imageUrl: null });
          setPreviewImage(null);
          setShowModal(false);
          getBlogs();
        } else {
          console.error("Failed to add category:", res);
        }
      },
      {}
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewBlog((prev) => ({ ...prev, imageUrl: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  // delete blog
  const handleDelete = async (blog) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        // console.log("blog", blog._id);
        deleteApi(
          "blog",
          { id: blog._id ? blog._id : "" },
          (err, res) => {
            if (err) {
              console.error("Error:", err);
            } else if (res.status === 200) {
              console.log("Category deleted successfully:", res.data);
              getBlogs();
            } else {
              console.error("Failed to add category:", res);
            }
          },
          {}
        );
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("An error occurred while deleting the blog");
      }
    }
  };

  // add Comments hadleSubmitComments
  function hadleSubmitComments(newComment, blog) {
    let data = {
      blogId: blog._id,
      comments: newComment,
    };
    PostApi(
      "/comment/create",
      data,
      (err, res) => {
        if (err) {
          console.error("Error:", err);
        } else if (res.status === 200) {
          // console.log("comment added successfully:", res.data);
          getBlogs();
        } else {
          console.error("Failed to add category:", res);
        }
      },
      {}
    );
  }

  async function getBlogComments(blog) {
    return new Promise((resolve, reject) => {
      GetApi(`/comment/get-blog-wise?blogId=${blog._id}`, (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else if (res.status === 200) {
          resolve({ ...blog, comments: res.data.result });
        } else {
          console.log(res);
          reject(new Error("Failed to fetch comments"));
        }
      });
    });
  }
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-center py-2 rounded-lg shadow-lg mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">Blogs</h1>
        <p className="text-lg mt-1 md:text-xl">
          Explore the latest blogs of Category
        </p>
      </div>

      {/* Category Details */}
      <div className="mb-6 py-2 px-5 flex justify-between items-center  bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-lg border border-blue-400 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">
            {categoryData?.title || "Category"}
          </h2>
          <p className="text-gray-600 italic leading-relaxed text-sm md:text-base">
            {categoryData?.description ||
              "Description for this category is currently unavailable."}
          </p>
        </div>
        <div className="text-right ">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            onClick={() => setShowModal(true)}
          >
            Add Blog
          </button>
        </div>
      </div>
      {/* Add Blog Button */}

      {/* Blogs List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => (
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Image Section */}
              <img
                src={blog?.image?.url}
                alt={blog.blog_title}
                className="w-full h-48 sm:h-56 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />

              {/* Content Section */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {blog.blog_title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {blog.description}
                </p>
              </div>

              {/* Action Icons */}
              <div className="absolute top-2 right-2 flex flex-col items-center gap-2">
                {/* Edit Button */}
                <div
                  className="text-white bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 shadow-md transition"
                  title="Edit Blog"
                  onClick={() => console.log("Edit clicked for:", blog)}
                >
                  <FaEdit className="w-5 h-5" />
                </div>

                {/* Delete Button */}
                <div
                  className="text-white bg-red-500 p-2 rounded-full cursor-pointer hover:bg-red-600 shadow-md transition"
                  title="Delete Blog"
                  onClick={() => handleDelete(blog)}
                >
                  <FaTrashAlt className="w-5 h-5" />
                </div>
              </div>

              {/* Comments Section */}
              <div className="p-4 border-t">
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  Comments
                </h4>

                {/* Display Comments */}
                <div className="space-y-3 max-h-36 overflow-y-auto">
                  {blog.comments?.length ? (
                    blog.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-100 p-2 rounded-lg">
                        <p className="text-sm text-gray-800">
                          {comment.comments}
                        </p>
                        {/* <span className="text-xs text-gray-500">user </span> */}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>

                {/* Add Comment Form */}
                <form
                  className="mt-3 flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newComment = e.target.comment.value.trim();
                    hadleSubmitComments(newComment, blog);
                    e.target.reset();
                  }}
                >
                  <input
                    type="text"
                    name="comment"
                    placeholder="Add a comment..."
                    className="flex-1 p-2 border rounded-lg text-sm text-gray-800"
                    required
                  />
                  <button
                    type="submit"
                    className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          ))) || (
          <>
            <h5>No Data Found !</h5>
          </>
        )}
      </div>

      {/* Add Blog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-2/5 sm:w-2/5 lg:w-2/5">
            <div className="p-3 px-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Add New Blog
              </h2>
              <div className="mb-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Blog Title
                </label>
                <input
                  type="text"
                  value={newBlog.blog_title}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, blog_title: e.target.value })
                  }
                  className="w-full border rounded px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={newBlog.description}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, description: e.target.value })
                  }
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                  rows="1"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
              <div className="flex justify-between">
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

                <div className="flex justify-end items-center">
                  <div>
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition mr-2"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      onClick={handleAddBlog}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blogs;
