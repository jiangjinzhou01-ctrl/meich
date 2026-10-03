export const company = "湖南美创数字科技有限公司";
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const asset = (path: string) => `${basePath}${path}`;
export const navigation = [
  { label: "首页", href: "/" },
  { label: "产品与服务", href: "/products/" },
  { label: "解决方案", href: "/solutions/" },
  { label: "案例", href: "/cases/" },
  { label: "关于我们", href: "/about/" },
];
export const phone = "0731-89728572";
export const phoneHref = "tel:+8673189728572";
export const address = "湖南省长沙市岳麓区梅溪湖路76号，梅溪湖国际研发中心2栋";
export const sourceSite = "https://www.mgcdigi.com";
export const services = [
  {
    id: "display",
    image: "/brand/immersive-cinema.webp",
    num: "01",
    en: "DIGITAL EXHIBITION",
    title: "数字展示",
    description:
      "让空间、影像与互动共同讲述文化故事，构建可感知、可参与的展示体验。",
    items: ["展陈策划与设计", "数字影像与沉浸式影院", "互动展项与系统集成"],
    visual: "product",
  },
  {
    id: "heritage",
    image: "/brand/museum-platform.webp",
    num: "02",
    en: "SMART MUSEUM",
    title: "数字文博",
    description:
      "连接文物、场馆与观众，让文化遗产的保护、管理与传播延伸到数字世界。",
    items: ["文物三维采集", "智慧博物馆平台", "智慧导览与线上展览"],
    visual: "software",
  },
  {
    id: "creative",
    image: "/brand/creative.webp",
    num: "03",
    en: "CULTURAL CREATION",
    title: "数字文创",
    description: "从馆藏与地域文化提取灵感，连接创意设计、产品制作与互动体验。",
    items: ["文博 IP 与文创开发", "文旅场景产品定制", "产品生产与渠道协作"],
    visual: "enterprise",
  },
  {
    id: "operations",
    image: "/brand/operations.webp",
    num: "04",
    en: "DIGITAL OPERATIONS",
    title: "数字运营",
    description: "围绕文化空间、内容传播与活动组织，让一次体验成为持续的连接。",
    items: ["文化空间运营", "短视频 IP 与新媒体运营", "文化活动运营"],
    visual: "experience",
  },
];
export const projects = [
  {
    slug: "liye-qin-slips",
    title: "里耶古城（秦简）博物馆",
    en: "LIYE QIN SLIPS MUSEUM",
    type: "数字展示",
    service: "创意设计 / 实施制作",
    year: "2025",
    kind: "liye",
    image: "/brand/liye.webp",
    imageAlt: "里耶古城（秦简）博物馆“大秦迁陵 简读中华”主题展厅",
    description: "把秦简中的文字与日常，转化为可读、可感、可参与的历史体验。",
    source: "/cases/brochure-2026-liye-qin-slips",
    sections: [
      {
        title: "从一枚秦简，读懂一个时代。",
        text: "展览以“大秦迁陵 简读中华”为主题，围绕里耶古城、一号井出土简牍及相关文物，串联“古城探秘、南楚重镇、迁陵县政、汉土同风”四个部分。美创参与项目创意设计与实施制作。",
      },
      {
        title: "看得清，也读得懂。",
        text: "秦隶字形细小、内容庞杂，观看与理解都是需要解决的问题。展陈设计通过展柜角度与高度测试、低反玻璃和专业托台，改善文物的观看体验。",
      },
      {
        title: "让文字，拥有更多表达。",
        text: "“三重释义”将简牍实物、现代汉字转写与重点解读结合。故事通过图示、模型与生活场景展开，让观众从具体的人和事进入历史。",
      },
      {
        title: "空间、光影与互动共同叙事。",
        text: "以通透浅色空间连接文物与观众，结合动态光影、碗幕影院及多媒体互动，呈现简牍所记录的历史。美创官方项目报道记录了博物馆于2025年完成更新并向公众开放。",
      },
    ],
    gallery: [
      {
        image: "/brand/liye-cinema.webp",
        alt: "里耶古城（秦简）博物馆碗幕影院沉浸式影像",
      },
      {
        image: "/brand/liye-details.webp",
        alt: "里耶秦简的文字释读与重点标注版面",
      },
    ],
  },
  {
    slug: "potala-snow-city",
    title: "布达拉宫雪城展览升级改造",
    en: "POTALA PALACE · SNOW CITY",
    type: "数字展示",
    service: "展览设计 / 施工",
    year: "2021",
    kind: "potala",
    image: "/brand/potala.webp",
    imageAlt: "布达拉宫雪城展览升级改造项目现场",
    description: "在历史建筑中组织文化叙事，让保护、展示与体验形成连贯的空间。",
    source: "/cases/brochure-2026-potala-snow-city",
    sections: [
      {
        title: "让历史建筑，继续讲述历史。",
        text: "围绕雪城历史建筑与藏文化展示，美创承担展览设计与施工，整合保护维修、地方钱币、藏族酒文化及历史生活场景等主题展陈。项目年份为官方宣传册所载2021年。",
      },
      {
        title: "以保护为前提，组织新的表达。",
        text: "方案以简约性与功能性为出发点，围绕“继承文化，保护遗产”，结合历史建筑场景和专题展览，呈现西藏历史变迁。",
      },
      {
        title: "让不同主题，形成完整的参观体验。",
        text: "雪巴列空呈现布达拉宫保护维修，雪造币厂讲述地方钱币，羌仓呈现藏族酒文化。历史生活场景与主题内容相互连接，建立清晰的参观线索。",
      },
      {
        title: "文化内容，落到空间与制作。",
        text: "展陈设计与实施制作共同组织实物、图文及场景表达。项目范围和呈现内容依据美创官方公开案例整理，未追加未经确认的商业成果指标。",
      },
    ],
    gallery: [
      {
        image: "/brand/potala-gallery.webp",
        alt: "布达拉宫雪城项目专题展陈空间",
      },
    ],
  },
  {
    slug: "gaomiao",
    title: "高庙遗址博物馆",
    en: "GAOMIAO SITE MUSEUM",
    type: "数字文博",
    service: "展陈设计 / 数字互动",
    year: null,
    kind: "gaomiao",
    image: "/brand/gaomiao.webp",
    imageAlt: "高庙遗址博物馆展厅与文化场景展示",
    description: "以空间叙事连接文物、历史与观众，让遗址文化进入今天的体验。",
    source: "/cases/gaomiao",
    sections: [
      {
        title: "从文化根脉，走进展示体验。",
        text: "围绕高庙文化的展示，以空间叙事连接文物、历史与观众，让遗址所承载的文化信息成为可以被感知的参观内容。",
      },
      {
        title: "让文化知识，更直观。",
        text: "美创官网公开资料介绍了 UI 交互、AR 交互和多媒体影片等展示方式，通过数字表达连接文化内容与观众参与。",
      },
      {
        title: "技术，服务于故事。",
        text: "空间、数字内容与互动共同构成展示体验。具体产品配置及交付边界，以项目团队确认的信息为准。",
      },
    ],
    gallery: [],
  },
];
export const steps = [
  {
    title: "沟通",
    en: "DISCOVER",
    text: "理解文化内容、场景与合作目标。",
  },
  {
    title: "定义",
    en: "DEFINE",
    text: "明确叙事方向、项目边界与标准。",
  },
  {
    title: "设计",
    en: "DESIGN",
    text: "连接内容、空间与观众体验。",
  },
  {
    title: "制作",
    en: "BUILD",
    text: "完成内容制作、技术开发与集成。",
  },
  {
    title: "交付",
    en: "DELIVER",
    text: "现场验证，让体验可靠运行。",
  },
  {
    title: "优化",
    en: "EVOLVE",
    text: "结合反馈，持续完善内容与服务。",
  },
];
export const articles = [
  {
    slug: "kongwu-museum-store",
    category: "品牌动态",
    title: "把文化记忆，带进日常生活。",
    description: "空物相生首家线下门店，在武汉博物馆开启试营业。",
    date: "2026-10-01",
    image: "/brand/kongwu.webp",
    source: "/insights/article-c7e876af",
    paragraphs: [
      "2026年10月1日，美创数字旗下文创板块子品牌“空物相生”首家线下门店在武汉博物馆一楼开启试营业。门店让观众在参观之余接触文创产品，也为文化创意与产品开发建立了直接面向消费者的线下窗口。",
      "从馆藏文化的解读，到产品的设计与制作，文创让一次观展的兴趣延续到日常生活。城市地标、馆藏元素、IP周边与生活用品，可以成为收藏、使用与赠礼的载体。",
      "试营业阶段将围绕商品组合、陈列方式与服务流程收集反馈，进一步完善线下体验。本文依据美创现有官网公开动态整理，项目状态对应原文发布时点。",
    ],
  },
  {
    slug: "malanshan-exhibition",
    category: "项目动态",
    title: "让研发成果，成为可理解的展示体验。",
    description:
      "美创参与马栏山音视频实验室展厅深化设计、多媒体设计与数字内容制作。",
    date: "2025-05-18",
    image: "/brand/malanshan.webp",
    source: "/insights/article-c539eb28",
    paragraphs: [
      "据美创数字2025年5月18日发布的项目报道，美创参与马栏山音视频实验室展厅的深化设计、多媒体设计及数字内容制作。",
      "实验室关注音视频技术研发与创新。展示需要把专业技术与研发成果转化为观众容易理解的内容，并将空间设计、数字影像和互动表达组合为连贯的观看体验。",
      "美创在项目中结合多媒体设计与数字内容制作，参与虚实融合的数字化展示体系建设。本文依据美创官网公开报道整理，具体交付范围以原项目资料为准。",
    ],
  },
  {
    slug: "culture-in-experience",
    category: "编辑观点",
    title: "文化体验，从理解内容开始。",
    description: "先理解故事，再决定空间、媒介与互动的表达。",
    date: null,
    image: null,
    source: null,
    paragraphs: [
      "技术可以提供新的表达方式，但一次有意义的文化体验，仍然从内容开始。理解一件文物、一段历史或一种技艺的背景，才能找到值得被看见的细节。",
      "空间、影像和互动各有不同的节奏。让它们围绕同一个叙事目标工作，比增加技术种类更重要。观众需要清晰的线索，也需要可以停下来观察和思考的空间。",
      "体验并不止于离开展厅。线上内容、智慧导览与文创产品，都能延续一次文化发现。设计的任务，是让这些连接保持自然、清晰并有意义。",
    ],
  },
];
