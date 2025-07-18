import React, { useState } from 'react';

const GOOGLE_API_KEY = 'AIzaSyDpqoBRNP4Cp5iy9CjBgH8NipA99UO2P9E';

const CheckProduct: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = (reader.result as string).split(',')[1];

      const requestBody = {
        contents: [
          {
            parts: [
              { text: "Is this image AI-generated or real?" },
              {
                inlineData: {
                  mimeType: imageFile.type,
                  data: base64Image,
                },
              },
            ],
          },
        ],
      };

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GOOGLE_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          }
        );

        if (!res.ok) throw new Error('Gemini API error');
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        setResult(reply || 'No response');
      } catch (err) {
        console.error(err);
        setError('It is AI-generated.');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(imageFile);
  };

  return (
    <div className="p-6 max-w-md mx-auto border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">AI-Generated Image Detector</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && <img src={previewUrl} alt="Preview" className="mt-4 rounded" />}

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Check Image'}
      </button>

      {result && <p className="mt-4 text-green-700 font-semibold whitespace-pre-line">{result}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default CheckProduct;
