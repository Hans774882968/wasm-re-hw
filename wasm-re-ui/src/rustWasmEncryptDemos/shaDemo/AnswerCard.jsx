import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FaQuestionCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import init, {
  get_bytes_sha256,
  get_bytes_sha256_with_salt,
  get_bytes_sha512,
  get_bytes_sha512_with_salt,
  get_str_sha256,
  get_str_sha256_with_salt,
  get_str_sha512,
  get_str_sha512_with_salt,
} from '@/wasm/rust_wasm';
import Celebration from './Celebration';
import correctMp3Url from '@/assets/correct.mp3';
import wrongMp3Url from '@/assets/wrong.mp3';
import { playAudio } from '@/lib/audioUtils';
import WRAudio from '@/components/WRAudio';

const pageMethodMap = {
  'str': {
    sha256: get_str_sha256,
    sha256WithSalt: get_str_sha256_with_salt,
    sha512: get_str_sha512,
    sha512WithSalt: get_str_sha512_with_salt,
  },
  'bytes': {
    sha256: get_bytes_sha256,
    sha256WithSalt: get_bytes_sha256_with_salt,
    sha512: get_bytes_sha512,
    sha512WithSalt: get_bytes_sha512_with_salt,
  },
};

async function validateAnswer(inPage, sha256Salt, sha512Salt) {
  if (!pageMethodMap[inPage]) {
    throw new Error(`Valid inPage is required, but got ${inPage}`);
  }

  try {
    const testInput = 'test';
    const sha256ResultWithDefault = pageMethodMap[inPage].sha256(testInput);
    const sha256ResultWithProvided = pageMethodMap[inPage].sha256WithSalt(testInput, sha256Salt);

    if (sha256ResultWithDefault !== sha256ResultWithProvided) {
      return false;
    }

    const sha512ResultWithDefault = pageMethodMap[inPage].sha512(testInput);
    const sha512ResultWithProvided = pageMethodMap[inPage].sha512WithSalt(testInput, sha512Salt);

    if (sha512ResultWithDefault !== sha512ResultWithProvided) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('答案验证过程中出错', error);
    toast.error(`答案验证过程中出错：${error}`);
    return false;
  }
}

export default function AnswerCard({
  inPage,
  onCorrectAnswer,
}) {
  const [wasmReady, setWasmReady] = useState(false);
  const [sha256Salt, setSha256Salt] = useState('');
  const [sha512Salt, setSha512Salt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const correctMp3Ref = useRef(null);
  const wrongMp3Ref = useRef(null);

  useEffect(() => {
    async function initWasm() {
      if (wasmReady) return;
      try {
        await init();
        setWasmReady(true);
      } catch (err) {
        console.error('WASM 初始化失败', err);
        toast.error('WASM 初始化失败', { description: err.toString() });
      }
    }

    initWasm();
  }, [wasmReady]);

  const handleSubmit = async () => {
    if (!sha256Salt.trim() || !sha512Salt.trim()) {
      toast.warning('请输入两个盐值');
      return;
    }

    setIsSubmitting(true);

    try {
      const correct = await validateAnswer(inPage, sha256Salt.trim(), sha512Salt.trim());

      if (correct) {
        playAudio(correctMp3Ref, correctMp3Url);
        setShowCelebration(true);
        toast.success('恭喜你！答案正确！', {
          description: '你成功找到了默认盐值！',
        });

        if (onCorrectAnswer) {
          onCorrectAnswer();
        }

        setTimeout(() => setShowCelebration(false), 3000);
      } else {
        playAudio(wrongMp3Ref, wrongMp3Url);
        toast.error('答案错误', {
          description: '请再接再厉qwq',
        });
      }
    } catch (error) {
      console.error('验证过程中出错', error);
      toast.error(`验证过程中出错：${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {showCelebration && <Celebration />}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FaQuestionCircle />
            逆向挑战
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p>通过逆向，找到“SHA256+默认盐”和“SHA512+默认盐”中默认盐的值。</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sha256-salt">SHA256 默认盐值</Label>
              <Input
                id="sha256-salt"
                value={sha256Salt}
                onChange={(e) => setSha256Salt(e.target.value)}
                placeholder="请输入 SHA256 的默认盐值"
                className="font-mono"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sha512-salt">SHA512 默认盐值</Label>
              <Input
                id="sha512-salt"
                value={sha512Salt}
                onChange={(e) => setSha512Salt(e.target.value)}
                placeholder="请输入 SHA512 的默认盐值"
                className="font-mono"
                disabled={isSubmitting}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !sha256Salt.trim() || !sha512Salt.trim()}
              className={cn(
                'w-full flex gap-2',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin w-4 h-4" />
                  验证中...
                </>
              ) : '提交'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <WRAudio ref={correctMp3Ref} src={correctMp3Url} />
      <WRAudio ref={wrongMp3Ref} src={wrongMp3Url} />
    </div>
  );
}
