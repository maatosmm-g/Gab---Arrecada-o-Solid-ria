import React, { useState, useRef } from 'react';
import { Image, Upload, Trash2, Clipboard } from 'lucide-react';

interface ImageUploadPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
}

export default function ImageUploadPicker({ value, onChange, label, id }: ImageUploadPickerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [pasteError, setPasteError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convete um arquivo local para base64
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setPasteError('O arquivo selecionado deve ser uma imagem.');
      return;
    }
    setPasteError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Suporte para colar via Ctrl+C e Ctrl+V no container ou campo focado
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          handleFile(file);
          break;
        }
      }
    }
  };

  return (
    <div 
      className="space-y-1.5" 
      id={id || "image-upload-wrapper"}
      onPaste={handlePaste}
    >
      {label && <label className="block text-xs font-semibold text-[#444430]">{label}</label>}
      
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Zona de Drop, Clique e Paste */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 min-h-[96px] border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-natural-accent bg-natural-light' 
              : 'border-natural-border bg-white hover:border-natural-primary hover:bg-natural-light/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <Upload className="w-5 h-5 text-natural-primary mb-1" />
          <p className="text-[11px] font-sans text-slate-600">
            Arraste fotos aqui, <span className="text-natural-accent font-semibold underline">clique para buscar</span>
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5 font-mono">
            Ou clique aqui e use <kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 border border-slate-250">Ctrl + V</kbd> para colar imagem
          </p>
        </div>

        {/* URL em formato texto com preview */}
        <div className="sm:w-48 flex flex-col justify-between gap-2">
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-[10px] text-slate-400 uppercase font-mono font-bold">Link da Foto</span>
            <input
              type="text"
              placeholder="https://..."
              className="w-full h-10 pl-2 pr-8 pt-4 pb-1 text-[11px] bg-white border border-natural-border rounded-lg outline-none focus:border-natural-primary"
              value={value.startsWith('data:') ? 'Imagem colada / carregada' : value}
              onChange={(e) => {
                if (!e.target.value.startsWith('Imagem colada')) {
                  onChange(e.target.value);
                }
              }}
              title={value}
            />
            {value && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="absolute right-2.5 top-3 p-0.5 rounded hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                title="Remover Imagem"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Preview em miniatura */}
          {value ? (
            <div className="h-10 border border-natural-border rounded-lg overflow-hidden flex items-center bg-slate-50 relative group">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute inset-0 bg-black/40 text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                Foto ativa
              </span>
            </div>
          ) : (
            <div className="h-10 border border-natural-border border-dashed rounded-lg flex items-center justify-center bg-slate-50 text-slate-300">
              <Image className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
      
      {pasteError && (
        <p className="text-[9px] text-rose-600 font-semibold animate-pulse">{pasteError}</p>
      )}
    </div>
  );
}
