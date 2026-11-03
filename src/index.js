/* 设计系统的 JS 入口：注入图标精灵并提供 DS 交互工具。
   用法（ESM）：import { DS } from '@self/ui-style';  // 页面需有 .ds-theme 容器 */
import './ui/icons.js';
import './ui/ui.js';

export const DS = globalThis.DS;
