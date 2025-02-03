import React, { useState } from 'react';

const ImageUpload = React.forwardRef(({ onFileSelect }, ref) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onFileSelect(selectedFile)
  };

  return (
    <div>
      <input type="file" ref={ref} onChange={handleFileChange} />
    </div>
  );
});

export default ImageUpload;
