import React, { useState } from 'react';
import { 
  
  Upload, 
  message, 
  Alert,
 
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../Bulkmasking/BulkMasking.css';
import styled from 'styled-components';
const UploadFile = () => {
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return false;
  };
  const MethodContainer = styled.div`
  
  // border: 1px solid #f0f0f0;
   display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
 
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.3s;
  // &:hover {
  //   background: #fafafa;
  // }
  &.selected {
    border-color: #ff8d2f;
    background: #e6f7ff;
  }
`;

  const handleFileChange = async (info) => {
    const { fileList: newFileList, file } = info;
    
    if (file.status === 'removed') {
      setFileList([]);
      setImageUrl(null);
      message.warning('File removed');
      return;
    }

    setFileList(newFileList);

    if (newFileList.length > 0) {
      const currentFile = newFileList[0].originFileObj;
      
      if (currentFile) {
        try {
          const reader = new FileReader();
          reader.onload = () => {
            setImageUrl(reader.result);
            message.success('File uploaded successfully');
          };
          reader.onerror = () => {
            message.error('Error reading file');
          };
          reader.readAsDataURL(currentFile);
        } catch (error) {
          message.error('Error processing file');
          console.error('File processing error:', error);
        }
      }
    }
  };

  const handleNext = () => {
    if (fileList.length > 0 && imageUrl) {
      navigate('/secondScreen', { 
        state: { 
          uploadedImage: imageUrl
        }
      });
    } else {
      message.error('Please upload an image first');
    }
  };

  return (
    // <div className="container" style={{justifyContent: 'center', padding: '30px 50px'}}>
      <MethodContainer>
        <h2 className="title">Upload Your Adhaar Card</h2>
        <div className="upload-box">
          <p className="file-inside">Select or drop your file here in .jpg or .jpeg or .png format </p>
          <Upload
            accept=".jpg,.jpeg,.png"
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
            fileList={fileList}
            maxCount={1}
          >
            <button
             
              type='default'
              className="button"
            //  style={{backgroundColor: '#f16608', transform: 'scale(1.05)'}}
            >
             <UploadOutlined /> Click to Upload Image
            </button>
          </Upload>
        </div>
        
        {fileList.length > 0 && imageUrl && (
          <Alert
            message="File selected successfully"
            type="success"
            showIcon
            style={{ marginTop: '15px' }}
          />
        )}
        
        <button
          className="button"
          onClick={handleNext}
          disabled={!fileList.length || !imageUrl}
          style={{ marginTop: '20px' }}
        >
          Next
        </button>
        </MethodContainer>

      
    
  );
};

export default UploadFile;