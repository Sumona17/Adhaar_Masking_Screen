import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Radio, 
  Upload, 
  message, 
  Alert,
  Space
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  max-width: 800px;
  margin: 2rem auto;
  box-shadow: 0px 6px 18px -2px #18181C1A;
  .ant-card-head-title {
    text-align: center;
    font-size: 24px;
  }
`;

const MethodContainer = styled.div`
  padding: 1rem;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.3s;
  &:hover {
    background: #fafafa;
  }
  &.selected {
    border-color: #1890ff;
    background: #e6f7ff;
  }
`;

const UploadContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
`;

const UploadFile = () => {
  const [selection, setSelection] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();
  
  const handleOptionSelect = (e) => {
    setSelection(e.target.value);
    setFileList([]);
    setImageUrl(null);
  };

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

  const handleFileChange = async (info) => {
    const { fileList: newFileList, file } = info;
    
    // Handle file removal
    if (file.status === 'removed') {
      setFileList([]);
      setImageUrl(null);
      message.warning('File removed');
      return;
    }

    // Update fileList
    setFileList(newFileList);

    // Handle new file upload
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
    if (selection === 'upload' && fileList.length > 0 && imageUrl) {
      navigate('/secondScreen', { 
        state: { 
          uploadedImage: imageUrl
        }
      });
    } else {
      message.error('Please complete all required selections');
    }
  };

  return (
    <StyledCard title="Select Input Method">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Radio.Group 
          onChange={handleOptionSelect} 
          value={selection}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <MethodContainer className={selection === 'upload' ? 'selected' : ''}>
              <Radio value="upload">
                <div>
                  <h4>Upload File</h4>
                  <p style={{ color: 'rgba(0, 0, 0, 0.45)', marginTop: '8px' }}>
                    Upload an image file (JPG/PNG, max 2MB)
                  </p>
                </div>
              </Radio>
            </MethodContainer>
          </Space>
        </Radio.Group>

        {selection === 'upload' && (
          <UploadContainer>
            <Upload
              accept=".jpg,.jpeg,.png"
              beforeUpload={beforeUpload}
              onChange={handleFileChange}
              fileList={fileList}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload Image</Button>
            </Upload>
            {fileList.length > 0 && imageUrl && (
              <Alert
                message="File selected successfully"
                type="success"
                showIcon
                style={{ marginTop: '1rem' }}
              />
            )}
          </UploadContainer>
        )}

        <Button
          type="primary"
          block
          onClick={handleNext}
          disabled={!selection || (selection === 'upload' && (!fileList.length || !imageUrl))}
        >
          Next
        </Button>
      </Space>
    </StyledCard>
  );
};

export default UploadFile;