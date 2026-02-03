import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileVideo,
  FileImage,
  FileAudio,
  FileText,
} from 'lucide-react';
import { mediaApi } from '@/lib/api';
import { formatBytes } from '@/lib/utils';

const ACCEPTED_TYPES = {
  'video/*': ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'],
  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'],
  'audio/*': ['.mp3', '.ogg', '.wav', '.webm', '.flac'],
  'application/pdf': ['.pdf'],
};

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [sourceInfo, setSourceInfo] = useState('');
  const [lostDate, setLostDate] = useState('');
  const [foundDate, setFoundDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setUploadError('파일 크기는 500MB를 초과할 수 없습니다.');
        return;
      }
      setFile(selectedFile);
      setUploadError(null);
      // Auto-fill title from filename
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
        setTitle(fileName);
      }
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const result = await mediaApi.upload({
        file,
        title: title.trim(),
        description: description.trim() || undefined,
        tags: tags.trim() ? tags.split(',').map(t => t.trim()) : undefined,
        sourceInfo: sourceInfo.trim() || undefined,
        lostDate: lostDate || undefined,
        foundDate: foundDate || undefined,
        onProgress: setUploadProgress,
      });

      setUploadSuccess(result.id);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/view/${result.id}`);
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error instanceof Error
          ? error.message
          : '업로드 중 오류가 발생했습니다. IPFS 데몬이 실행 중인지 확인해주세요.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return File;
    if (file.type.startsWith('video/')) return FileVideo;
    if (file.type.startsWith('image/')) return FileImage;
    if (file.type.startsWith('audio/')) return FileAudio;
    return FileText;
  };

  const FileIcon = getFileIcon();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-dark-100 mb-2">미디어 업로드</h1>
        <p className="text-dark-400">
          잊혀진 미디어를 IPFS에 영구적으로 보존하세요.
          <br />
          <span className="text-dark-500 text-sm">
            파일은 서버에 저장되지 않고 직접 IPFS로 전송됩니다.
          </span>
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {uploadSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-dark-100 mb-2">업로드 완료!</h2>
            <p className="text-dark-400 mb-6">
              미디어가 성공적으로 IPFS에 업로드되었습니다.
            </p>
            <p className="text-dark-500 text-sm">
              잠시 후 미디어 페이지로 이동합니다...
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`
                glass-card p-8 text-center cursor-pointer transition-all border-2 border-dashed
                ${isDragActive ? 'border-primary-500 bg-primary-500/5' : 'border-dark-700 hover:border-dark-500'}
                ${file ? 'border-green-500/50' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-dark-800 flex items-center justify-center">
                    <FileIcon className="w-7 h-7 text-primary-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-dark-100">{file.name}</p>
                    <p className="text-sm text-dark-400">{formatBytes(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-dark-400" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-dark-400" />
                  </div>
                  <p className="text-dark-200 font-medium mb-1">
                    {isDragActive ? '파일을 여기에 놓으세요' : '파일을 드래그하거나 클릭하여 선택'}
                  </p>
                  <p className="text-dark-500 text-sm">
                    영상, 이미지, 오디오, PDF (최대 500MB)
                  </p>
                </>
              )}
            </div>

            {/* Form Fields */}
            <div className="glass-card p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="미디어 제목을 입력하세요"
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  설명
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="미디어에 대한 설명을 입력하세요"
                  rows={4}
                  className="input resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  태그
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="태그를 쉼표로 구분하여 입력 (예: 광고, 90년대, TV)"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  출처 정보
                </label>
                <input
                  type="text"
                  value={sourceInfo}
                  onChange={(e) => setSourceInfo(e.target.value)}
                  placeholder="원본 출처나 관련 정보를 입력하세요"
                  className="input"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    유실 추정일
                  </label>
                  <input
                    type="date"
                    value={lostDate}
                    onChange={(e) => setLostDate(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    발견일
                  </label>
                  <input
                    type="date"
                    value={foundDate}
                    onChange={(e) => setFoundDate(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {uploadError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-400 text-sm">{uploadError}</p>
              </motion.div>
            )}

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">업로드 중...</span>
                  <span className="text-dark-300">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || !title.trim() || isUploading}
              className="btn btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  IPFS에 업로드
                </>
              )}
            </button>

            {/* Info Box */}
            <div className="glass-card p-4 text-sm text-dark-400">
              <p className="font-medium text-dark-300 mb-2">📌 안내사항</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>파일은 서버 디스크에 저장되지 않고 직접 IPFS로 스트리밍됩니다.</li>
                <li>업로드된 콘텐츠는 분산 네트워크에 영구적으로 저장됩니다.</li>
                <li>CID(콘텐츠 주소)는 외부에 노출되지 않습니다.</li>
              </ul>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
