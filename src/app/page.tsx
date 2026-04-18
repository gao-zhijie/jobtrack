import Link from "next/link";
import { Inbox, Calendar, Cloud, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-[900px] mx-auto">
          <h1 className="text-[48px] font-semibold text-text-primary leading-[1.2] tracking-tight mb-6">
            不是一个更好的求职表格。
          </h1>
          <p className="text-[20px] text-text-secondary leading-relaxed mb-12">
            是陪你走完求职季的伙伴。
          </p>
          <div className="flex gap-4">
            <Link
              href="/board"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              进入看板
              <ArrowRight size={16} />
            </Link>
            <a
              href="#design"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-text-secondary bg-white border border-border rounded-lg hover:border-text-muted transition-colors"
            >
              了解设计思考
            </a>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="bg-background px-6 py-24">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-[28px] font-semibold text-text-primary mb-12">
            你可能正在经历这些
          </h2>
          <div className="grid grid-cols-3 gap-12">
            <div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Inbox size={20} className="text-primary" />
              </div>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                投了40家，忘了投到哪一家
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calendar size={20} className="text-primary" />
              </div>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                两个面试撞一起，手忙脚乱
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Cloud size={20} className="text-primary" />
              </div>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                连续被拒5家，开始怀疑自己
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Not Excel/Flyboard Section */}
      <section id="design" className="bg-white px-6 py-24">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-[28px] font-semibold text-text-primary mb-6">
            你可以用飞书多维表格管理求职——很多人都这么做。
          </h2>
          <p className="text-[15px] text-text-secondary leading-[1.8] mb-12">
            但你需要花2小时搭建字段，自己定义状态流转，
            <br />
            每周手动整理数据，在连续被拒的夜晚对着一张冷冰冰的表格发呆。
          </p>

          {/* Comparison Table */}
          <div className="border border-border rounded-lg overflow-hidden mb-12">
            <table className="w-full">
              <thead>
                <tr className="bg-background">
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">
                    维度
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">
                    通用工具
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wide">
                    JobTrack
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-6 py-4 text-sm text-text-primary">用户付出</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">2小时搭建</td>
                  <td className="px-6 py-4 text-sm text-primary font-medium">30秒上手</td>
                </tr>
                <tr className="bg-background/50">
                  <td className="px-6 py-4 text-sm text-text-primary">场景认知</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">无</td>
                  <td className="px-6 py-4 text-sm text-primary font-medium">预设求职全流程</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-text-primary">主动性</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">被动记录</td>
                  <td className="px-6 py-4 text-sm text-primary font-medium">主动提醒、归档、复盘</td>
                </tr>
                <tr className="bg-background/50">
                  <td className="px-6 py-4 text-sm text-text-primary">情绪设计</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">无</td>
                  <td className="px-6 py-4 text-sm text-primary font-medium">周报、里程碑、拒信缓冲</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[15px] text-text-secondary leading-[1.8]">
            在功能覆盖上我不会赢过飞书。
            <br />
            但在&quot;大学生求职季&quot;这个垂直场景里，通用工具的通用性，就是它的无能。
          </p>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="bg-background px-6 py-24">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-[28px] font-semibold text-text-primary mb-12">
            核心功能
          </h2>
          <div className="space-y-16">
            {/* Feature 1: Kanban */}
            <div className="flex items-start gap-8">
              <div className="flex-1">
                <div className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                  看板
                </div>
                <h3 className="text-[20px] font-semibold text-text-primary mb-3">
                  一眼看全局
                </h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  从投递到达成Offer，6个阶段覆盖求职全流程。
                  每个卡片都是一家公司的完整档案，不用再在聊天记录里翻找。
                </p>
              </div>
              <div className="flex-shrink-0 w-[400px] h-[200px] bg-white border border-border rounded-lg flex items-center justify-center text-text-muted text-sm">
                [看板界面截图]
              </div>
            </div>

            {/* Feature 2: Calendar */}
            <div className="flex items-start gap-8">
              <div className="flex-1">
                <div className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                  日历
                </div>
                <h3 className="text-[20px] font-semibold text-text-primary mb-3">
                  时间从不打架
                </h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  自动检测面试日期冲突，同一天两场面试？提前告诉你。
                  每个截止日期都是倒计时，每场面试都提前提醒。
                </p>
              </div>
              <div className="flex-shrink-0 w-[400px] h-[200px] bg-white border border-border rounded-lg flex items-center justify-center text-text-muted text-sm">
                [日历界面截图]
              </div>
            </div>

            {/* Feature 3: Weekly Report */}
            <div className="flex items-start gap-8">
              <div className="flex-1">
                <div className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                  周报
                </div>
                <h3 className="text-[20px] font-semibold text-text-primary mb-3">
                  每周给你一次回顾
                </h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  不是冷冰冰的数字，是有温度的总结。
                  这一周你投递了几家，完成了多少场面试，和上周比是多了还是少了。
                  还有那句你可能需要的话。
                </p>
              </div>
              <div className="flex-shrink-0 w-[400px] h-[200px] bg-white border border-border rounded-lg flex items-center justify-center text-text-muted text-sm">
                [周报界面截图]
              </div>
            </div>

            {/* Feature 4: Interview Reflection */}
            <div className="flex items-start gap-8">
              <div className="flex-1">
                <div className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                  面试复盘
                </div>
                <h3 className="text-[20px] font-semibold text-text-primary mb-3">
                  每次面试都让你更强
                </h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  拖拽卡片到新阶段时，自动弹出复盘表单。
                  被问到了什么问题？发挥如何？有什么反思？
                  2分钟写完，以后你会感谢自己。
                </p>
              </div>
              <div className="flex-shrink-0 w-[400px] h-[200px] bg-white border border-border rounded-lg flex items-center justify-center text-text-muted text-sm">
                [复盘界面截图]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-[900px] mx-auto text-left">
          <p className="text-[20px] text-text-primary leading-relaxed mb-3">
            这不只是数据，是你人生第一次真正的战斗。
          </p>
          <p className="text-[20px] text-text-primary leading-relaxed mb-12">
            值得有一个东西，陪你一起打完。
          </p>
          <Link
            href="/board"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            开始使用
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background px-6 py-8 border-t border-border">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2L18 10L10 18L2 10L10 2Z"
                fill="#5E6AD2"
                fillOpacity="0.2"
              />
              <path
                d="M10 6L14 10L10 14L6 10L10 6Z"
                fill="#5E6AD2"
              />
            </svg>
            <span className="text-sm text-text-secondary">JobTrack</span>
          </div>
          <p className="text-xs text-text-muted">
            陪用户走完求职季的伙伴
          </p>
        </div>
      </footer>
    </div>
  );
}
