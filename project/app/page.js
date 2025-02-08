"use client";

import React, { useEffect, useState } from "react";
import FileDropzone from "@/components/Upload/FileDropzone";
import CustomAlert from "@/components/Upload/CustomAlert";
import axios from "axios";

export default function Upload() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState({
    selectedFile: null,
  });

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleChange = (e) => {
    const { name, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      setLoading(true);
      if (!formData.selectedFile) {
        setAlertMessage("Please select a file");
        setShowAlert(true);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("document", formData.selectedFile);

      // Send a POST request to your backend endpoint
      const response = await axios.post(
        "http://localhost:8000/post",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);
      setAlertMessage("File Uploaded");
      setFormData({
        selectedFile: null,
      });

      setShowAlert(true);
      if (response.data) {
        localStorage.setItem("quizData", JSON.stringify(response.data)); // Store response
        setTimeout(() => {
          window.location.href = "/quiz";
        }, 400);
        return;
      }
    } catch (error) {
      setAlertMessage("Error while uploading");
      setFormData({
        selectedFile: null,
      });
      setShowAlert(true);
    } finally {
      setLoading(false); // Set loading state to false after request completes
    }
  };

  if (loading)
    return (
      <div className="fullScreen">
        <h4 className="text-gray-500">Processing Your File</h4>
        <div class="loader"></div>
      </div>
    );

  return (
    <>
      <div className="flex flex-wrap justify-center items-center">
        <div className="md:w-1/2 w-full md:h-[90vh] flex justify-center items-center">
          <img
            src="/Upload-rafiki.png"
            className="md:max-w-[400px]"
            style={{ maxHeight: "70vh", filter: "hue-rotate(150deg)" }}
          />
        </div>
        <div className="md:w-1/2 w-full">
          <form
            className="md:max-w-[450px] bg-white p-6 rounded-lg mx-4 my-6"
            style={{ boxShadow: "rgba(0, 0, 0, 0.2) 0px 1px 2px" }}
            onSubmit={handleSubmit}
          >
            <h2 className="text-darkBlue">Drop/Select your file</h2>
            <FileDropzone handleChange={handleChange} />
            <div className="text-white text-2xs md:text-base border-2 border-black bg-black rounded-lg px-5 py-2 hover:bg-white hover:border-black hover:text-black flex justify-center items-center mt-5">
              <input
                type="submit"
                className="cursor-pointer"
                value="Add"
                id="button"
              />
            </div>
          </form>
          {showAlert && (
            <CustomAlert message={alertMessage} onClose={closeAlert} />
          )}
        </div>
      </div>
    </>
  );
}
