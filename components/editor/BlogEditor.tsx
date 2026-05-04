"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapImage from '@tiptap/extension-image'
import TipTapLink from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'
import { useCallback, useRef } from 'react'

const FONTS = [
  { label: 'Sans Serif', value: 'Inter, sans-serif' },
  { label: 'Serif', value: 'Playfair Display, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Monospace', value: 'Courier New, monospace' },
]

interface BlogEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      TipTapImage.configure({ inline: false }),
      TipTapLink.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Youtube.configure({ width: 640, height: 360 }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your blog post...' }),
      TextStyle,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      Color,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: 'blog-editor-content' } },
  })

  const uploadImage = useCallback(async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url && editor) {
        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run()
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch {
      alert('Upload failed')
    }
  }, [editor])

  const insertLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href
    const url = prompt('Enter URL:', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  const insertVideo = useCallback(() => {
    if (!editor) return
    const url = prompt('Enter YouTube URL:')
    if (url) editor.commands.setYoutubeVideo({ src: url })
  }, [editor])

  if (!editor) {
    return (
      <div className="blog-editor">
        <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
          Loading editor...
        </div>
      </div>
    )
  }

  const currentHeading = editor.isActive('heading', { level: 1 }) ? '1'
    : editor.isActive('heading', { level: 2 }) ? '2'
    : editor.isActive('heading', { level: 3 }) ? '3'
    : editor.isActive('heading', { level: 4 }) ? '4'
    : '0'

  return (
    <div className="blog-editor">
      <div className="editor-toolbar">
        {/* Font Family */}
        <select
          aria-label="Font family"
          onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="toolbar-select"
          title="Font Family"
        >
          {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        {/* Heading / Size */}
        <select
          aria-label="Text style"
          value={currentHeading}
          onChange={e => {
            const level = parseInt(e.target.value)
            if (level === 0) editor.chain().focus().setParagraph().run()
            else editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run()
          }}
          className="toolbar-select"
          title="Text Style"
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>

        <span className="toolbar-divider" />

        {/* Bold */}
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`} title="Bold (Ctrl+B)">
          <strong>B</strong>
        </button>
        {/* Italic */}
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`} title="Italic (Ctrl+I)">
          <em>I</em>
        </button>
        {/* Underline */}
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`toolbar-btn ${editor.isActive('underline') ? 'is-active' : ''}`} title="Underline (Ctrl+U)">
          <span style={{ textDecoration: 'underline' }}>U</span>
        </button>
        {/* Strikethrough */}
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`toolbar-btn ${editor.isActive('strike') ? 'is-active' : ''}`} title="Strikethrough">
          <s>S</s>
        </button>
        {/* Highlight */}
        <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={`toolbar-btn ${editor.isActive('highlight') ? 'is-active' : ''}`} title="Highlight">
          <span style={{ background: '#fef08a', padding: '0 3px', borderRadius: 2 }}>H</span>
        </button>
        {/* Text Color */}
        <label className="toolbar-btn" title="Text Color" style={{ position: 'relative', overflow: 'hidden' }}>
          <span style={{ borderBottom: '3px solid var(--text)' }}>A</span>
          <input type="color" onChange={e => editor.chain().focus().setColor(e.target.value).run()} style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
        </label>

        <span className="toolbar-divider" />

        {/* Alignment */}
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`} title="Align Left">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M2 6h8M2 9h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`} title="Align Center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M4 6h8M2 9h12M4 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`} title="Align Right">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M6 6h8M2 9h12M6 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>

        <span className="toolbar-divider" />

        {/* Lists & Quote */}
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`} title="Bullet List">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="4" r="1.5" fill="currentColor"/><circle cx="3" cy="8" r="1.5" fill="currentColor"/><circle cx="3" cy="12" r="1.5" fill="currentColor"/><path d="M7 4h7M7 8h7M7 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`} title="Numbered List">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><text x="1" y="6" fontSize="6" fill="currentColor" fontWeight="bold">1</text><text x="1" y="10" fontSize="6" fill="currentColor" fontWeight="bold">2</text><text x="1" y="14" fontSize="6" fill="currentColor" fontWeight="bold">3</text><path d="M7 4h7M7 8h7M7 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`toolbar-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`} title="Blockquote">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3v10M7 5h7M7 8h5M7 11h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>

        <span className="toolbar-divider" />

        {/* Insert: Link, Image, Video, Code */}
        <button onClick={insertLink} className={`toolbar-btn ${editor.isActive('link') ? 'is-active' : ''}`} title="Insert Link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 9.5l3-3M5.5 7.5l-2 2a2.12 2.12 0 003 3l2-2M10.5 8.5l2-2a2.12 2.12 0 00-3-3l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={() => imageInputRef.current?.click()} className="toolbar-btn" title="Upload Image">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="6" r="1.5" stroke="currentColor" strokeWidth="1"/><path d="M1.5 11l3.5-4 3 3 2-2 4.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={insertVideo} className="toolbar-btn" title="Embed Video">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 6v4l3.5-2z" fill="currentColor"/></svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`toolbar-btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`} title="Code Block">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 4L1.5 8 5 12M11 4l3.5 4L11 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="toolbar-btn" title="Horizontal Rule">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>

        <span className="toolbar-divider" />

        {/* Undo / Redo */}
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="toolbar-btn" title="Undo">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6h6a3 3 0 010 6H7M4 6l3-3M4 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="toolbar-btn" title="Redo">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 6H6a3 3 0 000 6h3M12 6l-3-3M12 6l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) uploadImage(file)
          e.target.value = ''
        }}
      />

      <EditorContent editor={editor} />
    </div>
  )
}
