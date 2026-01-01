import { Scenario } from './types';

export const scenarios: Scenario[] = [
  // ==========================================================
  // TARGET: FEMALE USERS (Messages from Men)
  // ==========================================================
  // --- RED FLAGS (Undeniable) ---
  {
    id: 1,
    message: "我昨晚没回消息是因为睡着了，手机也没电了，而且我不想让你担心。",
    difficulty: 2,
    red_flag_score: 95,
    roast_analysis: "典型‘煤气灯效应’（Gaslighting）。三个理由叠加=他在撒谎。‘不想让你担心’是渣男惯用的免责金牌。",
    tags: ["Gaslighting", "撒谎精"],
    is_safe: false,
    target_user_gender: 'female'
  },
  {
    id: 2,
    message: "她只是我干妹妹，我们从小一起长大的，你别多想行不行？",
    difficulty: 1,
    red_flag_score: 90,
    roast_analysis: "‘干妹妹’？‘你别多想’？这翻译过来就是：‘虽然我在搞暧昧，但你不能闹，闹就是你不懂事’。",
    tags: ["海王语录", "边界感缺失"],
    is_safe: false,
    target_user_gender: 'female'
  },
  {
    id: 6,
    message: "最近手头有点紧，能不能先借我两千？发了工资立马还你。",
    difficulty: 1,
    red_flag_score: 99,
    roast_analysis: "刚认识不久就借钱？涉及到钱，一律按诈骗/杀猪盘处理。这种人大概率是无底洞。",
    tags: ["杀猪盘", "软饭硬吃"],
    is_safe: false,
    target_user_gender: 'female'
  },
  {
    id: 14,
    message: "我们现在这样不好吗？为什么非要那张纸/那个名分？",
    difficulty: 2,
    red_flag_score: 90,
    roast_analysis: "不想负责任的文艺说法。只想享受权利不履行义务，这叫‘短择’。",
    tags: ["不负责", "短择"],
    is_safe: false,
    target_user_gender: 'female'
  },
  {
    id: 15,
    message: "我看你朋友圈照片，感觉你衣服领口有点低，以后别穿这种了，我吃醋。",
    difficulty: 3,
    red_flag_score: 85,
    roast_analysis: "打着‘吃醋’的旗号进行‘控制’。今天管衣服，明天管社交。这是PUA的前兆。",
    tags: ["控制狂", "PUA"],
    is_safe: false,
    target_user_gender: 'female'
  },

  // --- SAFE SCENARIOS (Look suspicious but are normal) ---
  {
    id: 101,
    message: "今晚不能陪你聊天了，这周项目赶进度，得通宵加班。",
    difficulty: 2,
    red_flag_score: 20,
    roast_analysis: "这叫‘为了生活搬砖’。成年人的世界里，工作忙是常态，别把上进当冷暴力。",
    tags: ["事业心", "正常社交"],
    is_safe: true,
    target_user_gender: 'female'
  },
  {
    id: 102,
    message: "我刚才在打排位，没切出去回消息，不好意思啊。",
    difficulty: 1,
    red_flag_score: 30,
    roast_analysis: "直男的诚实。打游戏不回消息很正常，打完能主动解释并道歉，已经算及格了。",
    tags: ["直男", "诚实"],
    is_safe: true,
    target_user_gender: 'female'
  },
  {
    id: 103,
    message: "这周六我答应了陪我爸妈去体检，改天再约你？",
    difficulty: 1,
    red_flag_score: 10,
    roast_analysis: "孝顺且有计划。这是加分项，说明他家庭观念重，而且尊重与你的约定（提前告知）。",
    tags: ["孝顺", "靠谱"],
    is_safe: true,
    target_user_gender: 'female'
  },
  {
    id: 104,
    message: "我觉得我们要不再了解一下？太快确立关系我怕对你不负责。",
    difficulty: 3,
    red_flag_score: 40,
    roast_analysis: "虽然听着像推脱，但如果是真诚的说出来，说明他对待感情慎重，是负责任的表现。",
    tags: ["慎重", "慢热"],
    is_safe: true,
    target_user_gender: 'female'
  },

  // ==========================================================
  // TARGET: MALE USERS (Messages from Women)
  // ==========================================================
  // --- RED FLAGS (Undeniable) ---
  {
    id: 201,
    message: "哥哥，嫂子不会生气吧？我只是让他帮我拧个瓶盖，她怎么那么小气呀。",
    difficulty: 1,
    red_flag_score: 100,
    roast_analysis: "顶级绿茶语录。以退为进，明着叫哥，暗着挑拨离间。‘嫂子小气’是核心攻击点。",
    tags: ["绿茶", "挑拨离间"],
    is_safe: false,
    target_user_gender: 'male'
  },
  {
    id: 202,
    message: "最近看上了一个包包，才两万块，可惜我此月工资不够，哎，好羡慕那些有男朋友疼的女生。",
    difficulty: 2,
    red_flag_score: 95,
    roast_analysis: "利用愧疚感和攀比心理索取财物。这是在给你下套，不买就是‘不疼她’。",
    tags: ["拜金", "情绪勒索"],
    is_safe: false,
    target_user_gender: 'male'
  },
  {
    id: 203,
    message: "我和他真的只是普通朋友，那天晚上太晚了，就借宿在他家沙发一晚，什么都没发生。",
    difficulty: 2,
    red_flag_score: 98,
    roast_analysis: "成年人的世界里，孤男寡女共处一室没有‘普通朋友’。侮辱智商系列。",
    tags: ["不忠", "毫无边界"],
    is_safe: false,
    target_user_gender: 'male'
  },
  {
    id: 206,
    message: "虽然我收了他的礼物，但我心里只有你啊，我怕拒绝他会让他伤心。",
    difficulty: 3,
    red_flag_score: 95,
    roast_analysis: "典型的‘养鱼’行为。收礼物不办事，还拿你当挡箭牌。她是海后，你是鱼。",
    tags: ["海后", "养鱼"],
    is_safe: false,
    target_user_gender: 'male'
  },

  // --- SAFE SCENARIOS (Look suspicious but are normal) ---
  {
    id: 301,
    message: "这顿饭有点贵，我们AA吧，你赚钱也不容易。",
    difficulty: 1,
    red_flag_score: 5,
    roast_analysis: "体谅你的付出，有独立的经济意识。这种女生通常通情达理，是个好姑娘。",
    tags: ["独立", "体贴"],
    is_safe: true,
    target_user_gender: 'male'
  },
  {
    id: 302,
    message: "不好意思，刚才去洗澡了，没看到消息。",
    difficulty: 1,
    red_flag_score: 15,
    roast_analysis: "最常见的真实理由。别想太多，女生洗澡真的很慢（洗头护发沐浴露身体乳...）。",
    tags: ["正常生活", "真实"],
    is_safe: true,
    target_user_gender: 'male'
  },
  {
    id: 303,
    message: "今天和闺蜜去逛街了，可能会回消息慢一点哦。",
    difficulty: 1,
    red_flag_score: 10,
    roast_analysis: "提前报备行程，说明她在意你的感受，同时也拥有自己的社交圈。健康的关系。",
    tags: ["报备", "边界感"],
    is_safe: true,
    target_user_gender: 'male'
  },
  {
    id: 304,
    message: "我不喜欢你抽烟，对身体不好，能不能为了我少抽点？",
    difficulty: 2,
    red_flag_score: 25,
    roast_analysis: "这是关心你的健康，虽然有点管束的意味，但出发点是好的，不算控制狂。",
    tags: ["关心", "健康"],
    is_safe: true,
    target_user_gender: 'male'
  }
];
