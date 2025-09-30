import { withLazyEB } from '@/components/errorBoundary/withLazyEB';
import {
  HashIcon,
  HomeIcon,
  Key,
  SearchX,
} from 'lucide-react';
import {
  FaFileAlt,
  FaShieldAlt,
  FaTable,
} from 'react-icons/fa';

const Home = withLazyEB(() => import('@/pages/home/Home'));
const NotFound = withLazyEB(() => import('@/pages/NotFound'));
const AesCbcDemo = withLazyEB(() => import('@/rustWasmEncryptDemos/AesCbcDemo'));
const Base64CustomAlphabetDemo = withLazyEB(() => import('@/rustWasmEncryptDemos/base64CustomApb/Base64CustomAlphabetDemo'));
const RustWasmEncryptDemo = withLazyEB(() => import('@/rustWasmEncryptDemos/RustWasmEncryptDemo'));
const FileShaDemo = withLazyEB(() => import('@/rustWasmEncryptDemos/shaDemo/FileShaDemo'));
const ShaDemo = withLazyEB(() => import('@/rustWasmEncryptDemos/shaDemo/ShaDemo'));

export const routes = [
  {
    path: '/',
    name: '首页',
    element: <Home />,
    icon: <HomeIcon />,
  },
  {
    path: '/xor-encrypt',
    name: 'Rust WASM 异或加密',
    element: <RustWasmEncryptDemo />,
    icon: <Key />,
  },
  {
    path: '/aes-cbc',
    name: 'Rust AES-CBC 加密',
    element: <AesCbcDemo />,
    icon: <FaShieldAlt />,
  },
  {
    path: '/sha-demo',
    name: 'Rust SHA256 / 512 演示',
    element: <ShaDemo />,
    icon: <HashIcon />,
  },
  {
    path: '/file-sha-hash-demo',
    name: 'Rust 文件 SHA 哈希演示',
    element: <FileShaDemo />,
    icon: <FaFileAlt />,
  },
  {
    path: '/base64-custom-alphabet',
    name: 'Rust Base64 自定义码表',
    element: <Base64CustomAlphabetDemo />,
    icon: <FaTable />,
  },
  {
    path: '/404',
    name: '404',
    element: <NotFound />,
    icon: <SearchX />,
  },
  {
    path: '*',
    name: '404',
    element: <NotFound />,
    icon: <SearchX />,
  },
];

export const routesMp = routes.reduce((acc, route) => {
  acc[route.path] = route;
  return acc;
}, {});
