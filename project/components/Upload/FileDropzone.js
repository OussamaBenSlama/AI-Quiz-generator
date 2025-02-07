"use client";

import { useState } from "react";

const FileDropzone = ({handleChange}) => {
  const [previewSrc, setPreviewSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    displayPreview(file);
  };

  const handleFileChange = (e) => {
    handleChange(e);
    const file = e.target.files[0];
    displayPreview(file);
  };

  const displayPreview = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewSrc(reader.result);
    };
  };

  return (
    <div
    className={`w-full relative border-2 border-dashed rounded-lg p-6 ${
        isDragging ? "border-indigo-600" : "border-gray-300"
    }`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    >
    <input
        type="file"
        name='selectedFile'
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 z-50"
        onChange={handleFileChange}
    />
    <div className="text-center">
        <img
        className="mx-auto h-12 w-12"
        src="https://www.svgrepo.com/show/357902/image-upload.svg"
        alt="Upload"
        />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
        <label htmlFor="file-upload" className="relative cursor-pointer">
            <span>Drag and drop</span>
            <span className="text-indigo-600"> or browse</span>
            <span> to upload</span>
        </label>
        </h3>
        <p className="mt-1 text-xs text-gray-500">PDF</p>
    </div>
    {previewSrc && (
        <img
        src={previewSrc}
        className="mt-4 mx-auto max-h-40"
        alt="Preview"
        />
    )}
    </div>
  );
};

export default FileDropzone;
