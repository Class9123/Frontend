import React, {
  useState,
  useEffect,
} from 'react';
import {
  useNavigate
} from "react-router-dom";
import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
  faCamera
} from '@fortawesome/free-solid-svg-icons';
import useUserStore from './user/useUserStore.js';
import socket from './lib/socket.js';
import {
  toast
} from 'react-hot-toast';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const {
    credentials,
    setCredentials
  } = useUserStore();
  const [url,
    setUrl] = useState(credentials.pr);
  const [selectedImage,
    setSelectedImage] = useState(null);
  const [loading,
    setLoading] = useState(false);
  const [imageUploading,
    setImageUploading] = useState(false); // To track if the image is being uploaded
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check image size
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size exceeds 10MB. Please upload a smaller image.');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        console.log('Image selected:', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle apply changes
  const handleApplyChanges = () => {
    if (imageUploading) {
      toast.loading('Image is still uploading, please wait...');
      return;
    }

    console.log('Changes applied');

    // Check if an image is selected
    if (selectedImage) {
      setImageUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        // Emit the profile image to the server
        socket.emit('profileImageUpdate', {
          image: reader.result
        });
        setLoading(true);
        console.log('Image sent to socket:', reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  useEffect(() => {
    // Read from global store
    setUrl(credentials.pr);

    // Listen for changes from the socket
    socket.on('prUrl', (response) => {
      setUrl(response.url);
      setCredentials((prev) => ({
        ...prev,
        pr: response.url,
      }));
      setTimeout(()=> {
        setLoading(false);
        setImageUploading(false);
      }, 100)
    });

    return () => {
      socket.off('prUrl');
    };
  }, [credentials.pr, setCredentials]);

  const logout = () => {
    localStorage.setItem("data", null)
    navigate("/", {
      replace: true
    })
    window.location.reload()
  }

  return (
    <div className="h-full w-full">
      <div className="overflow-hidden flex justify-center items-center mt-[10vh]">
        {/* Image Container */}
        {loading ? (
          <div className="skeleton w-[60vw] h-[60vw] rounded-full" />
        ): (
          <div className="relative">
            {/* Profile Image */}
            <img
            src={url}
            className="shadow w-[60vw] h-[60vw] rounded-full object-cover"
            alt="Profile"
            />

          {/* Camera Icon */}
          <div className="absolute flex items-center justify-center bottom-2 right-2 bg-white p-2 w-[10vw] h-[10vw] rounded-full shadow-md cursor-pointer">
            <label htmlFor="imageUpload" className="cursor-pointer">
              <FontAwesomeIcon icon={faCamera} className="text-gray-700 text-lg" />
              <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              />
          </label>
        </div>
      </div>
    )}
  </div>

  {/* Apply Changes Button */}
  <div className="flex justify-center">
    <button onClick={handleApplyChanges} className="btn mt-2" disabled={imageUploading}>
      Apply Changes
    </button>
  </div>
  <div className="mt-4 border p-3 shadow-md">
    <button className="btn bg-secondary" onClick={logout}>
      Log out
    </button>
  </div>
</div>
);
};

export default ProfileUpdate;