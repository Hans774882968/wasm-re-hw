import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  FaCopy,
  FaFile,
  FaLock,
  FaShieldAlt,
  FaSpinner,
  FaUpload,
} from 'react-icons/fa';
import { toast } from 'sonner';
import { cn, copyToClipboard } from '@/lib/utils';
import dayjs from 'dayjs';
import AnswerCard from './AnswerCard';
import { AnimatedCard } from '@/components/AnimatedCard';

// DRY 抽象：哈希配置
const fileShaHashConfigs = {
  'sha256-pure': {
    label: 'SHA256',
    icon: <FaFile className="h-4 w-4" />,
  },
  'sha512-pure': {
    label: 'SHA512',
    icon: <FaFile className="h-4 w-4" />,
  },
  'sha256-default-salt': {
    label: 'SHA256+默认盐',
    icon: <FaFile className="h-4 w-4" />,
  },
  'sha512-default-salt': {
    label: 'SHA512+默认盐',
    icon: <FaFile className="h-4 w-4" />,
  },
  'sha256-salt': {
    label: 'SHA256+自定义盐',
    icon: <FaShieldAlt className="h-4 w-4" />,
    hasCustomSalt: true,
  },
  'sha512-salt': {
    label: 'SHA512+自定义盐',
    icon: <FaShieldAlt className="h-4 w-4" />,
    hasCustomSalt: true,
  },
};
const totalShaMethodTypes = Object.keys(fileShaHashConfigs).length;

function renderResultRow(type, results) {
  const config = fileShaHashConfigs[type];
  const value = results[type];

  if (!value) return null;

  return (
    <div key={type} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-1 text-muted-foreground shrink-0">
        {config.icon}
        <span className="text-sm whitespace-nowrap">{config.label}</span>
      </div>
      <div className="flex-1 relative min-w-0">
        <Textarea
          readOnly
          value={value}
          className="pr-8 font-mono text-xs w-full"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
          onClick={() => copyToClipboard(value)}
          aria-label="复制"
        >
          <FaCopy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default function FileShaDemo() {
  const [file, setFile] = useState(null);
  const [customSalt, setCustomSalt] = useState('');
  const [results, setResults] = useState({});

  const [isProcessing, setIsProcessing] = useState(false);
  const calculationProcess = useRef({
    ...Object.fromEntries(Object.keys(fileShaHashConfigs).map((key) => [key, false])),
  });
  const [completedCount, setCompletedCount] = useState(0);

  const shouldDisableBtn = !file || isProcessing;

  const fileSizeText = file ? `${file.size.toLocaleString()} 字节` : '';
  const fileLastModifiedText = file ? dayjs(file.lastModified).format('YYYY-MM-DD HH:mm:ss') : '';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    // 避免缓存 bug 改动1：强制重置 input 的 value
    e.target.value = '';
    setFile(selectedFile);
    setResults({}); // 清空旧结果
  };

  const handleFileShaHash = async () => {
    if (!file) {
      toast.warning('请先选择文件');
      return;
    }

    setIsProcessing(true);
    calculationProcess.current = {
      ...Object.fromEntries(Object.keys(fileShaHashConfigs).map((key) => [key, true])),
    };
    setCompletedCount(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const fileShaWorker = new Worker(new URL('./fileShaWorker.worker.js', import.meta.url), {
        type: 'module',
      });

      fileShaWorker.onmessage = (e) => {
        const { type, result, error, status } = e.data;

        if (status === 'success') {
          setResults(prev => ({ ...prev, [type]: result }));
        } else {
          setResults(prev => ({ ...prev, [type]: `计算失败: ${error}` }));
        }

        calculationProcess.current = { ...calculationProcess.current, [type]: false };
        // TODO: 优化成 useEffect ，现在懒得改了
        setCompletedCount((prevCount) => {
          const newCount = prevCount + 1;
          if (newCount === totalShaMethodTypes) {
            toast.success('SHA 哈希计算完成', {
              description: `${file.name} 计算完成`,
            });
            setIsProcessing(false);
          }
          return newCount;
        });
      };

      Object.entries(fileShaHashConfigs).forEach(([key, config]) => {
        const payload = {
          id: crypto.randomUUID(),
          type: key,
          data: uint8Array,
          salt: config.hasCustomSalt ? customSalt : '',
        };

        fileShaWorker.postMessage(payload);
      });
    } catch (err) {
      const msg = err.message || err || '文件读取失败';
      console.error('文件读取失败:', err);
      toast.error('文件读取失败', { description: msg });
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      // 避免缓存 bug 改动2：总是新建 File 对象
      const freshFile = new File([droppedFile], droppedFile.name, {
        type: droppedFile.type,
        lastModified: droppedFile.lastModified,
      });
      setFile(freshFile);
      setResults({});
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-8">
        <AnimatedCard theme="quantum-rose" className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FaUpload />
              上传文件
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                file
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=""
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2 md:gap-3 text-muted-foreground"
              >
                <FaUpload className="h-8 w-8 text-muted-foreground" />
                <span>
                  {file ? file.name : '点击或拖拽文件到这里'}
                </span>
                {file && (
                  <>
                    <span>
                      {fileSizeText}
                    </span>
                    <span>
                      上次修改日期：{fileLastModifiedText}
                    </span>
                  </>
                )}
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salt">盐值（Salt）</Label>
              <Input
                id="salt"
                value={customSalt}
                onChange={(e) => setCustomSalt(e.target.value)}
                placeholder="可选，用于增强安全性"
                className="font-mono"
              />
            </div>

            <Button
              onClick={handleFileShaHash}
              disabled={shouldDisableBtn}
              className={cn(
                'w-full flex gap-2',
                shouldDisableBtn && 'opacity-50 cursor-not-allowed'
              )}
            >
              <FaLock />
              {isProcessing ? (
                <>
                  计算中（已完成{completedCount} / {totalShaMethodTypes}）...
                  <FaSpinner className="animate-spin w-4 h-4" />
                </>
              ) : '计算'}
            </Button>

            {Object.keys(results).length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  {renderResultRow(
                    'sha256-pure',
                    results
                  )}
                  {renderResultRow(
                    'sha512-pure',
                    results
                  )}
                  {renderResultRow(
                    'sha256-default-salt',
                    results
                  )}
                  {renderResultRow(
                    'sha512-default-salt',
                    results
                  )}
                  {renderResultRow(
                    'sha256-salt',
                    results
                  )}
                  {renderResultRow(
                    'sha512-salt',
                    results
                  )}
                </div>
              </>
            )}
          </CardContent>
        </AnimatedCard>

        <AnswerCard inPage="bytes" />
      </div>
    </div>
  );
}
