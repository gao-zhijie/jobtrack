# JobTrack · 陪你走完求职季

> 不是一个更好的求职表格，是陪用户走完求职季的伙伴。

JobTrack 是一个面向真实求职季的申请管理看板。它从个人长期使用需求出发，帮助用户记录投递、跟进面试、安排日程、复盘过程，并在关键节点给出更有温度的提醒。

它不追求成为通用表格或复杂 CRM，而是把求职这件高压、长期、容易反复的事情封装成一个开箱即用的产品体验。

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS?style=flat-square&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/State-Zustand-purple?style=flat-square)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)

**在线访问：** https://jobtrack-six.vercel.app

---

## 产品定位

JobTrack 的核心判断是：求职管理不是单纯的数据录入，而是一段需要持续推进、反复调整心态的过程。

因此产品更关注：

- **场景封装**：围绕投递、笔试、面试、Offer、归档设计，而不是开放无限字段
- **主动提醒**：把即将到来的截止、面试和待跟进事项主动放到眼前
- **情绪缓冲**：拒信、停滞和复盘都用更克制的文案处理，避免冷冰冰的数据反馈
- **本地优先**：数据默认保存在浏览器本地，不需要账号，也不上传服务器

---

## 核心能力

### 求职看板

- 按求职阶段管理申请：已投递、笔试中、面试中、终面、Offer、已结束
- 支持拖拽流转，让每一次推进都有明确位置
- 面试阶段推进时引导记录复盘，避免面完就忘
- 卡片内沉淀公司、岗位、链接、截止时间、备注和面试记录

### 今日关注

- 汇总今天最需要处理的申请和提醒
- 识别即将到来的截止、面试和长期未更新记录
- 用具体数据生成副文案，让用户知道下一步该看哪里

### 日历视图

- 按日期查看面试和截止事项
- 自动检测同一天的安排冲突
- 支持从日历进入具体申请，减少来回查找

### 周报视图

- 汇总本周投递、推进、面试和结果变化
- 计算面试通过率、阶段分布和坚持天数
- 用周维度帮助用户复盘节奏，而不是只盯着单次结果

### 数据安全中心

- 支持导出完整本地数据
- 支持从 JSON 文件导入恢复
- 删除、导入、清空前自动创建本地快照
- 支持从最近快照恢复，降低误删成本

---

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Next.js 14 App Router |
| 语言 | TypeScript strict |
| 样式 | Tailwind CSS |
| 状态 | Zustand + persist middleware |
| 数据 | localStorage |
| 拖拽 | dnd-kit |
| 图标 | lucide-react |
| 日期 | date-fns |
| 测试 | Vitest |
| 部署 | Vercel |

---

## 快速开始

```bash
git clone git@github.com:gao-zhijie/jobtrack.git
cd jobtrack

npm install
npm run dev
```

访问：

```text
http://localhost:3000
```

常用命令：

```bash
npm run dev      # 启动开发服务器
npm run lint     # 运行 ESLint
npm test         # 运行单元测试
npm run build    # 生产构建
```

---

## 数据说明

JobTrack 当前是纯前端本地应用：

- 不需要注册或登录
- 不连接后端数据库
- 不上传求职记录
- 数据保存在当前浏览器的 localStorage 中

如果更换浏览器、清理浏览器数据或更换设备，记录不会自动同步。建议定期在设置页导出备份文件。

---

## 项目结构

```text
src/
├── app/
│   ├── page.tsx                 # 产品介绍页
│   ├── board/page.tsx           # 看板主视图
│   ├── calendar/page.tsx        # 日历视图
│   ├── weekly/page.tsx          # 周报视图
│   ├── settings/page.tsx        # 数据安全设置页
│   └── clear-storage/page.tsx   # 本地数据清理页
├── components/
│   ├── board/                   # 看板与申请卡片
│   ├── calendar/                # 日历与日期详情
│   ├── card/                    # 申请表单、详情抽屉、面试复盘
│   ├── layout/                  # 侧边栏、顶部栏、今日关注
│   ├── settings/                # 数据安全中心
│   ├── ui/                      # 基础 UI 与反馈组件
│   └── weekly/                  # 周报组件
└── lib/
    ├── store.ts                 # Zustand store
    ├── types.ts                 # 业务类型
    ├── mock.ts                  # 首次使用示例数据
    ├── dataSafety.ts            # 导入导出、快照、迁移
    ├── reminders.ts             # 提醒逻辑
    ├── date.ts                  # 日期规范化
    └── weeklyReport.ts          # 周报计算
```

---

## 当前阶段

JobTrack 已完成首版闭环，正在进入长期自用和持续打磨阶段。

后续迭代会优先解决真实使用中的摩擦，例如更顺手的复盘、更可靠的数据备份、更清晰的提醒节奏，以及更适合长期记录的细节体验。
