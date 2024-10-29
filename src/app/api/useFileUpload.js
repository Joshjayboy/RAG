import { useState } from "react";

export default function useFileUpload() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      setUploadStatus("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setUploadStatus("File uploaded successfully");
      } else {
        setUploadStatus("File upload failed");
      }
    } catch (error) {
      console.error(error);
      setUploadStatus("Error uploading file");
    }
  };

  return { file, uploadStatus, handleFileChange, uploadFile };
}
