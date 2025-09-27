import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FaQuestionCircle, FaSpinner } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import init, {
  encode_custom_base64,
  encode_base64_with_alphabet,
} from '@/wasm/rust_wasm';
import Celebration from '../shaDemo/Celebration';
import correctMp3Url from '@/assets/correct.mp3';
import wrongMp3Url from '@/assets/wrong.mp3';
import { playAudio } from '@/lib/audioUtils';
import WRAudio from '@/components/WRAudio';
import { toast } from 'sonner';

async function validateBase64Alphabet(userAlphabet) {
  if (!userAlphabet) {
    return false;
  }

  if (userAlphabet.length !== 64) {
    return false;
  }

  try {
    const testInput = '爱拼才会赢💪';
    const encodedWithDefault = encode_custom_base64(testInput);
    const encodedWithUser = encode_base64_with_alphabet(testInput, userAlphabet);
    return encodedWithDefault === encodedWithUser;
  } catch (error) {
    console.error('验证 Base64 码表时出错', error);
    return false;
  }
}

export default function AnswerCardForCB({ onCorrectAnswer }) {
  const [wasmReady, setWasmReady] = useState(false);
  const [userAlphabet, setUserAlphabet] = useState('');
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
    setIsSubmitting(true);

    try {
      const correct = await validateBase64Alphabet(userAlphabet.trim());

      if (correct) {
        playAudio(correctMp3Ref, correctMp3Url);
        setShowCelebration(true);
        toast.success('恭喜你！答案正确！', {
          description: '你成功逆向出了默认 Base64 码表！',
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
            <p>
              通过前端逆向，找出《固定码表（预设）》所使用的码表。
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="base64-alphabet">Base64 码表</Label>
              <Textarea
                id="base64-alphabet"
                value={userAlphabet}
                onChange={(e) => setUserAlphabet(e.target.value)}
                placeholder="请输入 64 个字符的码表，例如 ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
                className="font-mono min-h-[100px]"
                disabled={isSubmitting}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !userAlphabet.trim()}
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
