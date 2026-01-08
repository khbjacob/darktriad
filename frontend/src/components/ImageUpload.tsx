import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (image: File | string) => void;
  onCancel?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, onCancel }) => {
  const [mode, setMode] = useState<'select' | 'upload' | 'webcam'>('select');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreviewUrl(imageSrc);
      onImageSelect(imageSrc);
      setMode('select');
    }
  }, [onImageSelect]);

  if (mode === 'select') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-academic-900 mb-6 text-center">
            Select Analysis Method
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setMode('upload')}
              className="p-8 border-2 border-dashed border-academic-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition group"
            >
              <Upload className="w-12 h-12 mx-auto mb-3 text-academic-400 group-hover:text-primary-600" />
              <h3 className="font-semibold text-lg mb-2">Upload Image</h3>
              <p className="text-sm text-academic-600">
                Choose a photo from your device
              </p>
            </button>

            <button
              onClick={() => setMode('webcam')}
              className="p-8 border-2 border-dashed border-academic-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition group"
            >
              <Camera className="w-12 h-12 mx-auto mb-3 text-academic-400 group-hover:text-primary-600" />
              <h3 className="font-semibold text-lg mb-2">Use Webcam</h3>
              <p className="text-sm text-academic-600">
                Take a photo with your camera
              </p>
            </button>
          </div>

          {previewUrl && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Selected Image:</h3>
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-auto max-h-64 rounded-lg shadow"
                />
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {onCancel && (
            <button
              onClick={onCancel}
              className="mt-4 w-full px-4 py-2 text-academic-600 hover:text-academic-800"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'upload') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-academic-900">Upload Image</h2>
            <button
              onClick={() => setMode('select')}
              className="text-academic-600 hover:text-academic-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-academic-300 hover:border-academic-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-academic-400" />
            <p className="text-lg font-medium mb-2">
              Drag and drop your image here
            </p>
            <p className="text-sm text-academic-600 mb-4">
              or
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <p className="text-xs text-academic-500 mt-4">
              Supported formats: JPG, PNG, WebP (Max 10MB)
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'webcam') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-academic-900">Webcam Capture</h2>
            <button
              onClick={() => setMode('select')}
              className="text-academic-600 hover:text-academic-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-academic-900">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full"
              videoConstraints={{
                facingMode: 'user',
                width: 1280,
                height: 720,
              }}
            />
          </div>

          <button
            onClick={capturePhoto}
            className="mt-6 w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            <Camera className="w-5 h-5 inline mr-2" />
            Capture Photo
          </button>

          <p className="text-xs text-academic-500 text-center mt-4">
            Position your face in the center and ensure good lighting
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default ImageUpload;
