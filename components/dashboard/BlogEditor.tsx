'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useRef, useState, useCallback, useEffect } from 'react';
import { uploadImage } from '@/actions/upload';

// ─── Toolbar primitives ───────────────────────────────────────────────────────

function Sep() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0" />;
}

function Btn({
  onClick,
  active = false,
  title,
  children,
  disabled = false,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all flex-shrink-0 ${
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : active
          ? 'bg-primary text-white shadow-sm'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      {children}
    </button>
  );
}

// ─── SVG icons ────────────────────────────────────────────────────────────────

const Icons = {
  Bold:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 11.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>,
  Italic:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>,
  Underline:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>,
  Strike:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>,
  Code:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>,
  AlignLeft:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>,
  AlignCenter: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>,
  AlignRight:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>,
  BulletList:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>,
  OrderedList: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>,
  Blockquote:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>,
  Link:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>,
  Unlink:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 3l1.46 1.44C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16v-2zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4 4L20 19.74 3.27 3 2 4.27z"/></svg>,
  Image:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  HR:          () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>,
  Undo:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>,
  Redo:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>,
};

// ─── Link dialog ──────────────────────────────────────────────────────────────

function LinkDialog({
  defaultUrl,
  onApply,
  onRemove,
  onClose,
}: {
  defaultUrl: string;
  onApply: (url: string) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(defaultUrl);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-1 text-base">Insert Link</h3>
        <p className="text-xs text-gray-400 mb-4">Enter a URL and click Apply, or Remove to unlink.</p>
        <input
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 mb-4"
          onKeyDown={(e) => { if (e.key === 'Enter') onApply(url); if (e.key === 'Escape') onClose(); }}
        />
        <div className="flex gap-2">
          <button
            onClick={() => onApply(url)}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all"
          >
            Apply
          </button>
          {defaultUrl && (
            <button
              onClick={onRemove}
              className="px-4 py-2.5 rounded-xl border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
            >
              Remove
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────────

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function BlogEditor({ content, onChange, placeholder }: Props) {
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading]         = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const initialContent        = useRef(content);
  const contentInitialized    = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
      }),
      TiptapImage.configure({
        HTMLAttributes: { class: 'rounded-xl max-w-full my-4 mx-auto block shadow-md' },
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Start writing your article here...',
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
    ],
    content: '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'focus:outline-none' },
    },
  });

  // One-time content initialization — handles both new (empty) and edit (existing) forms
  useEffect(() => {
    if (!editor || contentInitialized.current) return;
    contentInitialized.current = true;
    if (initialContent.current) {
      editor.commands.setContent(initialContent.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await uploadImage(fd, 'geuza/blog');
      editor.chain().focus()
        .insertContent([
          { type: 'image', attrs: { src: result.url, alt: file.name } },
          { type: 'paragraph' },
        ])
        .run();
    } catch {
      console.error('Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-gray-100 rounded-2xl bg-white">
        <div className="h-12 border-b border-gray-100 bg-gray-50 animate-pulse rounded-t-2xl" />
        <div className="h-64 animate-pulse" />
      </div>
    );
  }

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs);

  const currentLink = editor.getAttributes('link').href ?? '';

  const headingValue = isActive('heading', { level: 1 }) ? 'h1'
    : isActive('heading', { level: 2 }) ? 'h2'
    : isActive('heading', { level: 3 }) ? 'h3'
    : 'p';

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-100 px-3 py-2 flex items-center gap-0.5 flex-wrap">

        {/* Text style */}
        <select
          value={headingValue}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'p') editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: parseInt(v[1]) as 1 | 2 | 3 }).run();
          }}
          className="h-8 px-2 pr-6 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 bg-white focus:outline-none hover:border-gray-300 cursor-pointer mr-1 appearance-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '16px' }}
        >
          <option value="p">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <Sep />

        {/* Inline formatting */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()}      active={isActive('bold')}      title="Bold (Ctrl+B)"><Icons.Bold /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()}    active={isActive('italic')}    title="Italic (Ctrl+I)"><Icons.Italic /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={isActive('underline')} title="Underline (Ctrl+U)"><Icons.Underline /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()}    active={isActive('strike')}    title="Strikethrough"><Icons.Strike /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCode().run()}      active={isActive('code')}      title="Inline code"><Icons.Code /></Btn>

        <Sep />

        {/* Alignment */}
        <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()}   active={editor.isActive({ textAlign: 'left' })}   title="Align left"><Icons.AlignLeft /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center"><Icons.AlignCenter /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()}  active={editor.isActive({ textAlign: 'right' })}  title="Align right"><Icons.AlignRight /></Btn>

        <Sep />

        {/* Lists & blocks */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()}  active={isActive('bulletList')}  title="Bullet list"><Icons.BulletList /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={isActive('orderedList')} title="Numbered list"><Icons.OrderedList /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()}  active={isActive('blockquote')}  title="Blockquote"><Icons.Blockquote /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()}   active={isActive('codeBlock')}   title="Code block">
          <span className="font-mono text-xs font-bold">{'</>'}</span>
        </Btn>

        <Sep />

        {/* Link */}
        <Btn
          onClick={() => setShowLinkDialog(true)}
          active={isActive('link')}
          title="Insert / edit link"
        >
          <Icons.Link />
        </Btn>
        {isActive('link') && (
          <Btn onClick={() => editor.chain().focus().unsetLink().run()} active={false} title="Remove link">
            <Icons.Unlink />
          </Btn>
        )}

        {/* Image */}
        <Btn
          onClick={() => imgInputRef.current?.click()}
          active={false}
          title="Insert image"
          disabled={uploading}
        >
          {uploading
            ? <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-primary animate-spin block" />
            : <Icons.Image />
          }
        </Btn>

        <Sep />

        {/* HR */}
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false} title="Horizontal rule"><Icons.HR /></Btn>

        <Sep />

        {/* Undo / Redo */}
        <Btn onClick={() => editor.chain().focus().undo().run()} active={false} title="Undo (Ctrl+Z)" disabled={!editor.can().undo()}><Icons.Undo /></Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} active={false} title="Redo (Ctrl+Shift+Z)" disabled={!editor.can().redo()}><Icons.Redo /></Btn>

        {/* Word count */}
        <span className="ml-auto text-xs text-gray-300 font-medium flex-shrink-0">
          {editor.storage.characterCount?.words?.() ?? 0} words
        </span>
      </div>

      {/* ── Editor area ──────────────────────────────────────────────────────── */}
      <div className="p-6 bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* ── Link dialog ──────────────────────────────────────────────────────── */}
      {showLinkDialog && (
        <LinkDialog
          defaultUrl={currentLink}
          onApply={(url) => {
            if (url) editor.chain().focus().setLink({ href: url }).run();
            setShowLinkDialog(false);
          }}
          onRemove={() => {
            editor.chain().focus().unsetLink().run();
            setShowLinkDialog(false);
          }}
          onClose={() => setShowLinkDialog(false)}
        />
      )}

      {/* ── Hidden image file input ───────────────────────────────────────────── */}
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
