'use client';

import { useState } from 'react';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://api.artur.digital/webhook/face-swap';

// URLs das imagens dos pôsteres hospedadas no GitHub
const POSTER1_URL = 'https://raw.githubusercontent.com/artureldib/face-swap-posters/main/public/posters/poster1.webp';
const POSTER2_URL = 'https://raw.githubusercontent.com/artureldib/face-swap-posters/main/public/posters/poster2.webp';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [posters, setPosters] = useState<{poster1?: string, poster2?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setPosters(null);

    try {
      // Convert image to base64
      const reader = new FileReader();

      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/...;base64, prefix

        // Send to n8n webhook
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userPhoto: base64Data,
            poster1URL: POSTER1_URL,
            poster2URL: POSTER2_URL,
          }),
        });

        if (!response.ok) {
          throw new Error('Falha ao gerar os pôsteres');
        }

        const data = await response.json();

        if (data.success) {
          setPosters({
            poster1: data.poster1,
            poster2: data.poster2,
          });
        } else {
          throw new Error(data.error || 'Erro ao processar imagens');
        }
      };

      reader.onerror = () => {
        setError('Erro ao ler o arquivo');
        setLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>⚽ Face Swap Posters</h1>

      <div className="upload-section">
        <div className="upload-button">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={loading}
            className="upload-input"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`upload-label ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Gerando seus pôsteres...
              </>
            ) : (
              '📸 Enviar sua foto'
            )}
          </label>
        </div>
        <p style={{marginTop: '20px', color: '#666'}}>
          Envie uma foto do seu rosto para criar pôsteres personalizados!
        </p>
      </div>

      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}

      {posters && (
        <div className="results-section">
          {posters.poster1 && (
            <div className="poster-card">
              <h3>🔴 Poster Portugal</h3>
              <img
                src={`data:image/jpeg;base64,${posters.poster1}`}
                alt="Poster 1 - Red Portugal Style"
              />
            </div>
          )}

          {posters.poster2 && (
            <div className="poster-card">
              <h3>⚪ Poster Real Madrid</h3>
              <img
                src={`data:image/jpeg;base64,${posters.poster2}`}
                alt="Poster 2 - Real Madrid Collage"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
