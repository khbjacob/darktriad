import { useState, useRef, useCallback } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import PhotoGuidelines from './PhotoGuidelines';

interface UploadZoneProps {
  onImageReady: (base64: string) => void;
  disabled?: boolean;
}

export default function UploadZone({ onImageReady, disabled }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be under 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
      });
      setStream(mediaStream);
      setShowCamera(true);
      // attach stream after render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch {
      alert('Camera access denied or unavailable');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg', 0.9);
    setPreview(base64);
    stopCamera();
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setShowCamera(false);
  };

  const submitImage = () => {
    if (preview) onImageReady(preview);
  };

  const clearPreview = () => {
    setPreview(null);
  };

  if (showCamera) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', display: 'block', background: '#000' }}
          />
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '1rem',
          }}>
            <button
              onClick={capturePhoto}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'var(--accent-amber)',
                color: 'var(--text-bright)',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontWeight: 500,
              }}
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              style={{
                padding: '0.75rem 1.25rem',
                background: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (preview) {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}
            />
            <button
              onClick={clearPreview}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(0,0,0,0.7)',
                border: 'none',
                borderRadius: '50%',
                padding: '0.3rem',
                color: 'var(--text-primary)',
              }}
            >
              <X size={16} />
            </button>
          </div>
          <button
            onClick={submitImage}
            disabled={disabled}
            style={{
              marginTop: '1.25rem',
              width: '100%',
              padding: '0.85rem',
              background: disabled ? 'var(--bg-input)' : 'var(--accent-amber)',
              color: disabled ? 'var(--text-dim)' : 'var(--text-bright)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            Analyze
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div
        className="card"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          borderColor: dragOver ? 'var(--accent-amber)' : undefined,
          borderStyle: 'dashed',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload
          size={36}
          style={{ margin: '0 auto 1rem', color: 'var(--text-dim)' }}
        />
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          Drop a photograph here or click to browse
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          JPG, PNG, or WebP &middot; 10MB max
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <button
          onClick={(e) => { e.stopPropagation(); startCamera(); }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
          }}
        >
          <Camera size={16} />
          Use Camera
        </button>
      </div>

      <PhotoGuidelines />
    </div>
  );
}
