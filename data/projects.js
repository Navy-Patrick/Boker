window.__PROJECTS_DATA__ = [
  {
    "id": "project-content-projects-dual-platform-crawler-index",
    "date": "2026-04-10",
    "title": "股票评论与情绪观察窗口",
    "summary": "一个面向雪球 + 东方财富的双平台股票评论爬虫项目，支持分页抓取、本地数据库存取、每日评论统计导出、双平台看板与图表交互。",
    "stack": "Python / Requests / BeautifulSoup / Database / CLI",
    "github": "https://github.com/Navy-Patrick/dual-platform-crawler",
    "cover": "",
    "path": "./content/projects/dual-platform-crawler/index.md",
    "content": "# 股票评论与情绪观察窗口\n\n> 日期：2026-04-10\n> 摘要：一个面向雪球 + 东方财富的双平台股票评论爬虫项目，支持分页抓取、本地数据库存取、每日评论统计导出、双平台看板与图表交互。\n> 技术栈：Python / Requests / BeautifulSoup / Database / CLI\n> GitHub：https://github.com/Navy-Patrick/dual-platform-crawler\n\n## 项目价值\n\n该双平台情绪数据看板的核心价值在于：将市场**主观情绪进行量化观察**，为投资者提供客观、多维度的参考依据。\n\n### 1）减少单一平台偏见\n- 雪球（偏价值投资）与东方财富（偏短线交易）用户画像差异明显\n- 通过双平台融合，形成“长期价值情绪 + 短期交易情绪”的互补视角\n- 降低单一社区带来的情绪误判风险\n\n### 2）降低情绪化决策\n- 历史评论数据可视化后，抽象“情绪”变成可追溯、可比较的曲线\n- 便于识别情绪过热 / 过冷的阶段性拐点\n- 为买卖节奏提供理性参考，减少盲目跟风\n\n### 3）支持个性化跟踪\n- 可聚焦“特定股票”进行持续情绪观测\n- 更贴近持仓与关注标的，而非泛化市场噪声\n- 有利于形成个人化的情绪研究框架\n\n## 一句话总结\n\n@@hero 这是一个将“舆论热度”转化为“结构化情绪信号”的实用项目，目标不是预测市场，而是帮助投资者在噪声中提高判断质量。\n\n---\n\n\n![dashboard](./dashboard.webp)\n\n![东方财富数据展示](./eastmoney.webp)\n\n![雪球界面数据展示](./xueqiu.webp)\n\n\n"
  },
  {
    "id": "project-content-projects-Reddit-index",
    "date": "2025-10-26",
    "title": "Jigsaw – Agile Community Rules Classification",
    "summary": "基于社区规则与帖子语义的二分类任务，通过语义向量与轻量结构化特征结合，识别帖子是否违反规则，兼顾效果与可复现性。",
    "stack": "Python / Pandas / Scikit-learn / LightGBM / Qwen3-Embedding-0.6B / Kaggle",
    "github": "https://github.com/Navy-Patrick/jigsaw-agile-community-rules-classification",
    "cover": "",
    "path": "./content/projects/Reddit/index.md",
    "content": "# Jigsaw – Agile Community Rules Classification\n\n> 日期：2025-10-26\n> 摘要：基于社区规则与帖子语义的二分类任务，通过语义向量与轻量结构化特征结合，识别帖子是否违反规则，兼顾效果与可复现性。\n> 技术栈：Python / Pandas / Scikit-learn / LightGBM / Qwen3-Embedding-0.6B / Kaggle\n> GitHub：https://github.com/Navy-Patrick/jigsaw-agile-community-rules-classification\n\n## 项目核心内容\n\n本项目围绕 Kaggle 竞赛 `Jigsaw – Agile Community Rules Classification` 展开，目标是判断一条社区帖子是否违反给定规则。\n项目采用“语义理解 + 结构化特征”结合的方案，而不是只依赖单一模型。整体流程包括：\n- 对 `body`、`rule` 以及正负样本示例文本进行统一清洗与拼接\n- 提取文本长度、词汇重叠、相似度等轻量特征\n- 使用 `Qwen3-Embedding-0.6B` 获取语义向量，增强模型对复杂表达的理解能力\n- 使用 `LightGBM` 完成最终的二分类预测\n- 输出可直接提交到 Kaggle 的 `submission.csv`\n\n## 解决的问题\n\n这个项目主要解决以下几个问题：\n\n1. **规则表达抽象，不能只靠关键词判断**  \n   社区规则往往描述得比较宽泛，很多违规内容并不会直接出现敏感词，因此需要模型具备更强的语义理解能力。\n\n2. **存在大量难例和边界样本**  \n   有些帖子表面上看起来正常，但结合规则后其实违规；也有些帖子语气激烈，但并不违反规则。项目通过语义向量和统计特征结合，提升对这类样本的识别能力。\n\n3. **训练环境资源有限**  \n   Kaggle Notebook 的运行时间和算力有限，不能依赖过于复杂的训练流程，因此项目采用轻量、稳定、可离线运行的方案。\n\n总结来说，这个项目的目标是：在资源有限的条件下，把社区规则理解任务做成一个**可运行、可复现、兼顾效果与效率**的完整 NLP 分类方案。\n\n![效果图1](./poster.jpg)"
  },
  {
    "id": "project-content-projects-AIOps-LLM-Agent-智能运维故障根因诊断项目",
    "date": "2025-09-30",
    "title": "LLM Agent 智能运维故障根因诊断项目",
    "summary": "针对云原生环境下系统故障定位难、效率低的痛点，主导LLM Agent管线性能与准确率调优，通过Prompt优化、多智能体协作等策略，实现故障快速精准根因诊断，助力团队在5,000支队伍中斩获Top 0.5%的成绩。",
    "stack": "Python / PyTorch / Transformers / PEFT / LoRA",
    "github": "https://github.com/Navy-Patrick/aliyun_Ai-ops",
    "cover": "",
    "path": "./content/projects/AIOps/LLM Agent 智能运维故障根因诊断项目.md",
    "content": "# LLM Agent 智能运维故障根因诊断项目\n\n> 日期：2025-09-30\n> 摘要：针对云原生环境下系统故障定位难、效率低的痛点，主导LLM Agent管线性能与准确率调优，通过Prompt优化、多智能体协作等策略，实现故障快速精准根因诊断，助力团队在5,000支队伍中斩获Top 0.5%的成绩。\n> 技术栈：Python / PyTorch / Transformers / PEFT / LoRA \n> GitHub：https://github.com/Navy-Patrick/aliyun_Ai-ops\n\n\n## 项目背景\n随着云原生、AIGC等技术的快速革新，数字经济的影响力持续扩大，系统稳定性保障成为企业发展中无法回避的核心挑战，如何快速、准确定位系统故障，直接关系到系统可用性与业务连续性。与此同时，LLM凭借强大的推理能力，在运维领域的应用价值日益凸显，而多样的可观测数据（Log、Trace、Metric、Entity、Event）与开源事实标准，也让软件系统运行状况愈发透明。在此背景下，本次大赛提供真实云原生环境及多模态可观测数据，通过注入各类故障，要求选手借助AI技术，实现快速、准确、低成本的故障根因诊断，我们因此开展本项目，探索AI在AIOps场景的落地路径，解决故障定位痛点。\n\n## 核心工作\n1. Prompt Engineering深度优化，引入“资源优先”“相对指标强制”“SOP约束”核心诊断规则，引导模型精准区分表层症状与底层根因，提升诊断准确率。\n2. 落地多角色智能体协作方案，设计并调试数据分析师、系统专家、验证专家的协作流程与信息传递机制，有效降低单一模型的“幻觉”风险。\n3. 实现上下文管理与性能优化策略，通过动态摘要、上下文步数限制、早停机制，平衡故障诊断深度与Token消耗，提升管线运行效率。\n![获奖图片](./rank_27-award.webp) \n\n## 难点处理\n- 针对**单一模型幻觉风险高**的问题，通过多角色交叉验证机制，让验证专家对诊断结果进行二次校验，结合可观测数据反向验证推理逻辑；\n- 针对**诊断深度与Token消耗**的平衡难题，通过大量实验调试动态摘要阈值、上下文步数上限及早停条件，找到最优参数组合；\n\n- 比赛链接：[比赛官方链接](https://tianchi.aliyun.com/competition/entrance/532387)"
  },
  {
    "id": "project-content-projects-AInews-agent-n8n-index",
    "date": "2025-09-17",
    "title": "AI Agent + n8n 每日新闻推送",
    "summary": "用低代码搭建一个能自动看新闻、排日程、每日推送到手机的专属智能助手，全程无代码 / 低代码可复现。",
    "stack": "Python / Node.js / Docker",
    "github": "",
    "cover": "",
    "path": "./content/projects/AInews-agent-n8n/index.md",
    "content": "# AI Agent + n8n 每日新闻推送\n\n> 日期：2025-09-17\n> 摘要：用低代码搭建一个能自动看新闻、排日程、每日推送到手机的专属智能助手，全程无代码 / 低代码可复现。\n> 技术栈：Python / Node.js / Docker\n\n## 项目定位\n\n- 项目名称：每日新闻 + 日程智能 Agent（n8n 版）\n- 核心能力：自动抓取新闻 → AI 总结 → 生成日程 → 定时推送到手机\n- 面向人群：零基础，不用写复杂代码，拖拽节点即可搭建。\n\n## 完整工作流（6 步）\n\n1. 定时触发（Cron Trigger）\n   设定每天固定时间（如早 8 点）自动启动流程。\n2. 新闻数据源抓取\n   通过 RSS / 网页接口拉取指定领域新闻（科技 / 行业 / 热点）。\n3. AI 智能处理\n   大模型提炼要点、去重、过滤、生成精简摘要。\n4. 日程自动编排\n   按重要性 / 时间生成可读日程清单，结构化输出。\n5. 消息格式化\n   整理成手机友好的文本 / 卡片样式。\n6. 手机端推送\n   发到微信、邮箱、飞书、企业微信等，手机实时接收。\n\n## 一句话总结\n\n@@hero 这是一个用 n8n+AI 做的个人自动化助手，帮你每天自动排日程，搜集新闻。\n\n![效果图1](./workflow.png)\n\n![效果图2](./news.png)\n"
  },
  {
    "id": "project-content-projects-X-scraper-index",
    "date": "2025-06-07",
    "title": "X / Twitter 数据采集器（本地版）",
    "summary": "面向指定账号与时间区间的推文采集工具，基于 Scweet 实现本地稳定抓取，统一输出 JSON，方便后续分析与可视化。",
    "stack": "Python / Scweet / Requests / JSON / CLI",
    "github": "https://github.com/Navy-Patrick/twitter-x-scraper",
    "cover": "",
    "path": "./content/projects/X-scraper/index.md",
    "content": "# X / Twitter 数据采集器（本地版）\n\n> 日期：2025-06-07\n> 摘要：面向指定账号与时间区间的推文采集工具，基于 Scweet 实现本地稳定抓取，统一输出 JSON，方便后续分析与可视化。\n> 技术栈：Python / Scweet / Requests / JSON / CLI\n> GitHub：https://github.com/Navy-Patrick/twitter-x-scraper\n\n## 项目背景\n\n这个项目要解决的是：在不依赖官方 API 的前提下，如何稳定抓取指定账号在特定时间范围内的原创内容，并沉淀为可复用的数据资产。\n\n## 核心能力\n\n1. **账号定向抓取**：支持按用户名列表批量抓取，便于长期跟踪。\n\n2. **时间窗口控制**：支持 `SINCE/UNTIL` 精确筛选，降低无效数据噪声。\n\n3. **统一 JSON 输出**：结果结构一致，便于后续分析、建模和看板展示。\n![X-scraper 项目展示](./display.webp)\n\nGitHub：[项目仓库地址](https://github.com/Navy-Patrick/twitter-x-scraper)\n"
  }
];
