import React, { useState, useRef } from 'react';
import axios from 'axios';

const ImageUpload = React.forwardRef(({ authToken, onUploadSuccess, fileInputRef }, ref) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`,
        },
      });

      const imageUrl = response.data.url;
      onUploadSuccess(imageUrl);

      console.log('Uploaded media:', response.data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <input type="file" ref={ref} onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
});

export default ImageUpload;
