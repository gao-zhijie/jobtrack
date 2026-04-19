# JobTrack · 陪你走完求职季

> 不是一个更好的求职表格，是陪用户走完求职季的伙伴。

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS?style=flat-square&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/State-Zustand-purple?style=flat-square)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)

**在线访问：** https://jobtrack-six.vercel.app

---

## 核心特性

### 看板管理
- **6 阶段求职追踪**：已投递 → 笔试 → 初面 → 二面 → 终面 → Offer
- **拖拽交互**：面试阶段前进自动弹出复盘表单，记录面试问题和反思
- **情绪化文案**：数字背后有温度，每条数据都配有鼓励性的副文案

### 日历视图
- 可视化面试时间安排
- **冲突检测**：同一时间段多场面试自动高亮提醒

### 周报统计
- 本周投递趋势分析
- 面试通过率追踪
- 坚持天数与进度可视化

### 设计理念

| 设计原则 | 说明 |
|---------|------|
| 场景封装 | 对标 Keep 之于跑步，不和飞书/Notion 比功能 |
| 主动性 | 产品主动提醒、归档、复盘，而非等用户填字段 |
| 情绪设计 | 求职是高压场景，所有数字背后都要有"情绪化副文案" |
| 开箱即用 | 30 秒上手，不给用户任何配置负担 |

---

## 技术栈

| 类别 | 技术 |
|-----|------|
| 框架 | Next.js 14 App Router + TypeScript (strict) |
| 样式 | Tailwind CSS (Linear-inspired 配色) |
| 状态 | Zustand + localStorage |
| 拖拽 | dnd-kit |
| 图标 | lucide-react (线条风) |
| 日期 | date-fns |
| 部署 | Vercel (自动部署) |

---

## 快速开始

```bash
# 克隆项目
git clone git@github.com:gao-zhijie/jobtrack.git
cd jobtrack

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

---

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 产品介绍页
│   ├── board/page.tsx     # 看板主视图
│   ├── calendar/page.tsx  # 日历视图
│   └── weekly/page.tsx    # 周报统计
├── components/
│   ├── board/             # 看板组件 (Column, Card)
│   ├── calendar/          # 日历组件
│   ├── card/              # 卡片详情、复盘表单
│   ├── layout/            # 侧边栏、Header
│   ├── ui/                # Toast、庆祝动画
│   └── weekly/            # 周报组件
└── lib/
    ├── mock.ts            # 示例数据
    ├── store.ts           # Zustand store
    ├── types.ts           # TypeScript 类型
    └── weeklyReport.ts     # 周报计算逻辑
```
