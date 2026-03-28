'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { HiOutlinePhotograph, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import { uploadImage, deleteImage } from '@/actions/upload';

interface Props {
  value: string | null;
  onChange: (url: string | null, publicId: string | null) => void;
  folder?: string;
  isPrimary?: boolean;
  size?: 'lg' | 'sm';
}

export default function ImageUploadSlot({
  value,
  onChange,
  folder = 'geuza/products',
  isPrimary = false,
  size = 'sm',
}: Props) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [publicId, setPublicId] = useState<string | null>(null);

  const handleClick = () => {
    if (!loading) inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await uploadImage(fd, folder);
      setPublicId(result.publicId);
      onChange(result.url, result.publicId);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setLoading(false);
      // reset so same file can be re-selected
      e.target.value = '';
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (publicId) await deleteImage(publicId).catch(() => {});
    setPublicId(null);
    onChange(null, null);
  };

  const h = size === 'lg' ? 'h-36' : 'h-28';

  // Has an image
  if (value) {
    return (
      <div className={`relative rounded-xl overflow-hidden ${h} ${size === 'lg' ? 'col-span-2' : ''} group cursor-pointer`} onClick={handleClick}>
        <Image src={value} alt="Product image" fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <span className="text-white text-xs font-semibold">Replace</span>
          <button
            type="button"
            onClick={handleRemove}
            className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <HiOutlineX size={13} />
          </button>
        </div>
        {isPrimary && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Main</span>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    );
  }

  // Empty slot
  return (
    <div
      onClick={handleClick}
      className={`border-2 border-dashed rounded-xl ${h} ${size === 'lg' ? 'col-span-2' : ''} flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
        loading
          ? 'border-primary/40 text-primary bg-primary/5'
          : isPrimary
          ? 'border-gray-200 text-gray-400 hover:border-primary/50 hover:text-primary group'
          : 'border-gray-100 text-gray-300 hover:border-gray-300 hover:text-gray-400'
      }`}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-xs font-semibold">Uploading…</p>
        </div>
      ) : (
        <>
          <div className={`rounded-xl flex items-center justify-center transition-all ${
            isPrimary
              ? 'w-10 h-10 bg-gray-100 group-hover:bg-primary/10'
              : 'w-7 h-7'
          }`}>
            {isPrimary
              ? <HiOutlinePhotograph size={20} className="group-hover:scale-110 transition-transform" />
              : <HiOutlinePlus size={16} />
            }
          </div>
          {isPrimary && <p className="text-xs font-semibold text-center px-2">Main image</p>}
        </>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}
