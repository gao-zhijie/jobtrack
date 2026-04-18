import { v4 as uuidv4 } from "uuid";
import type { Application, InterviewLog } from "./types";

// =============================================================================
// Mock Data - 求职申请管理看板示例数据
// 以"今天"为基准，动态计算日期
// =============================================================================

const today = new Date();
today.setHours(0, 0, 0, 0);

const daysAgo = (days: number): Date => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return d;
};

const daysFromNow = (days: number): Date => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d;
};

// =============================================================================
// Interview Logs（面试复盘）
// =============================================================================

const interviewLog_某电商初面: InterviewLog = {
  id: uuidv4(),
  stage: "初面",
  date: daysAgo(7),
  questions: [
    "自我介绍 2 分钟",
    "介绍一下你负责过最完整的一个项目",
    "那个项目的数据结果如何？你怎么验证效果？",
    "如果给你更多资源，你会怎么迭代这个功能？",
  ],
  performance: "good",
  reflection:
    "项目逻辑讲得还算清晰，但数据部分被追问时有点心虚——当时取数口径没记清楚，下次要带上具体数字。",
  interviewerStyle: "亲和型，会顺着你的话深挖",
};

const interviewLog_某电商复盘: InterviewLog = {
  id: uuidv4(),
  stage: "复盘总结",
  date: daysAgo(6),
  questions: [],
  performance: "good",
  reflection:
    "这家流程算快的，一周内就推进到二面。学长说二面是部门 leader，会侧重业务判断力。",
};

const interviewLog_某金融初面: InterviewLog = {
  id: uuidv4(),
  stage: "一面",
  date: daysAgo(12),
  questions: [
    "你认为 B 端产品和 C 端产品的核心差异是什么？",
    "做过用户画像吗？标签体系怎么设计的？",
    "一个 toB 控制台，如何提升用户完成任务的效率？",
  ],
  performance: "ok",
  reflection:
    "B 端问题答得一般，缺少实战经验。面试官提到他们很看重「行业认知」，需要提前准备一些金融行业的趋势洞察。",
  interviewerStyle: "压力型，追问比较狠",
};

const interviewLog_某金融二面: InterviewLog = {
  id: uuidv4(),
  stage: "二面",
  date: daysAgo(3),
  questions: [
    "你最大的缺点是什么？",
    "为什么从上一段实习离职？",
    "如果我们给你 offer，你来的概率有多大？",
  ],
  performance: "great",
  reflection:
    "HR面反而最轻松，如实回答就好。这轮感觉在验证稳定性，动摇过被追问，诚实说还在对比其他机会，面试官没反感。",
  interviewerStyle: "结构化，公平",
};

const interviewLog_教育科技笔试后: InterviewLog = {
  id: uuidv4(),
  stage: "笔试",
  date: daysAgo(2),
  questions: ["逻辑推理测试", "产品设计题：设计一个背单词的方案"],
  performance: "good",
  reflection: "笔试不难，产品设计题用了之前做过的用户调研数据，感觉言之有物。等待通知中。",
};

const interviewLog_社区产品初面: InterviewLog = {
  id: uuidv4(),
  stage: "初面",
  date: daysAgo(18),
  questions: [
    "你是怎么从0到1做用户增长的？",
    "讲一个你失败的项目案例",
    "DAU 掉 20% 你会怎么排查？",
  ],
  performance: "bad",
  reflection:
    "复盘来看，失败案例没讲好——说了很多客观原因，面试官直接打断说「我更想知道你主观上哪里可以改进」。教训：少说环境，多说个人判断。",
  interviewerStyle: "深挖型，聚焦个人成长",
};

const interviewLog_社区产品复盘: InterviewLog = {
  id: uuidv4(),
  stage: "复盘",
  date: daysAgo(17),
  questions: [],
  performance: "bad",
  reflection: "凉了。这轮让我意识到自己复盘能力确实弱，之后每周强制自己写一条'今天做得不够好的事'。",
};

// =============================================================================
// Applications（求职申请）
// =============================================================================

