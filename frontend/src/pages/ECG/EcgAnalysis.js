import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Button,
  Card,
  Radio,
  Slider,
  Select,
  Row,
  Col,
  message,
  Divider,
  Typography,
  Image,
  Space
} from 'antd';
import {
  UploadOutlined,
  RotateRightOutlined,
  ZoomInOutlined,
  DownloadOutlined,
  LineChartOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ECGAnalysis = () => {
  // States for the component
  const [fileList, setFileList] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [rotatedPreview, setRotatedPreview] = useState(null);
  const [rotateOption, setRotateOption] = useState('No');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [zoomFactor, setZoomFactor] = useState(2);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [rotatedPdfUrl, setRotatedPdfUrl] = useState(null);
  const [outputPdfUrl, setOutputPdfUrl] = useState(null);
  const [pageRotationInfo, setPageRotationInfo] = useState([]);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [pdfDocData, setPdfDocData] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [responsePdfDocument, setResponsePdfDocument] = useState(null);
  const [responsePdfPreview, setResponsePdfPreview] = useState(null);
  const [modelResponse, setModelResponse] = useState('');
  const canvasRef = useRef(null);
  const rotatedCanvasRef = useRef(null);
  const responsePdfCanvasRef = useRef(null);

  // Load PDF.js library from CDN
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        // We're using a global variable approach instead of imports
        if (!window.pdfjsLib) {
          // Load PDF.js main library
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
          
          // Set worker location
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        }
        
        setPdfJsLoaded(true);
      } catch (error) {
        console.error('Failed to load PDF.js:', error);
        message.error('Failed to load PDF processing library. Please try again later.');
      }
    };
    
    loadPdfJs();
  }, []);

  // Handle file upload
  const handleFileUpload = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const file = fileList[0].originFileObj;
      // Check if PDF.js is loaded
      if (pdfJsLoaded) {
        // Create a preview of the PDF's first page
        loadPdfAndGeneratePreview(file);
      } else {
        message.warning('PDF processing library is still loading. Please try again in a moment.');
      }
    } else {
      setPdfPreview(null);
      setRotatedPreview(null);
      setPageRotationInfo([]);
      setPdfDocData(null);
      setPdfDocument(null);
      setOutputPdfUrl(null);
      setModelResponse('');
      setResponsePdfDocument(null);
      setResponsePdfPreview(null);
    }
  };

  // Load PDF and generate preview
  const loadPdfAndGeneratePreview = async (file) => {
    try {
      setLoading(true);
      
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      setPdfDocData(arrayBuffer);
      
      // Load PDF document using PDF.js
      const loadingTask = window.pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      setPdfDocument(pdf);
      
      // Get PDF rotation info
      const rotationInfo = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        rotationInfo.push({
          page: i,
          angle: page.rotate || 0
        });
      }
      setPageRotationInfo(rotationInfo);
      
      // Render the first page as preview
      await renderPdfPage(pdf, 1, canvasRef, false);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading PDF:', error);
      message.error('Error loading PDF: ' + error.message);
      setLoading(false);
    }
  };

  // Render a PDF page to a canvas
  const renderPdfPage = async (pdf, pageNum, canvasRef, rotate) => {
    try {
      // Get the page
      const page = await pdf.getPage(pageNum);
      
      // Determine viewport
      const viewport = page.getViewport({ 
        scale: zoomFactor,
        rotation: rotate ? parseInt(rotationAngle) : 0 
      });
      
      // Get canvas and context
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render PDF page
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert canvas to base64 image data URL
      const imageUrl = canvas.toDataURL('image/jpeg');
      
      // Set the appropriate preview state
      if (rotate) {
        setRotatedPreview(imageUrl);
      } else if (canvasRef === responsePdfCanvasRef) {
        setResponsePdfPreview(imageUrl);
      } else {
        setPdfPreview(imageUrl);
      }
      
      return imageUrl;
    } catch (error) {
      console.error('Error rendering PDF page:', error);
      message.error('Error rendering PDF: ' + error.message);
      return null;
    }
  };

  // Load and render response PDF
  const loadResponsePdf = async (url) => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      
      // Load PDF document
      const loadingTask = window.pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      setResponsePdfDocument(pdf);
      
      // Check if the PDF has at least 2 pages
      if (pdf.numPages >= 2) {
        // Render the second page
        await renderPdfPage(pdf, 2, responsePdfCanvasRef, false);
      } else {
        message.info('The response PDF has only one page.');
        // Render the first page if second page is not available
        await renderPdfPage(pdf, 1, responsePdfCanvasRef, false);
      }
    } catch (error) {
      console.error('Error loading response PDF:', error);
      message.error('Error loading response PDF: ' + error.message);
    }
  };

  // Re-render both normal and rotated preview when zoom changes
  useEffect(() => {
    const updatePreviews = async () => {
      if (pdfDocument) {
        // Update normal preview with new zoom
        await renderPdfPage(pdfDocument, 1, canvasRef, false);
        
        // Update rotated preview if needed
        if (rotateOption === 'Yes') {
          await renderPdfPage(pdfDocument, 1, rotatedCanvasRef, true);
        }
        
        // Update response PDF preview if available
        if (responsePdfDocument) {
          const pageNum = responsePdfDocument.numPages >= 2 ? 2 : 1;
          await renderPdfPage(responsePdfDocument, pageNum, responsePdfCanvasRef, false);
        }
      }
    };
    
    updatePreviews();
  }, [zoomFactor, pdfDocument, responsePdfDocument]);

  // Handle rotate PDF
  const handleRotate = async () => {
    if (!pdfDocument) {
      message.error('Please upload a PDF first');
      return;
    }

    setLoading(true);
    
    try {
      // Render the rotated page
      await renderPdfPage(pdfDocument, 1, rotatedCanvasRef, true);
      
      // Create a blob URL for download simulation
      const blob = new Blob([pdfDocData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setRotatedPdfUrl(url);
      
      message.success(`PDF rotated by ${rotationAngle}° successfully in preview!`);
      
      setLoading(false);
    } catch (error) {
      console.error('Error rotating PDF:', error);
      message.error('Error rotating PDF: ' + error.message);
      setLoading(false);
    }
  };

  // Run ECG analysis
  const handleAnalysis = async () => {
    if (!fileList[0] || !fileList[0].originFileObj) {
      message.error('Please upload a PDF first');
      return;
    }

    setAnalyzing(true);
    setResponsePdfDocument(null);
    setResponsePdfPreview(null);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', fileList[0].originFileObj);
      
      // Make API call
      const response = await fetch('http://localhost:8000/ecg_analysis', {
        method: 'POST',
        body: formData,
        headers: {
          'accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Check if the response is JSON or blob
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // Handle JSON response
        const result = await response.json();
        setModelResponse(result.analysis || "ECG analysis completed successfully.");
        
        // If the JSON response contains a PDF URL
        if (result.pdf_url) {
          // Fetch the PDF from the provided URL
          const pdfResponse = await fetch(result.pdf_url);
          if (pdfResponse.ok) {
            const pdfBlob = await pdfResponse.blob();
            const url = URL.createObjectURL(pdfBlob);
            setOutputPdfUrl(url);
            await loadResponsePdf(url);
          }
        } else if (result.pdf_base64) {
          // If the JSON response contains a base64 encoded PDF
          const binaryString = atob(result.pdf_base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(pdfBlob);
          setOutputPdfUrl(url);
          await loadResponsePdf(url);
        }
      } else {
        // Handle direct PDF response
        const pdfBlob = await response.blob();
        const url = URL.createObjectURL(pdfBlob);
        setOutputPdfUrl(url);
        setModelResponse("ECG analysis completed successfully. You can download the PDF report below.");
        await loadResponsePdf(url);
      }
      
      message.success('ECG analysis completed');
    } catch (error) {
      console.error('Error analyzing ECG:', error);
      message.error('Error analyzing ECG: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Effect to handle rotation option and angle changes
  useEffect(() => {
    if (pdfDocument && rotateOption === 'Yes') {
      handleRotate();
    } else if (rotateOption === 'No') {
      setRotatedPreview(null);
      setRotatedPdfUrl(null);
    }
  }, [rotationAngle, rotateOption, pdfDocument]);

  // Effect to clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (rotatedPdfUrl) URL.revokeObjectURL(rotatedPdfUrl);
      if (outputPdfUrl) URL.revokeObjectURL(outputPdfUrl);
    };
  }, [rotatedPdfUrl, outputPdfUrl]);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>ECG Analyzer</Title>
      
      {/* Hidden canvases for PDF rendering */}
      <div style={{ display: 'none' }}>
        <canvas ref={canvasRef}></canvas>
        <canvas ref={rotatedCanvasRef}></canvas>
        <canvas ref={responsePdfCanvasRef}></canvas>
      </div>
      
      <Row gutter={24}>
        {/* Left Sidebar / Configuration */}
        <Col span={6}>
          <Card title="Upload and Configure PDF" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <Upload
              beforeUpload={(file) => {
                const isPDF = file.type === 'application/pdf';
                if (!isPDF) {
                  message.error('You can only upload PDF files!');
                }
                return isPDF || Upload.LIST_IGNORE;
              }}
              fileList={fileList}
              onChange={handleFileUpload}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} loading={!pdfJsLoaded}>
                Upload PDF
              </Button>
            </Upload>

            <Divider />

            <div>
              <Text strong>Rotate the PDF?</Text>
              <Radio.Group
                options={[
                  { label: 'No', value: 'No' },
                  { label: 'Yes', value: 'Yes' },
                ]}
                onChange={(e) => setRotateOption(e.target.value)}
                value={rotateOption}
                style={{ display: 'block', marginTop: '8px' }}
                disabled={!pdfDocument}
              />
            </div>

            {rotateOption === 'Yes' && (
              <div style={{ marginTop: '16px' }}>
                <Text strong>Rotation Angle</Text>
                <Select
                  value={rotationAngle}
                  style={{ width: '100%', marginTop: '8px' }}
                  onChange={(value) => setRotationAngle(value)}
                  disabled={!pdfDocument}
                >
                  <Option value={0}>0°</Option>
                  <Option value={90}>90°</Option>
                  <Option value={180}>180°</Option>
                  <Option value={270}>270°</Option>
                </Select>
              </div>
            )}

            <div style={{ marginTop: '16px' }}>
              <Text strong>Zoom Factor for Image Resolution</Text>
              <Slider
                min={1}
                max={5}
                value={zoomFactor}
                onChange={(value) => setZoomFactor(value)}
                disabled={!pdfDocument}
              />
            </div>
          </Card>

          {pageRotationInfo.length > 0 && (
            <Card title="PDF Rotation Information" style={{ marginTop: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
              {pageRotationInfo.map((info, index) => (
                <p key={index}>Page {info.page}: Rotation Angle = {info.angle}°</p>
              ))}
            </Card>
          )}
        </Col>

        {/* Main Content Area */}
        <Col span={18}>
          <Row gutter={[16, 16]}>
            {/* PDF Preview */}
            <Col span={12}>
              <Card title="Preview First Page" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                {loading && <div style={{ textAlign: 'center', margin: '20px' }}>Loading...</div>}
                {!loading && pdfPreview ? (
                  <Image 
                    src={pdfPreview} 
                    alt="PDF Preview" 
                    style={{ width: '100%' }} 
                  />
                ) : !loading && (
                  <div style={{ 
                    background: '#f0f0f0', 
                    height: '300px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Text type="secondary">Upload a PDF to see preview</Text>
                  </div>
                )}
              </Card>
            </Col>

            {/* Rotated Preview */}
            <Col span={12}>
              {rotateOption === 'Yes' && (
                <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
                  title={`Rotated First Page Preview (${rotationAngle}°)`}
                  extra={
                    rotatedPdfUrl && (
                      <Button 
                        type="primary" 
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={() => window.open(rotatedPdfUrl, '_blank')}
                      >
                        Download Rotated PDF
                      </Button>
                    )
                  }
                >
                  {loading && <div style={{ textAlign: 'center', margin: '20px' }}>Loading...</div>}
                  {!loading && rotatedPreview ? (
                    <Image 
                      src={rotatedPreview} 
                      alt="Rotated PDF Preview" 
                      style={{ width: '100%' }} 
                    />
                  ) : !loading && (
                    <div style={{ 
                      background: '#f0f0f0', 
                      height: '300px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <Text type="secondary">Rotate the PDF to see preview</Text>
                    </div>
                  )}
                </Card>
              )}
            </Col>

            {/* Analysis Section */}
            <Col span={24}>
              <Card title="ECG Analysis" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    icon={<LineChartOutlined />} 
                    loading={analyzing}
                    onClick={handleAnalysis}
                    disabled={!pdfDocument}
                    size="large"
                  >
                    Analyze ECG
                  </Button>

                  {modelResponse && (
                    <>
                      <Card title="Analysis Results" bordered={false}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Paragraph>{modelResponse}</Paragraph>
                          
                          {/* Response PDF Page 2 Preview */}
                          {responsePdfPreview && (
                            <div>
                              <Title level={4}>Report Preview</Title>
                              <Image
                                src={responsePdfPreview}
                                alt="Response PDF Page 2"
                                style={{ width: '100%', maxHeight: '800px', objectFit: 'contain' }}
                              />
                            </div>
                          )}
                        </Space>
                      </Card>
                    </>
                  )}
                  
                  {outputPdfUrl && (
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />}
                      onClick={() => window.open(outputPdfUrl, '_blank')}
                      size="large"
                    >
                      Download PDF Report
                    </Button>
                  )}
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ECGAnalysis;