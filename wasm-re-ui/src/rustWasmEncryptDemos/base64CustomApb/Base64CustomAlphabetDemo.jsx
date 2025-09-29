import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FaLock, FaUnlock, FaCopy } from 'react-icons/fa';
import { toast } from 'sonner';
import {
  encode_custom_base64,
  decode_custom_base64,
  encode_base64_with_alphabet,
  decode_base64_with_alphabet,
} from '@/wasm/rust_wasm';
import { copyToClipboard } from '@/lib/utils';
import AnswerCardForCB from './AnswerCardForCB';
import { motion } from 'motion/react';

function Base64Section({ title, description, encodeFn, decodeFn, hasAlphabet = false }) {
  // 左侧（编码侧）
  const [encodeInput, setEncodeInput] = useState('');
  const [encodeOutput, setEncodeOutput] = useState('');
  const [encodeAlphabet, setEncodeAlphabet] = useState('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');

  // 右侧（解码侧）
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeOutput, setDecodeOutput] = useState('');
  const [decodeAlphabet, setDecodeAlphabet] = useState('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');

  const handleEncode = () => {
    try {
      const result = hasAlphabet
        ? encodeFn(encodeInput, encodeAlphabet)
        : encodeFn(encodeInput);
      setEncodeOutput(result);
    } catch (err) {
      toast.error('编码失败', { description: err.toString() });
    }
  };

  const handleDecode = () => {
    try {
      const result = hasAlphabet
        ? decodeFn(decodeInput, decodeAlphabet)
        : decodeFn(decodeInput);
      setDecodeOutput(result);
    } catch (err) {
      toast.error('解码失败', { description: err.toString() });
    }
  };

  const handleCopyEncodeOutput = () => {
    copyToClipboard(encodeOutput);
  };

  const handleCopyDecodeOutput = () => {
    copyToClipboard(decodeOutput);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label>原始字符串</Label>
              <Textarea
                value={encodeInput}
                onChange={(e) => setEncodeInput(e.target.value)}
                placeholder="请输入要编码的原始字符串"
                className="font-mono min-h-[100px] whitespace-pre-wrap break-all"
              />
            </div>

            {hasAlphabet && (
              <div className="space-y-2">
                <Label>Base64 码表（编码用）</Label>
                <Textarea
                  value={encodeAlphabet}
                  onChange={(e) => setEncodeAlphabet(e.target.value)}
                  placeholder="64 个字符的自定义码表"
                  className="font-mono min-h-[80px] whitespace-pre-wrap break-all"
                />
              </div>
            )}

            <Button
              size="sm"
              disabled={!encodeInput.trim()}
              onClick={handleEncode}
              className="w-full flex gap-1"
            >
              <FaLock className="w-4 h-4" />
              编码
            </Button>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>编码结果</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyEncodeOutput}
                  disabled={!encodeOutput.trim()}
                  className="h-7 px-2"
                >
                  <FaCopy className="w-3.5 h-3.5" />
                </Button>
              </div>
              <Textarea
                value={encodeOutput}
                placeholder="编码结果将显示在此"
                className="font-mono min-h-[100px] whitespace-pre-wrap break-all"
                readOnly
              />
            </div>
          </div>

          <div
            className="w-full h-px md:h-auto md:w-px bg-border my-2 md:my-0 md:mx-3"
            aria-hidden="true"
          />

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label>编码字符串</Label>
              <Textarea
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="请输入要解码的 Base64 字符串"
                className="font-mono min-h-[100px] whitespace-pre-wrap break-all"
              />
            </div>

            {hasAlphabet && (
              <div className="space-y-2">
                <Label>Base64 码表（解码用）</Label>
                <Textarea
                  value={decodeAlphabet}
                  onChange={(e) => setDecodeAlphabet(e.target.value)}
                  placeholder="64 个字符的自定义码表"
                  className="font-mono min-h-[80px] whitespace-pre-wrap break-all"
                />
              </div>
            )}

            <Button
              size="sm"
              disabled={!decodeInput.trim()}
              onClick={handleDecode}
              className="w-full flex gap-1"
            >
              <FaUnlock className="w-4 h-4" />
              解码
            </Button>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>解码结果</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyDecodeOutput}
                  disabled={!decodeOutput.trim()}
                  className="h-7 px-2"
                >
                  <FaCopy className="w-3.5 h-3.5" />
                </Button>
              </div>
              <Textarea
                value={decodeOutput}
                placeholder="解码结果将显示在此"
                className="font-mono min-h-[100px] whitespace-pre-wrap break-all"
                readOnly
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Base64CustomAlphabetDemo() {
  return (
    <motion.div
      className="max-w-6xl mx-auto p-4 md:p-8 space-y-4 md:space-y-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      <Base64Section
        title="固定码表（预设）"
        description="使用 Rust WASM 模块内置的自定义 Base64 码表进行编解码"
        encodeFn={encode_custom_base64}
        decodeFn={decode_custom_base64}
        hasAlphabet={false}
      />

      <Base64Section
        title="动态码表（运行时指定）"
        description="在运行时传入任意 64 字符 Base64 码表进行编解码"
        encodeFn={encode_base64_with_alphabet}
        decodeFn={decode_base64_with_alphabet}
        hasAlphabet={true}
      />

      <AnswerCardForCB />
    </motion.div>
  );
}
