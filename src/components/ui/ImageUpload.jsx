import { useState, useRef } from 'react';
import { uploadService } from '../../services/upload.service';

const ImageUpload = ({ value, onChange, onDelete }) => {
  const [uploading, setUploading]   = useState(false);
  const [preview, setPreview]       = useState(value || '');
  const [error, setError]           = useState('');
  const inputRef                    = useRef();

  const handleFile = async (file) => {
    if (!file) return;

    // Preview local immédiat
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    setError('');

    try {
      const { data } = await uploadService.uploadImage(file);
      onChange(data.url); // ← envoie l'URL au parent
    } catch (err) {
      setError('Erreur upload. Réessayez.');
      setPreview(value || '');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDelete = async () => {
    if (value) await uploadService.deleteImage(value);
    setPreview('');
    onChange('');
    if (onDelete) onDelete();
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Image principale
      </label>

      {/* ─── Zone de drop ─── */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors ${
          uploading
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
        }`}
      >
        {preview ? (
          /* ─── Preview image ─── */
          <div className="relative h-48 rounded-xl overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay avec actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="px-3 py-1.5 bg-white text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✏️ Changer
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ) : (
          /* ─── Zone vide ─── */
          <div className="h-48 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500">
            {uploading ? (
              <>
                <svg className="animate-spin h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <p className="text-sm text-primary-500 font-medium">Upload en cours...</p>
              </>
            ) : (
              <>
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Glisser-déposer ou <span className="text-primary-600">parcourir</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 5MB</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ─── Input file caché ─── */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {/* ─── Séparateur OU ─── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400">ou</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* ─── Input URL manuelle ─── */}
      <input
        type="url"
        placeholder="https://exemple.com/image.jpg"
        value={value?.startsWith('http') && !value?.startsWith('data:') ? value : ''}
        onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); }}
        className="w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default ImageUpload;