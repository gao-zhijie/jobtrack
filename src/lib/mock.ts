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

const interviewLog_京东初面: InterviewLog = {
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

const interviewLog_京东HR面: InterviewLog = {
  id: uuidv4(),
  stage: "HR面",
  date: daysAgo(5),
  questions: [],
  performance: "good",
  reflection: "京东流程算快的，一周内就推进到二面。学长说二面是部门 leader，会侧重业务判断力。",
};

const interviewLog_蚂蚁二面: InterviewLog = {
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

const interviewLog_蚂蚁一面: InterviewLog = {
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

const interviewLog_好未来笔试后: InterviewLog = {
  id: uuidv4(),
  stage: "笔试",
  date: daysAgo(2),
  questions: ["逻辑推理测试", "产品设计题：设计一个背单词的方案"],
  performance: "good",
  reflection: "笔试不难，产品设计题用了之前做过的用户调研数据，感觉言之有物。等待通知中。",
};

const interviewLog_小红书初面: InterviewLog = {
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

const interviewLog_小红书复盘: InterviewLog = {
  id: uuidv4(),
  stage: "复盘",
  date: daysAgo(17),
  questions: [],
  performance: "bad",
  reflection: "凉了。这轮让我意识到自己复盘能力确实弱，之后每周强制自己写一条'今天做得不够好的事'。",
};

const interviewLog_美团二面: InterviewLog = {
  id: uuidv4(),
  stage: "二面",
  date: daysAgo(4),
  questions: [
    "你觉得自己做产品经理最大的优势是什么？",
    "举例说明你怎么处理跨部门协作的冲突",
    "如果leader和你对方案意见不一致，你会怎么做？",
  ],
  performance: "good",
  reflection:
    "这轮面试官是部门总监，问得很宏观，主要看思维框架和价值观。答得还算稳，但最后反问环节问得太泛，没抓住机会展示深度思考。",
  interviewerStyle: "宏观视野型，关注潜力",
};

const interviewLog_字节一面: InterviewLog = {
  id: uuidv4(),
  stage: "一面",
  date: daysAgo(9),
  questions: [
    "介绍一个你主导过的项目，从目标到结果全流程",
    "你在这个项目中遇到最大的困难是什么？怎么解决的？",
    "数据涨跌，你怎么定位原因？",
  ],
  performance: "great",
  reflection:
    "字节效率是真的高，当天就出结果了。面试官很务实，不玩虚的，问的都是实打实的结果。感觉自己答得比较顺，数据部分准备得很充分。",
  interviewerStyle: "务实型，重数据结果",
};

const interviewLog_腾讯一面: InterviewLog = {
  id: uuidv4(),
  stage: "一面",
  date: daysAgo(15),
  questions: [
    "自我介绍",
    "为什么想投 ToC 产品经理？",
    "平时用哪些 App？哪个体验最好好在哪儿？",
    "微信最近更新了这些功能，你怎么看？",
  ],
  performance: "ok",
  reflection:
    "微信功能分析没答到点上，只说了产品层面，没深入到社交关系链和平台逻辑。面试官引导了两句，我还是没反应过来。凉了不冤。",
  interviewerStyle: "引导型，喜欢追问",
};

const interviewLog_PayPal终面: InterviewLog = {
  id: uuidv4(),
  stage: "终面",
  date: daysAgo(1),
  questions: [
    "为什么想做支付/金融产品？",
    "讲一个你解决过的复杂问题",
    "你未来的职业规划是什么？",
    "如果给你一个全新市场，你怎么快速上手？",
  ],
  performance: "good",
  reflection:
    "终面是 head，总监人很温和，没有压力面。问到职业规划时我说想深耕金融方向，感觉答得比较真诚。整体感觉不错，等结果中。",
  interviewerStyle: "温和型，重视潜力与文化匹配",
};

// =============================================================================
// Applications（求职申请）
// =============================================================================

export const MOCK_APPLICATIONS: Application[] = [
  // ---------------------------------------------------------------------------
  // 1. 京东 - 二面，明天截止
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "京东",
    position: "产品经理-交易平台",
    platform: "referral",
    appliedAt: daysAgo(14),
    stage: "interview2",
    sortOrder: 0,
    nextDeadline: daysFromNow(1),
    nextAction: "二面：准备交易链路 case",
    resumeVersion: "V2.3-电商方向",
    notes:
      "学长内推，HR 说业务线缺人，节奏很快。一面是直属 leader，据说比较年轻好沟通。问了加班情况，说忙季双休可能要支援，但整体可接受。",
    interviewLogs: [interviewLog_京东初面, interviewLog_京东HR面],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(5),
  },

  // ---------------------------------------------------------------------------
  // 2. 蚂蚁集团 - 终面，已触达
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "蚂蚁集团",
    position: "产品经理-支付中台",
    platform: "official",
    appliedAt: daysAgo(21),
    stage: "final",
    sortOrder: 1,
    nextDeadline: daysAgo(1),
    nextAction: "终面：集团 CTO + HR 交叉面",
    resumeVersion: "V2.2-数据产品",
    notes:
      "官网投递，流程比较慢，等了三周才推进。base 在上海杭州，JD 写的弹性工作制，实际问了加班情况，说项目急的时候周末也要支援。",
    interviewLogs: [interviewLog_蚂蚁一面, interviewLog_蚂蚁二面],
    createdAt: daysAgo(21),
    updatedAt: daysAgo(3),
  },

  // ---------------------------------------------------------------------------
  // 3. 好未来 - 笔试刚完成
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "好未来",
    position: "产品经理-学习服务",
    platform: "boss",
    appliedAt: daysAgo(5),
    stage: "written",
    sortOrder: 2,
    nextDeadline: daysFromNow(3),
    nextAction: "等待笔试结果，预计周内出",
    resumeVersion: "V2.1-通用版",
    notes:
      "在 BOSS 上打招呼秒回，HR 很热情。试用期 6 个月，全额五险一金，公积金按全额 12% 交。业务做的是学而思学习机相关的功能，对这个方向有兴趣。",
    interviewLogs: [interviewLog_好未来笔试后],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
  },

  // ---------------------------------------------------------------------------
  // 4. 小红书 - 刚投递
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "小红书",
    position: "产品经理-社区增长",
    platform: "niuke",
    appliedAt: daysAgo(1),
    stage: "applied",
    sortOrder: 3,
    notes:
      "牛客上看到 JD，社区增长方向。之前做过主播相关的调研，对这个领域有点兴趣。投递后还没收到回复，一般要等 3-5 个工作日。听说小红书加班比较狠，但成长也快。",
    interviewLogs: [],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },

  // ---------------------------------------------------------------------------
  // 5. Shopee - 刚投递
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "Shopee",
    position: "产品经理-商家后台",
    platform: "official",
    appliedAt: daysAgo(2),
    stage: "applied",
    sortOrder: 4,
    notes:
      "在脉脉上看到这个岗位的信息，说团队正在扩张。深圳 base，跨境电商方向。官网写的薪资范围比较大（25-45K），可能是预算上限高，实际谈薪资再确认。",
    interviewLogs: [],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },

  // ---------------------------------------------------------------------------
  // 6. 美团 - 二面进行中
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "美团",
    position: "产品经理-到店业务",
    platform: "referral",
    appliedAt: daysAgo(18),
    stage: "interview2",
    sortOrder: 5,
    nextDeadline: daysFromNow(3),
    nextAction: "准备美团二面",
    resumeVersion: "V2.2-本地生活",
    notes:
      "导师推荐，说美团到店团队最近在扩招。一面是组内的资深 PM，问了很多业务判断题，还好之前实习有过类似经验。一面完感觉还行，等二面通知。",
    interviewLogs: [interviewLog_美团二面],
    createdAt: daysAgo(18),
    updatedAt: daysAgo(4),
  },

  // ---------------------------------------------------------------------------
  // 7. 字节跳动 - 一面刚通过
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "字节跳动",
    position: "产品经理-电商广告",
    platform: "boss",
    appliedAt: daysAgo(12),
    stage: "interview2",
    sortOrder: 6,
    nextDeadline: daysFromNow(5),
    nextAction: "等待二面通知",
    resumeVersion: "V2.3-广告方向",
    notes:
      "BOSS 上主动联系的，HR 说是急招。一面是视频面，30分钟，问得比较细。面试官很年轻，看着比我大不了几岁，但问的问题很犀利。等周三出结果。",
    interviewLogs: [interviewLog_字节一面],
    createdAt: daysAgo(12),
    updatedAt: daysAgo(9),
  },

  // ---------------------------------------------------------------------------
  // 8. 大疆 - 今日面试
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "大疆",
    position: "产品经理-无人机平台",
    platform: "referral",
    appliedAt: daysAgo(10),
    stage: "interview1",
    sortOrder: 7,
    nextDeadline: today,
    nextAction: "下午 2 点：业务初面（视频）",
    resumeVersion: "V2.2-硬件方向",
    notes:
      "内推的学长在部门做算法，说无人机产品是他们今年重点方向。对大疆产品很熟悉，家里用的是 Mini 3 Pro。另一家比亚迪也在同一天下午 4 点，撞车了，可能要跟 HR 协调时间。",
    interviewLogs: [],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(10),
  },

  // ---------------------------------------------------------------------------
  // 9. 比亚迪 - 同日下午面试
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "比亚迪",
    position: "产品经理-智能座舱",
    platform: "boss",
    appliedAt: daysAgo(8),
    stage: "interview1",
    sortOrder: 8,
    nextDeadline: today,
    nextAction: "下午 4 点：HR 视频初面",
    resumeVersion: "V2.1-通用版",
    notes:
      "这家的 HR 沟通很专业，主动发了岗位说明书和团队介绍。智能座舱是新能源赛道的核心方向，对这个领域看好。下午 2 点还有大疆的面试，时间太紧了，已跟 HR 说明情况，对方说可以调整。",
    interviewLogs: [],
    createdAt: daysAgo(8),
    updatedAt: daysAgo(8),
  },

  // ---------------------------------------------------------------------------
  // 10. 腾讯 - 一面待定
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "腾讯",
    position: "产品经理-微信支付",
    platform: "official",
    appliedAt: daysAgo(20),
    stage: "interview1",
    sortOrder: 9,
    nextDeadline: daysFromNow(7),
    nextAction: "等待面试通知",
    resumeVersion: "V2.3-微信方向",
    notes:
      "官网投递的，流程比较慢，等了两周才约到面试。微信支付是核心业务，竞争很激烈。HR 提前发了笔试题，是一份产品分析报告，要求 3 天内提交。",
    interviewLogs: [interviewLog_腾讯一面],
    createdAt: daysAgo(20),
    updatedAt: daysAgo(15),
  },

  // ---------------------------------------------------------------------------
  // 11. 知乎 - 14天无回复
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "知乎",
    position: "产品经理-会员增长",
    platform: "other",
    appliedAt: daysAgo(30),
    stage: "applied",
    sortOrder: 10,
    notes:
      "在某应届生群里看到的内推信息，说是急着要人。投了之后石沉大海，连简历筛选都没过也正常。这个岗位后来在官网也下架了，估计是招到人了。",
    interviewLogs: [],
    createdAt: daysAgo(30),
    updatedAt: daysAgo(14),
  },

  // ---------------------------------------------------------------------------
  // 12. 飞书 - 已拿 Offer
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "飞书",
    position: "产品经理-协作平台",
    platform: "referral",
    appliedAt: daysAgo(35),
    stage: "offer",
    sortOrder: 11,
    nextDeadline: daysFromNow(5),
    nextAction: "offer 确认DDL：下周三前回复",
    resumeVersion: "V2.0-最终版",
    notes:
      "三面全部通过，已发 offer。薪资在预期范围内，试用期 6 个月薪资不打折。纠结点：base 北京但不确定后续是否会转调上海。还在对比另一家的流程。飞书文化确实很吸引我，文档驱动、坦诚清晰。",
    interviewLogs: [],
    createdAt: daysAgo(35),
    updatedAt: daysAgo(1),
  },

  // ---------------------------------------------------------------------------
  // 13. 即刻 - 已挂
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "即刻",
    position: "产品经理-用户增长",
    platform: "niuke",
    appliedAt: daysAgo(25),
    stage: "rejected",
    sortOrder: 12,
    nextAction: "已结束，等待归档",
    resumeVersion: "V2.1-通用版",
    notes:
      "挂在初面。复盘发现失败案例没讲好，被面试官质疑「只会归因外部」。但用户增长这方向确实有兴趣，后续准备一个更完整的案例重讲。即刻的产品氛围很喜欢，但确实不好进。",
    interviewLogs: [interviewLog_小红书初面, interviewLog_小红书复盘],
    createdAt: daysAgo(25),
    updatedAt: daysAgo(17),
  },

  // ---------------------------------------------------------------------------
  // 14. 微医 - 今日截止
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "微医",
    position: "产品经理-健康服务",
    platform: "official",
    appliedAt: daysAgo(6),
    stage: "interview1",
    sortOrder: 13,
    nextDeadline: today,
    nextAction: "晚上 8 点前：完成笔试题并提交",
    resumeVersion: "V2.1-通用版",
    notes:
      "这家的笔试题是做一个健康类产品的竞品分析，4 道问答题，预计 2-3 小时。HR 说今天截止是因为本周五要出面试名单，时间确实紧。医疗赛道最近政策利好，感觉是个机会。",
    interviewLogs: [],
    createdAt: daysAgo(6),
    updatedAt: daysAgo(1),
  },

  // ---------------------------------------------------------------------------
  // 15. PayPal - 终面
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "PayPal",
    position: "产品经理-跨境支付",
    platform: "official",
    appliedAt: daysAgo(28),
    stage: "final",
    sortOrder: 14,
    nextDeadline: daysFromNow(2),
    nextAction: "终面：Head of Product",
    resumeVersion: "V2.3-金融方向",
    notes:
      "外企流程慢但规范，每轮都有明确反馈。一面是 hire manager，二面是 director，这轮是 head。英语要求不高，主要还是中文面试。base 深圳，出海业务组。",
    interviewLogs: [interviewLog_PayPal终面],
    createdAt: daysAgo(28),
    updatedAt: daysAgo(1),
  },

  // ---------------------------------------------------------------------------
  // 16. 菜鸟网络 - 已投递
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "菜鸟网络",
    position: "产品经理-物流科技",
    platform: "boss",
    appliedAt: daysAgo(3),
    stage: "applied",
    sortOrder: 15,
    notes:
      "BOSS 上看到急招，说是新组建的团队。物流科技方向最近发展不错，跟京东物流有合作。薪资开得一般，但听说福利还行。还没收到回复，继续等。",
    interviewLogs: [],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },

  // ---------------------------------------------------------------------------
  // 17. 米哈游 - 笔试中
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "米哈游",
    position: "产品经理-游戏平台",
    platform: "official",
    appliedAt: daysAgo(7),
    stage: "written",
    sortOrder: 16,
    nextDeadline: daysFromNow(7),
    nextAction: "完成笔试：游戏产品设计题",
    resumeVersion: "V2.2-游戏方向",
    notes:
      "内推免笔试，但没找到内推渠道就官网投了。笔试是游戏产品方案设计，3 道题任选 2 道。游戏行业了解不多，但很感兴趣。估计要等比较久，米哈游出了名的慢。",
    interviewLogs: [],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
  },

  // ---------------------------------------------------------------------------
  // 18. 网易云音乐 - 面试中
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "网易云音乐",
    position: "产品经理-会员运营",
    platform: "referral",
    appliedAt: daysAgo(15),
    stage: "interview2",
    sortOrder: 17,
    nextDeadline: daysFromNow(4),
    nextAction: "等待二面安排",
    resumeVersion: "V2.1-通用版",
    notes:
      "学姐内推，网易云音乐会员组。一面是群面，形式是无领导小组讨论，题目是设计一个音乐社交功能。群面我担任了计时者角色，总结得也算清晰。等二面通知中。",
    interviewLogs: [],
    createdAt: daysAgo(15),
    updatedAt: daysAgo(8),
  },

  // ---------------------------------------------------------------------------
  // 19. 快手 - 刚投递
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "快手",
    position: "产品经理-电商直播",
    platform: "niuke",
    appliedAt: daysAgo(1),
    stage: "applied",
    sortOrder: 18,
    notes:
      "牛客上看到的 JD，电商直播方向，最近GMV涨得不错。快手这边据说出差不较多，要跑商家和供应链。薪资不错，但担心能不能适应快手的文化。",
    interviewLogs: [],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },

  // ---------------------------------------------------------------------------
  // 20. 满帮集团 - 已拒绝
  // ---------------------------------------------------------------------------
  {
    id: uuidv4(),
    company: "满帮集团",
    position: "产品经理-干线物流",
    platform: "boss",
    appliedAt: daysAgo(40),
    stage: "rejected",
    sortOrder: 19,
    nextAction: "已结束，主动拒绝",
    resumeVersion: "V2.0-初版",
    notes:
      "二面挂的。物流行业确实不太感兴趣，面试的时候表现出了犹豫，面试官看得出来。挂了也不意外，但有点可惜浪费了一次机会。以后不感兴趣的岗位还是不要投递了。",
    interviewLogs: [],
    createdAt: daysAgo(40),
    updatedAt: daysAgo(20),
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
    sortOrder: Date.now(),
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
