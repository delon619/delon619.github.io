'use client';

import { useState, useRef } from 'react';
import './styles.css';

export default function Home() {
  const [userPhoto, setUserPhoto] = useState<File | null>(null);
  const [outfitPhoto, setOutfitPhoto] = useState<File | null>(null);
  const [userPreview, setUserPreview] = useState<string | null>(null);
  const [outfitPreview, setOutfitPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userInputRef = useRef<HTMLInputElement>(null);
  const outfitInputRef = useRef<HTMLInputElement>(null);

  const handleUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleOutfitPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOutfitPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOutfitPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!userPhoto || !outfitPhoto) {
      setError('Please upload both photos');
      return;
    }

    setLoading(true);
    setError(null);
    setResultUrl(null);

    const formData = new FormData();
    formData.append('userPhoto', userPhoto);
    formData.append('outfitPhoto', outfitPhoto);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setResultUrl(data.resultUrl);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserPhoto(null);
    setOutfitPhoto(null);
    setUserPreview(null);
    setOutfitPreview(null);
    setResultUrl(null);
    setError(null);
    if (userInputRef.current) userInputRef.current.value = '';
    if (outfitInputRef.current) outfitInputRef.current.value = '';
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Virtual Try-On</h1>
        <p>Upload your photo and an outfit to see yourself wearing it!</p>
      </header>

      <main className="main">
        <div className="upload-section">
          <div className="upload-card">
            <h2>Your Photo</h2>
            <div 
              className="upload-area"
              onClick={() => userInputRef.current?.click()}
            >
              {userPreview ? (
                <img src={userPreview} alt="User preview" className="preview-image" />
              ) : (
                <div className="upload-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Click to upload your photo</span>
                </div>
              )}
            </div>
            <input
              ref={userInputRef}
              type="file"
              accept="image/*"
              onChange={handleUserPhotoChange}
              className="file-input"
            />
          </div>

          <div className="upload-card">
            <h2>Outfit Photo</h2>
            <div 
              className="upload-area"
              onClick={() => outfitInputRef.current?.click()}
            >
              {outfitPreview ? (
                <img src={outfitPreview} alt="Outfit preview" className="preview-image" />
              ) : (
                <div className="upload-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <span>Click to upload outfit photo</span>
                </div>
              )}
            </div>
            <input
              ref={outfitInputRef}
              type="file"
              accept="image/*"
              onChange={handleOutfitPhotoChange}
              className="file-input"
            />
          </div>
        </div>

        <div className="button-group">
          <button
            onClick={handleGenerate}
            disabled={!userPhoto || !outfitPhoto || loading}
            className="btn btn-primary"
          >
            {loading ? 'Generating...' : 'Generate Result'}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="btn btn-secondary"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Generating your virtual try-on... This may take 30-60 seconds</p>
          </div>
        )}

        {resultUrl && (
          <div className="result-section">
            <h2>Your Virtual Try-On Result</h2>
            <div className="result-card">
              <img src={resultUrl} alt="Result" className="result-image" />
              <a 
                href={resultUrl} 
                download="virtual-tryon-result.png" 
                className="btn btn-download"
              >
                Download Image
              </a>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Powered by AI Image Generation</p>
      </footer>
    </div>
  );
}
