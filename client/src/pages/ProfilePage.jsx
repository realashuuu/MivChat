import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }
    const reader = new FileReader();

    reader.readAsDataURL(selectedImage);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      const success = await updateProfile({
        profilePic: base64Image,
        fullName: name,
        bio,
      });
      if (success) navigate("/");
    };
  };
  return (
    <div className=" flex justify-center items-center min-h-screen bg-cover bg-no-repeat  ">
      <div className=" w-5/6 max-w-2xl backdrop-blur text-gray-300 border-2 border-gray-600 flex items-center justify-between gap-6 max:sm-flex-col-reverse rounded-lg ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3>Profile details</h3>
          <label
            htmlFor="avatar"
            className="gap-4 cursor-pointer flex items-center group"
          >
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept="image/png, image/jpeg, image/jpg"
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              className={`w-12 h-12 group-hover:opacity-90 transition-opacity ${selectedImage && "rounded-full"}`}
              alt=""
            />{" "}
            Upload Profile Picture
          </label>

          <input
            required
            className="bg-gray-800/50 border border-gray-500 rounded-lg p-2 text-sm text-white placeholder-gray-400 outline-none focus:border-violet-500 transition-colors"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Write Profile bio "
            className="bg-gray-800/50 border border-gray-500 rounded-lg p-2 text-sm text-white placeholder-gray-400 outline-none focus:border-violet-500 transition-colors"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-400 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white py-3 rounded-lg text-sm font-medium shadow-md transition-all cursor-pointer mt-2"
          >
            Save
          </button>
        </form>
        <img
          src={
            selectedImage
              ? URL.createObjectURL(selectedImage)
              : authUser?.profilePic || assets.logo_icon
          }
          alt="Profile"
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
