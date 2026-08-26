'use client';

import { useRef, useState } from 'react';
import styles from './image-upload.module.css';

type UploadFolder = 'menu' | 'shop' | 'blog' | 'banners' | 'featured' | 'general';

async function uploadFile(file: File, folder: UploadFolder) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `/api/admin/uploads?folder=${encodeURIComponent(folder)}`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof body.message === 'string'
        ? body.message
        : 'No se pudo subir la imagen',
    );
  }

  return body as { url: string; key: string };
}

export function ImageUpload({
  value,
  onChange,
  folder = 'general',
  label = 'Imagen',
}: {
  value?: string;
  onChange: (url: string) => void;
  folder?: UploadFolder;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const uploaded = await uploadFile(file, folder);
      onChange(uploaded.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <span>{label}</span>
        {value ? (
          <button type="button" className={styles.linkButton} onClick={() => onChange('')}>
            Quitar
          </button>
        ) : null}
      </div>

      {value ? (
        <div
          className={styles.preview}
          style={{ backgroundImage: `url(${value})` }}
          role="img"
          aria-label={label}
        />
      ) : (
        <div className={styles.empty}>Sin imagen</div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Subiendo…' : value ? 'Cambiar imagen' : 'Subir imagen'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}

export function MultiImageUpload({
  values,
  onChange,
  folder = 'shop',
  label = 'Imágenes',
}: {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: UploadFolder;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(fileList)) {
        const uploaded = await uploadFile(file, folder);
        uploadedUrls.push(uploaded.url);
      }
      onChange([...values, ...uploadedUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <span>{label}</span>
      </div>

      <div className={styles.grid}>
        {values.map((url, index) => (
          <div key={`${url}-${index}`} className={styles.thumbWrap}>
            <div
              className={styles.thumb}
              style={{ backgroundImage: `url(${url})` }}
            />
            <button type="button" onClick={() => removeAt(index)}>
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Subiendo…' : 'Subir imágenes'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
