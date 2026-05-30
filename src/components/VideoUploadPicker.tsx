import React, { useState, useRef } from 'react';
import { Video, Upload, Trash2, Link, Info } from 'lucide-react';

interface VideoUploadPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
}

export default function VideoUploadPicker({ value, onChange, label, id }: VideoUploadPickerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper para verificar se é link do YouTube e retornar o Embed URL
  const getEmbedUrl = (rawUrl: string): string => {
    if (!rawUrl) return '';
    
    // Se já é base64
    if (rawUrl.startsWith('data:')) {
      return '';
    }

    try {
      // Regex robusto para YouTube (Shorts, watch, mobile, embed, youtu.be)
      const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = rawUrl.match(ytRegExp);

      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0&modestbranding=1`;
      }

      const url = new URL(rawUrl);
      // Caso de Vimeo
      if (url.hostname.includes('vimeo.com')) {
        const videoId = url.pathname.substring(1).split('?')[0];
        if (videoId && !isNaN(Number(videoId))) {
          return `https://player.vimeo.com/video/${videoId}`;
        }
      }
    } catch (e) {
      // Se não for uma url válida mas tiver cara de ID do YouTube
      if (rawUrl.trim().length === 11 && !rawUrl.includes('/') && !rawUrl.includes('.')) {
        return `https://www.youtube.com/embed/${rawUrl.trim()}?autoplay=0&rel=0&modestbranding=1`;
      }
    }

    return rawUrl;
  };

  // Convert local video file to base64
  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setErrorMsg('O arquivo selecionado deve ser um vídeo.');
      return;
    }
    
    // Limite de 3.5MB recomendado devido aos limites estritos do LocalStorage do navegador (máximo 5MB total)
    if (file.size > 3.5 * 1024 * 1024) { 
      setErrorMsg('Vídeo local muito grande! O navegador limita o armazenamento total a 5MB. Para vídeos maiores ou em alta definição, use um link do YouTube (Shorts ou normal).');
      return;
    }

    setErrorMsg('');
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

  const embedUrl = getEmbedUrl(value);
  const isEmbed = !!embedUrl && !value.startsWith('data:');

  return (
    <div className="space-y-1.5" id={id || "video-upload-wrapper"}>
      {label && <label className="block text-xs font-semibold text-[#444430]">{label}</label>}
      
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Zona de Seleção / Drop do Arquivo de Vídeo */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 min-h-[96px] border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-natural-accent bg-natural-light/50' 
              : 'border-natural-border bg-white hover:border-natural-primary hover:bg-natural-light/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleFileChange}
          />
          
          <Upload className="w-5 h-5 text-natural-accent mb-1" />
          <p className="text-[11px] font-sans text-slate-600">
            Arraste um vídeo aqui, ou <span className="text-natural-accent font-semibold underline">clique para buscar arquivo</span>
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5 font-mono">
            Tamanho recomendado: até 3MB
          </p>
        </div>

        {/* Link / URL ou Embed / Base64 */}
        <div className="sm:w-56 flex flex-col justify-between gap-1.5">
          <div className="relative">
            <span className="absolute left-2.5 top-2 text-[8px] text-slate-400 uppercase font-mono font-bold flex items-center gap-1">
              <Link className="w-2.5 h-2.5" /> Link do YouTube ou Shorts
            </span>
            <input
              type="text"
              placeholder="Cole o link (ex: youtube.com/shorts/...)"
              className="w-full h-10 pl-2.5 pr-8 pt-4 pb-1 text-[11px] bg-white border border-natural-border rounded-lg outline-none focus:border-natural-dark font-medium text-slate-700"
              value={value.startsWith('data:') ? 'Vídeo local carregado' : value}
              onChange={(e) => {
                if (!e.target.value.startsWith('Vídeo local')) {
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
                title="Remover Vídeo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Preview em miniatura ou player */}
          {value ? (
            <div className="h-14 border border-natural-border rounded-lg overflow-hidden flex items-center justify-center bg-slate-900 relative">
              {isEmbed ? (
                <iframe
                  src={embedUrl}
                  title="Pré-visualização do Vídeo"
                  className="w-full h-full pointer-events-none opacity-90 scale-103"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : value.startsWith('data:') ? (
                <video
                  src={value}
                  className="w-full h-full object-cover pointer-events-none"
                  preload="metadata"
                />
              ) : (
                <span className="text-[9px] text-slate-350 italic font-mono flex items-center gap-1 px-1 text-center font-bold">
                  Vídeo inserido
                </span>
              )}
              <div className="absolute inset-0 bg-black/10 text-white font-mono text-[8.5px] p-1 flex items-end justify-between pointer-events-none z-10">
                <span className="bg-black/60 rounded px-1 scale-90">
                  {isEmbed ? 'Mídia Integrada' : value.startsWith('data:') ? 'Arquivo Local' : 'Link Direto'}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-14 border border-natural-border border-dashed rounded-lg flex flex-col items-center justify-center bg-slate-50 text-slate-300">
              <Video className="w-4 h-4 shrink-0" />
              <span className="text-[8px] font-mono mt-0.5">Sem vídeo</span>
            </div>
          )}
        </div>
      </div>
      
      {errorMsg ? (
        <div className="p-1.5 bg-rose-50 border border-rose-150 rounded text-[9.5px] text-rose-700 leading-snug">
          <p className="font-bold">{errorMsg}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1 p-2 bg-slate-55/10 rounded text-[9.5px] text-slate-600 border border-slate-100 leading-relaxed">
          <div className="flex items-start gap-1">
            <Info className="w-3 h-3 text-natural-accent shrink-0 mt-0.5" />
            <span><strong>Dica Importante:</strong> O navegador restringe o tamanho a 5MB por limite de segurança do dispositivo. Cole links do YouTube para compatibilidade total e vídeos de alta qualidade sem restrições!</span>
          </div>
        </div>
      )}
    </div>
  );
}
