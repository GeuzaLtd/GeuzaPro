'use client';

import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import {
  getCloudinarySignature,
  saveHeroImageRecord,
  deleteHeroImage,
  toggleHeroImageVisibility,
  updateHeroImageAlt,
  moveHeroImage,
} from '@/actions/hero-images';
import type { HeroImageItem } from '@/actions/hero-images';

const TABS = [
  { key: 'home',    label: 'Home Hero' },
  { key: 'company', label: 'Company Hero' },
] as const;

type Tab = (typeof TABS)[number]['key'];

export default function HeroImagesView({ images: initial }: { images: HeroImageItem[] }) {
  const [tab, setTab]         = useState<Tab>('home');
  const [images, setImages]   = useState(initial);
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [altDraft, setAltDraft]     = useState('');
  const [pending, startTransition]  = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const filtered = images
    .filter((i) => i.page === tab)
    .sort((a, b) => a.order - b.order || a.id - b.id);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFilePreview(URL.createObjectURL(f));
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');

    try {
      // Step 1: get a Cloudinary signature from the server (tiny request, no file)
      const { signature, timestamp, folder, apiKey, cloudName } =
        await getCloudinarySignature();

      // Step 2: POST the file directly to Cloudinary — bypasses Next.js entirely
      const fd = new FormData();
      fd.append('file',      file);
      fd.append('api_key',   apiKey);
      fd.append('timestamp', String(timestamp));
      fd.append('signature', signature);
      fd.append('folder',    folder);

      const res  = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: fd }
      );
      if (!res.ok) throw new Error('Cloudinary upload failed.');
      const data = await res.json() as { secure_url: string; public_id: string };

      // Step 3: save URL + publicId to DB via a small server action
      const result = await saveHeroImageRecord({
        url:      data.secure_url,
        publicId: data.public_id,
        alt:      altDraft,
        page:     tab,
      });

      if (!result.success) throw new Error(result.error);
      window.location.reload();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    setAltDraft('');
    setFilePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this image? This cannot be undone.')) return;
    startTransition(async () => {
      await deleteHeroImage(id);
      setImages((prev) => prev.filter((i) => i.id !== id));
    });
  }

  function handleToggle(id: number, current: boolean) {
    startTransition(async () => {
      await toggleHeroImageVisibility(id, !current);
      setImages((prev) => prev.map((i) => i.id === id ? { ...i, isVisible: !current } : i));
    });
  }

  function handleMove(id: number, direction: 'up' | 'down') {
    startTransition(async () => {
      await moveHeroImage(id, direction);
      window.location.reload();
    });
  }

  function handleAltBlur(id: number, alt: string) {
    startTransition(async () => {
      await updateHeroImageAlt(id, alt);
    });
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Images</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage slideshow images for the home and company pages</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-[#0F9E59] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0d8a4d] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Image
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {t.label}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-[#0F9E59]/10 text-[#0F9E59]' : 'bg-gray-200 text-gray-400'}`}>
              {images.filter((i) => i.page === t.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Image grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No images yet</p>
          <p className="text-gray-400 text-sm mt-1">Add images for the {tab === 'home' ? 'home hero' : 'company hero'} slideshow</p>
          <button onClick={() => setShowModal(true)} className="mt-4 text-sm text-[#0F9E59] font-semibold hover:underline">
            + Add first image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img, idx) => (
            <div
              key={img.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                img.isVisible ? 'border-gray-200' : 'border-dashed border-gray-300 opacity-60'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-square bg-gray-50">
                <Image src={img.url} alt={img.alt || 'Hero image'} fill className="object-cover" unoptimized />
                {!img.isVisible && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border">Hidden</span>
                  </div>
                )}
              </div>

              {/* Alt text */}
              <div className="px-3 pt-3">
                <input
                  type="text"
                  defaultValue={img.alt}
                  onBlur={(e) => handleAltBlur(img.id, e.target.value)}
                  placeholder="Alt text…"
                  className="w-full text-xs text-gray-600 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#0F9E59] transition-colors"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between px-3 py-2.5 gap-1">
                {/* Order controls */}
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMove(img.id, 'up')}
                    disabled={idx === 0 || pending}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-colors"
                    title="Move left"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMove(img.id, 'down')}
                    disabled={idx === filtered.length - 1 || pending}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-colors"
                    title="Move right"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>

                {/* Visibility + delete */}
                <div className="flex gap-1">
                  <button
                    onClick={() => handleToggle(img.id, img.isVisible)}
                    disabled={pending}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      img.isVisible
                        ? 'bg-[#0F9E59]/10 text-[#0F9E59] hover:bg-[#0F9E59]/20'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={img.isVisible ? 'Hide' : 'Show'}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {img.isVisible
                        ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                        : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
                      }
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={pending}
                    className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-colors"
                    title="Delete"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Add Image to {tab === 'home' ? 'Home' : 'Company'} Hero</h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* File picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Image *</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-[#0F9E59] transition-colors"
                  style={{ minHeight: 160 }}
                >
                  {filePreview ? (
                    <Image src={filePreview} alt="Preview" fill className="object-contain p-2" unoptimized />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span className="text-sm font-medium">Click to choose a file</span>
                      <span className="text-xs">PNG, JPG, WebP</span>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} required />
              </div>

              {/* Alt text */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Alt Text</label>
                <input
                  type="text"
                  value={altDraft}
                  onChange={(e) => setAltDraft(e.target.value)}
                  placeholder="Describe the image for accessibility"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#0F9E59] transition-colors"
                />
              </div>

              {uploadError && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{uploadError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 rounded-xl bg-[#0F9E59] text-white text-sm font-semibold hover:bg-[#0d8a4d] disabled:opacity-60 transition-colors"
                >
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
