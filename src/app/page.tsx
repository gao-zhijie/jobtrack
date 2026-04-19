"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── 数据 ────────────────────────────────────────────────────────────────────

const PROBLEMS = [
  { num: "01", text: "投了 40 家，忘了哪一家还在等回音" },
  { num: "02", text: "两个面试撞一天，手忙脚乱改时间" },
  { num: "03", text: "连续被拒 5 家，开始怀疑自己" },
];

const COMPARE_ROWS = [
  { label: "用户付出",  bad: "2 小时搭建",     good: "30 秒上手" },
  { label: "场景认知",  bad: "无",             good: "预设求职全流程" },
  { label: "主动性",   bad: "被动记录",        good: "主动提醒、归档、复盘" },
  { label: "情绪设计",  bad: "无",             good: "周报、里程碑、拒信缓冲" },
];

const FEATURES = [
  {
    num: "01",
    tag: "看板",
    title: "一眼看全局",
    desc: "6 个阶段覆盖求职全流程。从投递到 Offer，每家公司的进展一目了然。卡片超期自动标红，14 天无响应建议归档。",
    highlights: ["拖拽换阶段", "超期提醒", "休眠归档"],
  },
  {
    num: "02",
    tag: "日历",
    title: "时间从不打架",
    desc: "自动检测面试日期冲突，同一天两场面试会提前警告。截止日期是倒计时，不是被动等待。",
    highlights: ["冲突检测", "截止倒计时", "日程总览"],
  },
  {
    num: "03",
    tag: "周报",
    title: "每周给你一次回顾",
    desc: "不是冷冰冰的数字，是有温度的总结。投递了几家，完成了几场，和上周相比如何，还有那句你可能需要的话。",
    highlights: ["与上周对比", "在途分布", "情绪化寄语"],
  },
  {
    num: "04",
    tag: "面试复盘",
    title: "每次面试都让你更强",
    desc: "拖拽卡片进入新阶段时，自动弹出复盘表单。被问到什么、发挥如何、有什么反思——2 分钟写完，以后你会感谢自己。",
    highlights: ["自动触发", "问题记录", "表现评级"],
  },
];

// ─── Hook ────────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -48px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Mini Kanban（Hero 右侧装饰） ─────────────────────────────────────────────

