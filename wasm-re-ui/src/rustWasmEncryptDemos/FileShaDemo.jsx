import { useState, useCallback, useEffect } from 'react';
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
import init, {
  get_bytes_sha256,
  get_bytes_sha256_pure,
  get_bytes_sha256_with_salt,
  get_bytes_sha512,
  get_bytes_sha512_pure,
  get_bytes_sha512_with_salt,
} from '@/wasm/rust_wasm';
import dayjs from 'dayjs';

// DRY 抽象：哈希配置
const fileShaHashConfigs = {
  'sha256-pure': {
    label: 'SHA256',
    fn: (data) => get_bytes_sha256_pure(data),
    icon: <FaFile className="h-4 w-4" />,
  },
  'sha512-pure': {
    label: 'SHA512',
    fn: (data) => get_bytes_sha512_pure(data),
    icon: <FaFile className="h-4 w-4" />,
  },
  'sha256-default-salt': {
    label: 'SHA256+默认盐',
    fn: (data) => get_bytes_sha256(data),
    icon: <FaFile className="h-4 w-4" />,
  },
  'sha512-default-salt': {
    label: 'SHA512+默认盐',
    fn: (data) => get_bytes_sha512(data),
    icon: <FaFile className="h-4 w-4" />,
  },
  'sha256-salt': {
    label: 'SHA256+自定义盐',
    fn: (data, salt) => get_bytes_sha256_with_salt(data, salt),
    icon: <FaShieldAlt className="h-4 w-4" />,
    hasCustomSalt: true,
  },
  'sha512-salt': {
    label: 'SHA512+自定义盐',
    fn: (data, salt) => get_bytes_sha512_with_salt(data, salt),
    icon: <FaShieldAlt className="h-4 w-4" />,
    hasCustomSalt: true,
  },
};

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
  const [ready, setReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const shouldDisableBtn = !file || !ready || isProcessing;

  const fileSizeText = file ? `${file.size.toLocaleString()} 字节` : '';
  const fileLastModifiedText = file ? dayjs(file.lastModified).format('YYYY-MM-DD HH:mm:ss') : '';

  useEffect(() => {
    async function initWasm() {
      if (ready) return;
      try {
        await init();
        setReady(true);
      } catch (err) {
        console.error('WASM 初始化失败', err);
        toast.error('WASM 初始化失败', { description: err.message });
      }
    }

    initWasm();
  }, [ready]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    // 避免缓存 bug 改动1：强制重置 input 的 value
    e.target.value = '';
    setFile(selectedFile);
    setResults({}); // 清空旧结果
  };

  const handleFileShaHash = async () => {
    if (!file || !ready) {
      toast.warning('请先选择文件并等待初始化完成');
      return;
    }

    setIsProcessing(true);
    const newResults = {};

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      for (const [key, config] of Object.entries(fileShaHashConfigs)) {
        try {
          let result;
          if (config.hasCustomSalt) {
            result = config.fn(uint8Array, customSalt);
          } else {
            result = config.fn(uint8Array, '');
          }
          newResults[key] = result;
        } catch (err) {
          console.error(`计算 ${key} 失败:`, err);
          newResults[key] = '计算失败';
        }
      }

      setResults(newResults);
      toast.success('SHA 哈希计算完成', {
        description: `${file.name} 计算完成`,
      });
    } catch (err) {
      const msg = err.message || err || '文件读取失败';
      console.error('文件读取失败:', err);
      toast.error('文件读取失败', { description: msg });
    } finally {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">题目</h1>
          <p className="text-muted-foreground">
            找到“SHA256+默认盐”和“SHA512+默认盐”中默认盐的值
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaUpload className="text-primary" />
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
                  计算中...
                  <FaSpinner className="animate-spin h-4 w-4" />
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
        </Card>
      </div>
    </div>
  );
}