export const MOCK_APPLICATIONS: Application[] = [
  // ---------------------------------------------------------------------------
  // 1. 正常推进中 - 二面，明天截止
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "某头部电商",
    position: "产品经理-交易方向",
    platform: "referral",
    appliedAt: daysAgo(14),
    stage: "interview2",
    nextDeadline: daysFromNow(1),
    nextAction: "二面：准备交易链路 case",
    resumeVersion: "V2.3-电商方向",
    notes: "学长内推，HR 说业务线缺人，节奏很快。一面是直属 leader，据说比较年轻好沟通。",
    interviewLogs: [interviewLog_某电商初面, interviewLog_某电商复盘],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(6),
  },

  // ---------------------------------------------------------------------------
  // 2. 正常推进中 - 终面，已触达
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "某金融科技",
    position: "产品经理-数据平台",
    platform: "official",
    appliedAt: daysAgo(21),
    stage: "final",
    nextDeadline: daysAgo(1),
    nextAction: "终面：集团 CTO + HR 交叉面",
    resumeVersion: "V2.2-数据产品",
    notes: "官网投递，流程比较慢，等了三周才推进。base 在上海张江，JD 写的弹性工作制，实际问了加班情况，说项目急的时候周末也要支援。",
    interviewLogs: [interviewLog_某金融初面, interviewLog_某金融二面],
    createdAt: daysAgo(21),
    updatedAt: daysAgo(3),
  },

  // ---------------------------------------------------------------------------
  // 3. 正常推进中 - 笔试刚完成
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "某教育科技",
    position: "产品运营-学习体验",
    platform: "boss",
    appliedAt: daysAgo(5),
    stage: "written",
    nextDeadline: daysFromNow(3),
    nextAction: "等待笔试结果，预计周内出",
    resumeVersion: "V2.1-通用版",
    notes: "在 BOSS 上打招呼秒回，HR 很热情。试用期 6 个月，全额五险一金，公积金按全额 12% 交。",
    interviewLogs: [interviewLog_教育科技笔试后],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
  },

  // ---------------------------------------------------------------------------
  // 4. 刚投递 1 天 - 新鲜申请
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "某社区社交",
    position: "用户研究-创作者生态",
    platform: "niuke",
    appliedAt: daysAgo(1),
    stage: "applied",
    notes:
      "牛客上看到 JD，用户研究岗，方向是创作者生态。之前做过主播相关的调研，对这个领域有点兴趣。投递后还没收到回复，一般要等 3-5 个工作日。",
    interviewLogs: [],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },

  // ---------------------------------------------------------------------------
  // 5. 刚投递 2 天 - 新鲜申请
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "某跨境电商",
    position: "产品经理-商家后台",
    platform: "official",
    appliedAt: daysAgo(2),
    stage: "applied",
    notes:
      "在脉脉上看到这个岗位的信息，说团队正在扩张。官网写的薪资范围比较大（25-45K），可能是预算上限高，实际谈薪资再确认。",
    interviewLogs: [],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },

  // ---------------------------------------------------------------------------
  // 6. 面试冲突 - 同日两场
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "某智能硬件",
    position: "产品经理- IoT 平台",
    platform: "referral",
    appliedAt: daysAgo(10),
    stage: "interview1",
    nextDeadline: daysFromNow(2),
    nextAction: "下午 2 点：业务初面（视频）",
    resumeVersion: "V2.2-硬件方向",
    notes:
      "内推的学长在部门做算法，说 IoT 产品是他们今年重点方向。另一家某金融科技也在同一天下午 4 点，撞车了，可能要跟 HR 协调时间。",
    interviewLogs: [],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
  },
  {
    id: uuidv4(),
    company: "某新能源汽车",
    position: "产品运营-充电网络",
    platform: "boss",
    appliedAt: daysAgo(8),
    stage: "interview1",
    nextDeadline: daysFromNow(2),
    nextAction: "下午 4 点：HR 视频初面",
    resumeVersion: "V2.1-通用版",
    notes:
      "这家的 HR 沟通很专业，主动发了岗位说明书和团队介绍。充电网络是新能源赛道的核心基建之一，对这个方向看好。下午 2 点还有智能硬件的面试，时间太紧了，已跟 HR 说明情况。",
    interviewLogs: [],
    createdAt: daysAgo(8),
    updatedAt: daysAgo(8),
  },

  // ---------------------------------------------------------------------------
  // 7. 14 天无回复 - 僵尸项（触发归档提示）
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "某内容平台",
    position: "产品经理-会员增长",
    platform: "other",
    appliedAt: daysAgo(30),
    stage: "applied",
    notes:
      "在某应届生群里看到的内推信息，说是急着要人。投了之后石沉大海，连简历筛选都没过也正常。这个岗位后来在官网也下架了，估计是招到人了。",
    interviewLogs: [],
    createdAt: daysAgo(30),
    updatedAt: daysAgo(14),
  },

  // ---------------------------------------------------------------------------
  // 8. 已拿 Offer
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "某企业服务",
    position: "产品经理-SaaS 产品",
    platform: "referral",
    appliedAt: daysAgo(35),
    stage: "offer",
    nextDeadline: daysFromNow(5),
    nextAction: "offer 确认DDL：下周三前回复",
    resumeVersion: "V2.0-最终版",
    notes:
      "三面全部通过，已发 offer。薪资在预期范围内，试用期 6 个月薪资不打折。纠结点：base 北京但不确定后续是否会转调上海。还在对比另一家的流程。",
    interviewLogs: [],
    createdAt: daysAgo(35),
    updatedAt: daysAgo(1),
  },

  // ---------------------------------------------------------------------------
  // 9. 已挂但有复盘记录
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "某社区产品",
    position: "产品经理-用户增长",
    platform: "niuke",
    appliedAt: daysAgo(25),
    stage: "rejected",
    nextAction: "已结束，等待归档",
    resumeVersion: "V2.1-通用版",
    notes:
      "挂在初面。复盘发现失败案例没讲好，被面试官质疑「只会归因外部」。但用户增长这方向确实有兴趣，后续准备一个更完整的案例重讲。",
    interviewLogs: [interviewLog_社区产品初面, interviewLog_社区产品复盘],
    createdAt: daysAgo(25),
    updatedAt: daysAgo(17),
  },

  // ---------------------------------------------------------------------------
  // 10. 今日截止 - 紧急项
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "某健康科技",
    position: "产品运营-慢病管理",
    platform: "official",
    appliedAt: daysAgo(6),
    stage: "interview1",
    nextDeadline: today, // 今天截止
    nextAction: "晚上 8 点前：完成笔试题并提交",
    resumeVersion: "V2.1-通用版",
    notes:
      "这家的笔试题是做一个健康类产品的竞品分析，4 道问答题，预计 2-3 小时。HR 说今天截止是因为本周五要出面试名单，时间确实紧。",
    interviewLogs: [],
    createdAt: daysAgo(6),
    updatedAt: daysAgo(1),
  },
];

// =============================================================================
// Init Mock Data - 初始化示例数据
// =============================================================================

const STORAGE_KEY = "jobtrack-storage";

export function initMockData(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // localStorage 为空，注入示例数据
      const initialState = {
        state: {
          applications: MOCK_APPLICATIONS,
        },
        version: 0,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
      console.log("[JobTrack] 示例数据已注入");
    }
  } catch (e) {
    console.error("[JobTrack] 初始化示例数据失败", e);
  }
}

// =============================================================================
// Helper Functions - 供 UI 层使用
// =============================================================================

/** 生成空申请模板 */
export function createEmptyApplication(): Omit<Application, "id" | "createdAt" | "updatedAt"> {
  return {
    company: "",
    position: "",
    platform: "other",
    appliedAt: new Date(),
    stage: "applied",
    interviewLogs: [],
  };
}

/** 格式化面试日期 */
export function formatInterviewDate(date: Date): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

/** 判断是否是今天 */
export function isToday(date: Date): boolean {
  const d = new Date(date);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}