function MiniKanban() {
  return (
    <div className="relative h-[340px] select-none pointer-events-none">
      {/* Card: 面试中 */}
      <div
        className="absolute top-0 right-2 w-[210px] bg-white rounded-xl border border-border shadow p-4"
        style={{
          transform: "rotate(1.5deg)",
          animation: "fade-in-up 0.55s ease-out 0.45s both",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-primary">面试中</span>
          <span
            className="w-2 h-2 rounded-full bg-primary animate-pulse"
            style={{ animationDuration: "2s" }}
          />
        </div>
        <p className="text-sm font-semibold text-text-primary">腾讯</p>
        <p className="text-xs text-text-secondary mt-0.5">产品实习生</p>
        <div className="mt-3 pt-2.5 border-t border-border flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-danger" />
          <span className="text-xs text-danger font-medium">2 天后截止</span>
        </div>
      </div>

      {/* Card: Offer */}
      <div
        className="absolute top-[88px] left-0 w-[210px] bg-white rounded-xl border border-[#059669]/25 shadow p-4"
        style={{
          transform: "rotate(-1.2deg)",
          animation: "fade-in-up 0.55s ease-out 0.6s both",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#059669]">Offer</span>
          <span className="w-2 h-2 rounded-full bg-[#059669]" />
        </div>
        <p className="text-sm font-semibold text-text-primary">小红书</p>
        <p className="text-xs text-text-secondary mt-0.5">商业产品经理</p>
        <div className="mt-3 pt-2.5 border-t border-border">
          <span className="text-xs text-[#059669] font-medium">已获 Offer</span>
        </div>
      </div>

      {/* Card: 已投递 */}
      <div
        className="absolute bottom-0 right-10 w-[210px] bg-white rounded-xl border border-border shadow-sm p-4"
        style={{
          transform: "rotate(0.6deg)",
          animation: "fade-in-up 0.55s ease-out 0.75s both",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-text-secondary">已投递</span>
          <span className="w-2 h-2 rounded-full bg-text-muted" />
        </div>
        <p className="text-sm font-semibold text-text-primary">字节跳动</p>
        <p className="text-xs text-text-secondary mt-0.5">用户增长产品</p>
        <div className="mt-3 pt-2.5 border-t border-border">
          <span className="text-xs text-text-muted">等待回音中</span>
        </div>
      </div>

      {/* 淡化背景装饰圆 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/4 -z-10"
      />
    </div>
  );
}

// ─── 主页面 ──────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const problems = useReveal();
  const compare  = useReveal();
  const features = useReveal();
  const cta      = useReveal();

  return (
    <div className="min-h-screen bg-background">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1040px] mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L18 10L10 18L2 10L10 2Z" fill="#5E6AD2" fillOpacity="0.2" />
              <path d="M10 6L14 10L10 14L6 10L10 6Z" fill="#5E6AD2" />
            </svg>
            <span className="text-sm font-semibold text-text-primary tracking-tight">
              JobTrack
            </span>
          </div>
          <Link
            href="/board"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
          >
            进入看板
            <ArrowRight size={12} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-white pt-36 pb-28 px-8">
        <div className="max-w-[1040px] mx-auto grid grid-cols-[1fr_400px] gap-20 items-center">

          {/* 左：文字 */}
          <div>
            <p
              className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-6"
              style={{ animation: "fade-in-up 0.5s ease-out 0s both" }}
            >
              求职管理工具
            </p>
            <h1
              className="text-[48px] font-semibold text-text-primary leading-[1.15] tracking-tight mb-5"
              style={{ animation: "fade-in-up 0.5s ease-out 0.1s both" }}
            >
              不是一个更好<br />
              的求职表格。
            </h1>
            <p
              className="text-lg text-text-secondary leading-relaxed mb-10"
              style={{ animation: "fade-in-up 0.5s ease-out 0.2s both" }}
            >
              是陪你走完求职季的伙伴。
            </p>
            <div
              className="flex items-center gap-3"
              style={{ animation: "fade-in-up 0.5s ease-out 0.3s both" }}
            >
              <Link
                href="/board"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                开始使用
                <ArrowRight size={15} />
              </Link>
              <a
                href="#design"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-text-secondary border border-border rounded-lg hover:border-text-muted hover:text-text-primary transition-colors"
              >
                了解设计思考
              </a>
            </div>
          </div>

          {/* 右：Mini 看板 */}
          <div style={{ animation: "fade-in-up 0.5s ease-out 0.35s both" }}>
            <MiniKanban />
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <div className="bg-primary/[0.04] border-y border-primary/10 px-8 py-4">
        <div className="max-w-[1040px] mx-auto flex items-center gap-12">
          {[
            { num: "6", label: "求职流程阶段" },
            { num: "30s", label: "上手时间" },
            { num: "0", label: "配置负担" },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-primary">{s.num}</span>
              <span className="text-sm text-text-secondary">{s.label}</span>
            </div>
          ))}
          <p className="ml-auto text-xs text-text-muted italic">
            数据存本地 · 无需注册 · 无后端依赖
          </p>
        </div>
      </div>

      {/* ── Problems ─────────────────────────────────────────────────────── */}
      <section className="bg-background px-8 py-24">
        <div
          ref={problems.ref}
          className={`max-w-[1040px] mx-auto transition-all duration-700 ease-out ${
            problems.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <p className="text-xs font-semibold text-text-muted uppercase tracking-[0.15em] mb-10">
            你可能正在经历这些
          </p>
          <div className="divide-y divide-border">
            {PROBLEMS.map((p, i) => (
              <div
                key={p.num}
                className="flex items-center gap-8 py-6 group"
                style={{
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <span className="text-xs font-medium text-text-muted w-6 shrink-0">
                  {p.num}
                </span>
                <p className="text-[22px] font-medium text-text-primary leading-snug group-hover:text-primary transition-colors duration-200">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Different ────────────────────────────────────────────────── */}
      <section id="design" className="bg-white px-8 py-24">
        <div
          ref={compare.ref}
          className={`max-w-[1040px] mx-auto transition-all duration-700 ease-out ${
            compare.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <p className="text-xs font-semibold text-text-muted uppercase tracking-[0.15em] mb-6">
            为什么不用飞书多维表格
          </p>
          <h2 className="text-[32px] font-semibold text-text-primary leading-tight mb-4">
            通用工具的通用性，<br />
            就是它的无能。
          </h2>
          <p className="text-sm text-text-secondary leading-[1.8] mb-12 max-w-[520px]">
            你当然可以用飞书搭建求职管理——很多人都这么做。
            但你需要花 2 小时搭建字段，在连续被拒的夜晚
            对着一张冷冰冰的表格发呆。
          </p>

          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-background">
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-text-muted uppercase tracking-wide w-[160px]">
                    维度
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-text-muted uppercase tracking-wide">
                    通用工具
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-primary uppercase tracking-wide">
                    JobTrack
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 1 ? "bg-background/60" : ""}>
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">{row.bad}</td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">{row.good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="bg-background px-8 py-24">
        <div
          ref={features.ref}
          className={`max-w-[1040px] mx-auto transition-all duration-700 ease-out ${
            features.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <p className="text-xs font-semibold text-text-muted uppercase tracking-[0.15em] mb-12">
            核心功能
          </p>
          <div className="grid grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.num}
                className="bg-white rounded-xl border border-border p-6 hover:shadow transition-shadow duration-200 group"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {f.tag}
                  </span>
                  <span className="text-2xl font-semibold text-border group-hover:text-primary/20 transition-colors duration-200">
                    {f.num}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-5">
                  {f.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {f.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-xs text-text-secondary bg-background border border-border px-2.5 py-1 rounded-full"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-white px-8 py-24">
        <div
          ref={cta.ref}
          className={`max-w-[1040px] mx-auto transition-all duration-700 ease-out ${
            cta.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-[36px] font-semibold text-text-primary leading-[1.2] mb-4">
            这不只是数据，<br />
            是你人生第一次真正的战斗。
          </h2>
          <p className="text-base text-text-secondary mb-10">
            值得有一个东西，陪你一起打完。
          </p>
          <Link
            href="/board"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            开始使用
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-background border-t border-border px-8 py-8">
        <div className="max-w-[1040px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L18 10L10 18L2 10L10 2Z" fill="#5E6AD2" fillOpacity="0.2" />
              <path d="M10 6L14 10L10 14L6 10L10 6Z" fill="#5E6AD2" />
            </svg>
            <span className="text-sm font-semibold text-text-secondary">JobTrack</span>
          </div>
          <p className="text-xs text-text-muted">陪用户走完求职季的伙伴</p>
        </div>
      </footer>

    </div>
  );
}
