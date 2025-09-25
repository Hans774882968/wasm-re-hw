import { useState, useEffect } from 'react';
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
import { FaCopy, FaHashtag, FaLock, FaShieldAlt } from 'react-icons/fa';
import { cn, copyToClipboard } from '@/lib/utils';
import init, {
  get_str_sha256,
  get_str_sha256_pure,
  get_str_sha256_with_salt,
  get_str_sha512,
  get_str_sha512_pure,
  get_str_sha512_with_salt,
} from '@/wasm/rust_wasm';
import AnswerCard from './AnswerCard';
import { toast } from 'sonner';

// 哈希配置数据 —— DRY 抽象，避免重复代码
const shaHashConfigs = {
  'sha256-pure': {
    label: 'SHA256',
    fn: (input) => get_str_sha256_pure(input),
    icon: <FaHashtag className="h-4 w-4" />,
  },
  'sha512-pure': {
    label: 'SHA512',
    fn: (input) => get_str_sha512_pure(input),
    icon: <FaHashtag className="h-4 w-4" />,
  },
  'sha256-default-salt': {
    label: 'SHA256+默认盐',
    fn: (input) => get_str_sha256(input),
    icon: <FaHashtag className="h-4 w-4" />,
  },
  'sha512-default-salt': {
    label: 'SHA512+默认盐',
    fn: (input) => get_str_sha512(input),
    icon: <FaHashtag className="h-4 w-4" />,
  },
  'sha256-salt': {
    label: 'SHA256+自定义盐',
    fn: (input, salt) => get_str_sha256_with_salt(input, salt),
    icon: <FaShieldAlt className="h-4 w-4" />,
    hasCustomSalt: true,
  },
  'sha512-salt': {
    label: 'SHA512+自定义盐',
    fn: (input, salt) => get_str_sha512_with_salt(input, salt),
    icon: <FaShieldAlt className="h-4 w-4" />,
    hasCustomSalt: true,
  },
};

export default function ShaDemo() {
  const [input, setInput] = useState('');
  const [customSalt, setCustomSalt] = useState('');
  const [results, setResults] = useState({
    'sha256-pure': '',
    'sha512-pure': '',
    'sha256-default-salt': '',
    'sha512-default-salt': '',
    'sha256-salt': '',
    'sha512-salt': '',
  });
  const [wasmReady, setWasmReady] = useState(false);

  const shouldDisableBtn = !input.trim() || !wasmReady;

  useEffect(() => {
    async function initWasm() {
      if (wasmReady) return;
      try {
        await init();
        setWasmReady(true);
      } catch (err) {
        console.error('WASM 初始化失败', err);
        toast.error('WASM 初始化失败', { description: err.message });
      }
    }

    initWasm();
  }, [wasmReady]);

  const handleShaHash = () => {
    if (shouldDisableBtn) return;

    const newResults = {};

    for (const [key, config] of Object.entries(shaHashConfigs)) {
      const type = key;

      let result = '';
      try {
        if (config.hasCustomSalt) {
          result = config.fn(input, customSalt);
        } else {
          result = config.fn(input);
        }
      } catch (err) {
        console.error(`Sha hash calculation failed for ${type}:`, err);
        result = '计算失败qwq';
      }

      newResults[type] = result;
    }

    setResults(newResults);
  };

  // 渲染单个结果行
  function renderResultRow(type) {
    const config = shaHashConfigs[type];
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

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FaHashtag />
              SHA哈希演示
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input">明文</Label>
              <Input
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="请输入"
                className="font-mono"
              />
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
              onClick={handleShaHash}
              disabled={shouldDisableBtn}
              className={cn(
                'w-full flex gap-2',
                shouldDisableBtn && 'opacity-50 cursor-not-allowed'
              )}
            >
              <FaLock />
              计算
            </Button>

            {Object.values(results).some(val => val) && (
              <>
                <Separator />
                <div className="space-y-3">
                  {renderResultRow('sha256-pure')}
                  {renderResultRow('sha512-pure')}
                  {renderResultRow('sha256-default-salt')}
                  {renderResultRow('sha512-default-salt')}
                  {renderResultRow('sha256-salt')}
                  {renderResultRow('sha512-salt')}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <AnswerCard inPage="str" />
      </div>
    </div>
  );
}
