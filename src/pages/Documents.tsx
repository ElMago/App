import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTruckerContext } from '../context/TruckerContext';
import { Camera, Upload, Trash2, Calendar, Lock, Star } from 'lucide-react';

export default function Documents() {
  const { data, addDocument, deleteDocument } = useTruckerContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<'albaran' | 'factura' | 'otro'>('albaran');
  const [notes, setNotes] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const role = data.profile?.role || 'chofer';
  const navigate = useNavigate();

  if (!data.profile.isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Función Exclusiva PRO</h2>
        <p className="text-gray-600 max-w-md">
          El escáner y almacenamiento de documentos (CMR, Albaranes, Facturas) está reservado para usuarios PRO.
        </p>
        <button
          onClick={() => navigate('/subscription')}
          className="mt-6 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
        >
          <Star className="w-5 h-5 mr-2" />
          Ver Planes Premium
        </button>
      </div>
    );
  }

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image using canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert back to base64 with lower quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        setPreview(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) return alert('Por favor, toma una foto o adjunta un documento.');

    addDocument({
      date: new Date().toISOString(),
      type,
      notes,
      imageData: preview
    });

    setPreview(null);
    setNotes('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Upload Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center text-indigo-800">
          <Camera className="mr-2 text-indigo-600" /> Subir Documento
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipo de Documento</label>
              <select value={type} onChange={e => setType(e.target.value as 'albaran' | 'factura' | 'otro')} className="w-full p-2 border rounded-lg bg-gray-50">
                <option value="albaran">Albarán Carga/Descarga</option>
                {role === 'jefe' && <option value="factura">Factura</option>}
                <option value="otro">Otro / Ticket</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Notas / Referencia</label>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50" placeholder="Ej: Viaje BCN-MAD" />
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
            {preview ? (
              <div className="relative w-full">
                <img src={preview} alt="Preview" className="max-h-48 mx-auto object-contain rounded" />
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-500 mb-4 text-center">Haz una foto al documento o súbelo desde la galería</p>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageCapture}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  ref={fileInputRef}
                />
                <button type="button" className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium pointer-events-none">
                  Abrir Cámara / Galería
                </button>
              </>
            )}
          </div>

          <button type="submit" disabled={!preview} className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center">
            Guardar Documento
          </button>
        </form>
      </div>

      {/* Documents List */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-800">Archivo de Documentos</h3>
        {!data.documents || data.documents.length === 0 ? (
          <p className="text-gray-500 text-center py-4 bg-white rounded-xl border border-gray-100 shadow-sm">No hay documentos guardados.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {data.documents.map(doc => (
              <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div
                  className="h-32 bg-gray-100 relative cursor-pointer"
                  onClick={() => setSelectedDoc(doc.imageData)}
                >
                  <img src={doc.imageData} alt={doc.type} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                    <span className="opacity-0 hover:opacity-100 text-white drop-shadow-md font-medium text-sm">Ver Documento</span>
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        doc.type === 'albaran' ? 'bg-blue-100 text-blue-700' :
                        doc.type === 'factura' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {doc.type}
                      </span>
                      <button onClick={() => deleteDocument(doc.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {doc.notes && <p className="text-xs text-gray-800 font-medium truncate mt-1">{doc.notes}</p>}
                  </div>
                  <p className="text-[10px] text-gray-500 flex items-center mt-2"><Calendar size={10} className="mr-1"/> {new Date(doc.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[2000] bg-black bg-opacity-90 flex flex-col" onClick={() => setSelectedDoc(null)}>
          <div className="flex justify-end p-4">
            <button onClick={() => setSelectedDoc(null)} className="text-white bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30">
              Cerrar
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img src={selectedDoc} className="max-w-full max-h-full object-contain" alt="Document Fullscreen" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
}
