/* ============ 浅浅的工作台 · 内容库 ============ */
window.DB = (function () {

  /* ---------- 随机赠言（今日页轻量展示） ---------- */
  const quotes = [
    "把今天过好，就是对未来最好的交代。",
    "慢一点没关系，方向对了就不算慢。",
    "自律不是苦行，是给未来的自己攒底气。",
    "别急着长成森林，先做一棵认真的小树。",
    "复利最迷人的地方，是它奖励坚持的人。",
    "今天多学的一个词，都会在某个考场等你。",
    "认真吃饭、认真睡觉，也是一种自我投资。",
    "记录本身就有意义，它让日子有了形状。",
    "不必每天都进步，但要每天都在场。",
    "情绪会过去，习惯会留下。",
    "你不需要很厉害才开始，你要开始了才会很厉害。",
    "省下的每一块钱，都是你自由的一小块。",
    "把大目标切碎，碎到今天就能咬一口。",
    "被看见之前，先把内容做好。",
    "允许自己有做得不好的一天。"
  ];

  /* ---------- 热销 & 高分书单 ---------- */
  const books = [
    { t:"蛤蟆先生去看心理医生", a:"罗伯特·戴博德", tag:"心理疗愈", c:"#9FB3A4",
      d:"用童话讲透心理咨询全过程，10 次面谈带你理解自己的情绪从哪来。适合当作心理入门第一本。", min:180 },
    { t:"被讨厌的勇气", a:"岸见一郎 / 古贺史健", tag:"哲学 · 成长", c:"#A3B4C2",
      d:"阿德勒心理学对谈体。课题分离、目的论，帮你从「别人怎么看」里松绑。", min:200 },
    { t:"纳瓦尔宝典", a:"埃里克·乔根森", tag:"财富 · 思维", c:"#CBB999",
      d:"关于财富与幸福的思考清单。核心是：靠特定知识、责任杠杆和复利，而不是靠出卖时间。", min:190 },
    { t:"小狗钱钱", a:"博多·舍费尔", tag:"理财启蒙", c:"#C9A492",
      d:"最友好的理财入门书。梦想储蓄罐、72 小时法则、成功日记，看完就能上手。", min:150 },
    { t:"穷查理宝典", a:"查理·芒格", tag:"投资 · 思维模型", c:"#AFA3B8",
      d:"多元思维模型 + 逆向思考。厚，但可以一章一章慢慢啃，是理财进阶的必读。", min:420 },
    { t:"原子习惯", a:"詹姆斯·克利尔", tag:"习惯养成", c:"#AFB292",
      d:"1% 的改进如何复利。四大定律：让它显而易见、有吸引力、简便易行、令人愉悦。", min:210 },
    { t:"活着", a:"余华", tag:"经典文学", c:"#BE9184",
      d:"福贵的一生。读完你会对「活着」这两个字有完全不同的理解。常年畅销榜前列。", min:170 },
    { t:"我在北京送快递", a:"胡安焉", tag:"非虚构", c:"#9FB3A4",
      d:"普通人的劳动纪实，真诚到有点疼。适合做自媒体的人读，学怎么讲真实的故事。", min:190 },
    { t:"也许你该找个人聊聊", a:"洛莉·戈特利布", tag:"心理 · 疗愈", c:"#C79AA0",
      d:"心理咨询师自己也去做咨询的故事。温柔、好读，深夜阅读友好。", min:320 },
    { t:"金字塔原理", a:"芭芭拉·明托", tag:"表达 · 思维", c:"#A3B4C2",
      d:"结论先行、以上统下。做内容、写脚本、写复盘都用得上的结构化表达底层功。", min:240 },
    { t:"底层逻辑", a:"刘润", tag:"商业思维", c:"#CBB999",
      d:"把商业世界的通用规律讲得很白话。适合想做账号变现的人建立商业感。", min:180 },
    { t:"人生只有一件事", a:"金惟纯", tag:"自我成长", c:"#AFA3B8",
      d:"那件事就是「活好」。适合每天读一小节，当作复盘前的静心。", min:160 },
    { t:"认知觉醒", a:"周岭", tag:"自我提升", c:"#AFB292",
      d:"讲清楚大脑的运作机制和「舒适区边缘」学习法，是很多人学习方法的启蒙书。", min:230 },
    { t:"文案的基本修养", a:"东东枪", tag:"文案 · 创作", c:"#C9A492",
      d:"广告老炮讲文案。做小红书标题、抖音钩子，这本书能直接提升你的手感。", min:200 },
    { t:"沟通的方法", a:"脱不花", tag:"沟通", c:"#9FB3A4",
      d:"18 个真实场景的沟通模型。雅思口语的思路组织也能借鉴。", min:210 },
    { t:"了不起的我", a:"陈海贤", tag:"心理 · 改变", c:"#C79AA0",
      d:"自我发展心理学。讲改变为什么这么难，以及怎么设计「小步子」。", min:250 },
    { t:"世界尽头的咖啡馆", a:"约翰·史崔勒基", tag:"轻哲学", c:"#A3B4C2",
      d:"很薄，两小时读完。三个问题：你为什么在这里？你害怕死亡吗？你满足吗？", min:90 },
    { t:"life 3.0 / 人类简史", a:"尤瓦尔·赫拉利", tag:"人文 · 视野", c:"#BE9184",
      d:"从认知革命到未来。想让内容有厚度，需要这种拉高视角的书。", min:380 },
    { t:"富爸爸穷爸爸", a:"罗伯特·清崎", tag:"财商经典", c:"#CBB999",
      d:"资产与负债的定义，是财商启蒙的分水岭。看完再去记账，感觉完全不同。", min:220 },
    { t:"雅思考官 IELTS 官方真题指南", a:"剑桥大学出版社", tag:"雅思工具书", c:"#AFA3B8",
      d:"备考绕不开的一本。搭配剑 12–19 真题使用，每天精做一篇。", min:300 }
  ];

  /* ---------- 金融 / 理财知识卡 ---------- */
  const finance = [
    { t:"72 法则", d:"用 72 除以年化收益率，得到本金翻倍所需年数。年化 6% → 12 年翻倍；年化 3% → 24 年。它让你直观感受「收益率差一点，时间差很多」。", k:"复利" },
    { t:"先支付自己", d:"发工资当天先把 10%–20% 转进储蓄/投资账户，剩下的才是可花的钱。顺序反过来，你永远存不下钱。", k:"储蓄" },
    { t:"4321 资产配置", d:"40% 稳健投资、30% 日常开销、20% 应急储备、10% 保险保障。不是铁律，但可以当作第一个参照系。", k:"配置" },
    { t:"应急基金", d:"存够 3–6 个月的必要开支，放在货币基金或活期理财里。它的作用不是赚钱，是让你在意外面前不用变卖资产。", k:"风险" },
    { t:"资产 vs 负债", d:"资产是把钱放进你口袋的东西，负债是把钱拿走的东西。一辆自用车通常是负债，一份能持续分红的基金是资产。", k:"财商" },
    { t:"定投的意义", d:"定投不是为了收益最大化，而是为了摊平成本、对抗人性。它的最大价值在于让你在下跌时还能继续买。", k:"投资" },
    { t:"指数基金", d:"跟踪某个指数（如沪深300、标普500）的被动基金，费率低、不押注个股。巴菲特给普通人的建议里，它出现频率最高。", k:"基金" },
    { t:"年化 vs 累计收益", d:"「累计收益 20%」如果花了 5 年，年化只有约 3.7%。看理财产品时永远换算成年化再比较。", k:"陷阱" },
    { t:"通货膨胀", d:"如果通胀 2.5%，你放在活期（0.2%）的钱每年实际购买力下降约 2.3%。不投资本身也是一种风险。", k:"宏观" },
    { t:"沉没成本", d:"已经花掉、无法收回的成本不该影响你的下一个决定。亏了 30% 的基金要不要卖，取决于它未来值不值得持有。", k:"心理" },
    { t:"信用卡的真实利率", d:"最低还款的日利率通常 0.05%，年化约 18.25%，且按全额计息。分期「手续费 0.6%/月」实际年化接近 13%。", k:"负债" },
    { t:"记账的三个层级", d:"1）记录：花了多少；2）分类：花在哪；3）复盘：值不值。只做第一层的记账，坚持不过一个月。", k:"记账" },
    { t:"消费的两个问题", d:"买之前问：这是需要还是想要？如果现在不买，一周后我还会想要它吗？这两个问题能砍掉大部分冲动消费。", k:"消费" },
    { t:"风险承受能力", d:"用「如果这笔钱亏 20% 我会不会睡不着」来测。会，就说明仓位太重或产品不合适，与收益率无关。", k:"风险" },
    { t:"分散投资", d:"不要把鸡蛋放在一个篮子里，也不要放在同一辆车上的很多篮子里。真正的分散是跨资产类别（股/债/现金/商品）。", k:"配置" },
    { t:"保险的顺序", d:"先医保 → 百万医疗 → 重疾 → 意外 → 定期寿险（有家庭责任才需要）。保险是转移风险，不是理财工具。", k:"保障" },
    { t:"净值型产品无保本", d:"资管新规后「保本理财」已退出。看到承诺保本高收益的，先怀疑再说。", k:"合规" },
    { t:"账户分离法", d:"开三个账户：日常消费卡、储蓄卡、投资账户。物理隔离比意志力可靠得多。", k:"方法" },
    { t:"个人现金流量表", d:"月收入 − 固定支出 − 可变支出 = 结余。先提升结余率（目标 30%），再谈投什么。", k:"记账" },
    { t:"市盈率 PE", d:"股价 ÷ 每股收益，粗略表示「多少年回本」。同行业横向比才有意义，跨行业比是耍流氓。", k:"股票" },
    { t:"债券基金的波动", d:"债基不等于稳赚。利率上行时债券价格下跌，短债波动小、长债波动大，别在债基上加杠杆。", k:"基金" },
    { t:"止盈比止损更难", d:"多数人栽在「涨了不舍得卖」。定投可以设置目标年化（如 15%）达到就分批止盈，规则化能对抗贪婪。", k:"纪律" },
    { t:"复利的前提", d:"复利需要三件事：正收益、长时间、不中断。中途大额取出一次，复利曲线就会被打断重来。", k:"复利" },
    { t:"隐形支出", d:"自动续费的会员、闲置的健身卡、外卖配送费。每季度做一次「订阅体检」，通常能省出一顿好饭。", k:"消费" },
    { t:"人力资本", d:"25 岁时你最大的资产不是存款，是你未来几十年的赚钱能力。投资技能的回报率通常高于任何理财产品。", k:"认知" },
    { t:"钱的三个用途", d:"消费（现在的快乐）、储蓄（未来的安全）、投资（未来的选择权）。任何一项归零，生活都会失衡。", k:"认知" },
    { t:"基金费率", d:"管理费+托管费+销售服务费，长期看能吃掉可观收益。C 类适合短持有，A 类适合长持有（一般超 2 年）。", k:"基金" },
    { t:"锚定效应", d:"原价 999 现价 399，让你觉得赚了。真正该问的是：399 这个价格，这个东西对我值不值。", k:"心理" },
    { t:"财务自由公式", d:"被动收入 ≥ 日常开支。所以它有两条路：把分子做大，或者把分母做小。后者往往被低估。", k:"目标" },
    { t:"税优账户", d:"个人养老金账户每年可享受税前扣除额度，长期锁定但有税收优惠。适合作为养老储备的一部分，不适合放应急钱。", k:"政策" }
  ];

  /* ---------- 理财学习路径 12 周 ---------- */
  const finPath = [
    { t:"建立记账习惯", d:"连续 7 天记下每一笔支出，不评判、只记录。周末做第一次分类统计。" },
    { t:"算清家底", d:"列出资产负债表：现金、存款、基金、欠款。知道自己站在哪，才知道往哪走。" },
    { t:"搭建三账户", d:"日常卡 / 储蓄卡 / 投资账户分离，设置工资到账日自动转账。" },
    { t:"存够应急金", d:"目标 3–6 个月开支，放货币基金。这一步没做完，不要开始投资。" },
    { t:"读完《小狗钱钱》", d:"配合梦想储蓄罐和成功日记实践，把理财从技术变成习惯。" },
    { t:"看懂基金四要素", d:"类型、费率、规模、基金经理。学会在天天基金/支付宝上看清楚这四项。" },
    { t:"理解指数基金", d:"搞懂沪深300、中证500、标普500分别代表什么，选定 1–2 只作为核心。" },
    { t:"开始小额定投", d:"每月 500 元起，设置自动扣款。目的是体验波动，不是赚钱。" },
    { t:"配齐基础保险", d:"检查医保状态，配置百万医疗 + 意外险。年缴总额控制在年收入 5% 以内。" },
    { t:"读《富爸爸穷爸爸》", d:"重新理解资产与负债，回头审视自己的每一笔大额支出。" },
    { t:"制定年度预算", d:"按 4321 或自己的比例，给明年的每个月做预算，留出「快乐基金」。" },
    { t:"季度复盘与再平衡", d:"检查结余率、投资收益、消费结构，调整下一季度目标。理财是循环，不是终点。" }
  ];

  /* ---------- 记账分类 ---------- */
  const cats = [
    { k:"food", e:"🍜", l:"餐饮" }, { k:"daily", e:"🧺", l:"日用" },
    { k:"traffic", e:"🚇", l:"交通" }, { k:"study", e:"📚", l:"学习" },
    { k:"fun", e:"🎬", l:"娱乐" }, { k:"beauty", e:"💄", l:"美妆" },
    { k:"health", e:"🏥", l:"医疗" }, { k:"home", e:"🏠", l:"居住" },
    { k:"social", e:"🎁", l:"人情" }, { k:"other", e:"✨", l:"其他" }
  ];
  const incomeCats = [
    { k:"salary", e:"💼", l:"工资" }, { k:"bonus", e:"🎊", l:"奖金" },
    { k:"side", e:"🌱", l:"副业" }, { k:"invest", e:"📈", l:"理财" },
    { k:"gift", e:"🧧", l:"红包" }, { k:"other_in", e:"✨", l:"其他" }
  ];

  /* ---------- 雅思 · 情景对话 ---------- */
  const ieltsScenes = [
    { s:"Part 1 · Hometown", tip:"Part 1 回答保持 2–3 句：直接回答 + 一个细节 + 一点感受。不要背模板腔。",
      lines:[
        { w:"Examiner", en:"Where is your hometown?", cn:"你的家乡在哪里？" },
        { w:"You", en:"I'm from a mid-sized city in the south of China. It's not a big name like Shanghai, but it's known for its food and a really slow pace of life.", cn:"我来自中国南方的一个中等城市。它不像上海那么有名，但以美食和慢节奏生活著称。" },
        { w:"Examiner", en:"Do you like living there?", cn:"你喜欢住在那里吗？" },
        { w:"You", en:"I do, mostly because everything is within walking distance. Though I have to admit, job opportunities are pretty limited compared to first-tier cities.", cn:"喜欢，主要是因为什么都在步行距离内。不过我得承认，和一线城市比工作机会挺有限的。" }
      ],
      words:["mid-sized","be known for","pace of life","within walking distance","first-tier city"] },

    { s:"Part 1 · Study & Work", tip:"提到工作/学习时加一个具体动词短语，比形容词更有画面感。",
      lines:[
        { w:"Examiner", en:"Do you work or are you a student?", cn:"你是工作还是学生？" },
        { w:"You", en:"I'm working at the moment. I handle content planning for a small brand, which basically means I decide what we post and when.", cn:"我目前在工作。我负责一个小品牌的内容策划，简单说就是决定我们发什么、什么时候发。" },
        { w:"Examiner", en:"What do you like most about your job?", cn:"你最喜欢工作的哪一点？" },
        { w:"You", en:"The creative freedom, definitely. I get to test my own ideas and see the numbers the next morning — it's oddly addictive.", cn:"绝对是创作自由。我可以测试自己的想法，第二天早上就能看到数据，莫名让人上瘾。" }
      ],
      words:["at the moment","handle","creative freedom","get to do","oddly addictive"] },

    { s:"Part 2 · Describe a skill you learned", tip:"Part 2 用 What–When–How–Why 四步走，最后一句一定要回到「感受」。",
      lines:[
        { w:"Cue Card", en:"Describe a skill you learned that took a long time. You should say: what it was, how you learned it, how long it took, and how you felt.", cn:"描述一项你花了很长时间学会的技能：是什么、怎么学的、花了多久、感受如何。" },
        { w:"You", en:"The skill I'd like to talk about is video editing. I picked it up about a year ago when I started posting on social media.", cn:"我想谈的技能是视频剪辑。大约一年前我开始发社交媒体时接触的。" },
        { w:"You", en:"At first I just followed tutorials step by step, but honestly my early videos were painful to watch. What really moved the needle was breaking down other people's videos frame by frame.", cn:"一开始我只是跟着教程一步步做，说实话早期的视频惨不忍睹。真正带来改变的是逐帧拆解别人的视频。" },
        { w:"You", en:"It took me roughly six months to feel confident, and looking back, the patience it taught me matters more than the skill itself.", cn:"大概花了六个月才有信心，回头看，它教给我的耐心比技能本身更重要。" }
      ],
      words:["pick sth up","move the needle","break down","frame by frame","looking back"] },

    { s:"Part 3 · Money & Society", tip:"Part 3 要给「双面观点 + 例子 + 立场」，句子可以长，但逻辑词要清楚。",
      lines:[
        { w:"Examiner", en:"Do you think schools should teach children about money?", cn:"你认为学校应该教孩子理财吗？" },
        { w:"You", en:"Absolutely. Financial literacy is one of those things everyone needs but almost nobody is formally taught.", cn:"绝对应该。财商是那种人人都需要、却几乎没人被正式教过的东西。" },
        { w:"You", en:"That said, I don't think it should be about picking stocks. It's more about basic habits — budgeting, understanding debt, delaying gratification.", cn:"话虽如此，我不认为应该教选股。更多是基本习惯——做预算、理解债务、延迟满足。" }
      ],
      words:["financial literacy","that said","budgeting","delay gratification","formally taught"] },

    { s:"生活场景 · 租房看房", tip:"日常场景练口语时，重点练「提问句式」，考试和生活都用得上。",
      lines:[
        { w:"You", en:"Hi, I'm calling about the two-bedroom flat listed online. Is it still available?", cn:"你好，我想问一下网上挂的那个两居室，还在吗？" },
        { w:"Agent", en:"Yes, it is. Would you like to arrange a viewing this weekend?", cn:"在的。您想这周末安排看房吗？" },
        { w:"You", en:"That'd be great. Could you tell me whether the bills are included in the rent?", cn:"太好了。能告诉我水电费是否包含在租金里吗？" },
        { w:"Agent", en:"Water and heating are included, but electricity is charged separately.", cn:"水和暖气包含，但电费单独收。" }
      ],
      words:["available","arrange a viewing","bills included","charged separately","deposit"] },

    { s:"生活场景 · 咖啡店点单", tip:"点单场景重点是礼貌层级：Could I…? / I'll go for… / That's me, thanks.",
      lines:[
        { w:"Barista", en:"Hi there, what can I get you?", cn:"你好，需要点什么？" },
        { w:"You", en:"Could I get a flat white, please? Regular size, oat milk if you have it.", cn:"请给我一杯馥芮白，中杯，有燕麦奶的话用燕麦奶。" },
        { w:"Barista", en:"Sure. Anything to eat with that?", cn:"好的，需要搭配点吃的吗？" },
        { w:"You", en:"I'll go for the almond croissant. To take away, thanks.", cn:"我要杏仁可颂。打包带走，谢谢。" }
      ],
      words:["flat white","oat milk","go for","take away","for here"] },

    { s:"生活场景 · 看医生", tip:"描述症状用 It's been + 时间段 + since…，或 I've been having…",
      lines:[
        { w:"Doctor", en:"What seems to be the problem?", cn:"哪里不舒服？" },
        { w:"You", en:"I've been having a sore throat and a mild fever for about three days now.", cn:"我嗓子疼、有点低烧，大概三天了。" },
        { w:"Doctor", en:"Any coughing or difficulty breathing?", cn:"有咳嗽或呼吸困难吗？" },
        { w:"You", en:"A bit of a dry cough, especially at night. But breathing is fine.", cn:"有点干咳，尤其是晚上。但呼吸没问题。" }
      ],
      words:["sore throat","mild fever","dry cough","difficulty breathing","prescription"] },

    { s:"学术场景 · 小组讨论", tip:"表达不同意见时先肯定再转折，这在口语评分的 Fluency 项很吃香。",
      lines:[
        { w:"Classmate", en:"I think we should focus the presentation on the statistics.", cn:"我觉得展示应该聚焦在数据上。" },
        { w:"You", en:"I see where you're coming from, but I'm worried the numbers alone might lose the audience.", cn:"我理解你的想法，但我担心光有数字可能会让听众走神。" },
        { w:"You", en:"What if we lead with a short case study and then back it up with the data?", cn:"要不我们先用一个小案例开场，再用数据支撑？" },
        { w:"Classmate", en:"That's a fair point. Let's structure it that way.", cn:"有道理，我们就这么组织吧。" }
      ],
      words:["see where you're coming from","lead with","back sth up","case study","that's a fair point"] },

    { s:"Part 2 · Describe a meal you cooked", tip:"食物类话题的高分秘诀：动词具体化（simmer / toss / drizzle）。",
      lines:[
        { w:"Cue Card", en:"Describe a meal you cooked for someone. Say what it was, who you cooked it for, and why it was memorable.", cn:"描述一次你为别人做的饭：做了什么、为谁做、为什么难忘。" },
        { w:"You", en:"I made a simple tomato and egg stir-fry for my flatmate after she had a rough week at work.", cn:"我室友工作上过了糟糕的一周后，我给她做了简单的番茄炒蛋。" },
        { w:"You", en:"It's nothing fancy — you just soften the tomatoes, fold in the eggs, and finish with a pinch of sugar to balance the acidity.", cn:"没什么讲究——把番茄炒软，把鸡蛋拌进去，最后加一小撮糖平衡酸味。" },
        { w:"You", en:"What made it memorable wasn't the food, it was watching her actually relax for the first time in days.", cn:"难忘的不是这道菜，而是看到她几天来第一次真正放松下来。" }
      ],
      words:["stir-fry","nothing fancy","fold in","a pinch of","balance the acidity"] },

    { s:"Part 3 · Technology & Life", tip:"科技类话题准备两个万能例子（手机 / AI），可以套很多题。",
      lines:[
        { w:"Examiner", en:"Has technology made people's lives easier or more stressful?", cn:"科技让人们的生活更轻松还是更有压力？" },
        { w:"You", en:"Both, and I think that's the honest answer. It's removed a huge amount of friction — banking, navigation, learning a language.", cn:"两者都有，我觉得这才是诚实的答案。它消除了大量摩擦——银行、导航、学语言。" },
        { w:"You", en:"On the flip side, it's blurred the line between work and rest. Being reachable 24/7 is its own kind of exhaustion.", cn:"另一方面，它模糊了工作和休息的界线。24 小时随时可被联系是另一种疲惫。" }
      ],
      words:["remove friction","on the flip side","blur the line","reachable","exhaustion"] }
  ];

  /* ---------- 雅思 · 单词库 ---------- */
  const ieltsWords = [
    { w:"substantial", p:"/səbˈstænʃl/", m:"adj. 大量的；实质性的", e:"There has been a substantial increase in online learning.", ec:"在线学习有了大幅增长。" },
    { w:"alleviate", p:"/əˈliːvieɪt/", m:"v. 减轻，缓解", e:"Remote work can alleviate traffic congestion.", ec:"远程办公可以缓解交通拥堵。" },
    { w:"prevalent", p:"/ˈprevələnt/", m:"adj. 普遍的，流行的", e:"Short-video addiction is prevalent among teenagers.", ec:"短视频成瘾在青少年中很普遍。" },
    { w:"detrimental", p:"/ˌdetrɪˈmentl/", m:"adj. 有害的", e:"Sleep deprivation is detrimental to concentration.", ec:"睡眠不足有害注意力。" },
    { w:"incentive", p:"/ɪnˈsentɪv/", m:"n. 激励，动机", e:"Tax breaks act as an incentive for small businesses.", ec:"税收减免是对小企业的激励。" },
    { w:"feasible", p:"/ˈfiːzəbl/", m:"adj. 可行的", e:"A four-day week is feasible in some industries.", ec:"四天工作制在某些行业是可行的。" },
    { w:"scrutiny", p:"/ˈskruːtəni/", m:"n. 仔细审查", e:"Public figures are under constant scrutiny.", ec:"公众人物一直处于被审视之下。" },
    { w:"compelling", p:"/kəmˈpelɪŋ/", m:"adj. 令人信服的；引人入胜的", e:"She made a compelling argument for remote study.", ec:"她为远程学习提出了令人信服的论点。" },
    { w:"disparity", p:"/dɪˈspærəti/", m:"n. 差距，不平等", e:"There is a wide disparity in income between regions.", ec:"地区间收入差距很大。" },
    { w:"sustainable", p:"/səˈsteɪnəbl/", m:"adj. 可持续的", e:"We need a sustainable approach to consumption.", ec:"我们需要可持续的消费方式。" },
    { w:"advocate", p:"/ˈædvəkeɪt/", m:"v. 提倡 n. 拥护者", e:"Many experts advocate learning a second language early.", ec:"许多专家提倡尽早学第二语言。" },
    { w:"deteriorate", p:"/dɪˈtɪəriəreɪt/", m:"v. 恶化", e:"Air quality has deteriorated over the past decade.", ec:"过去十年空气质量恶化了。" },
    { w:"inevitable", p:"/ɪnˈevɪtəbl/", m:"adj. 不可避免的", e:"Some degree of automation is inevitable.", ec:"一定程度的自动化不可避免。" },
    { w:"lucrative", p:"/ˈluːkrətɪv/", m:"adj. 赚钱的，获利丰厚的", e:"Content creation can be surprisingly lucrative.", ec:"内容创作可能出乎意料地赚钱。" },
    { w:"mitigate", p:"/ˈmɪtɪɡeɪt/", m:"v. 减轻（风险/影响）", e:"Diversification helps mitigate investment risk.", ec:"分散投资有助于降低风险。" },
    { w:"profound", p:"/prəˈfaʊnd/", m:"adj. 深刻的，深远的", e:"Social media has had a profound impact on attention spans.", ec:"社交媒体对注意力时长有深远影响。" },
    { w:"reluctant", p:"/rɪˈlʌktənt/", m:"adj. 不情愿的", e:"Older generations are often reluctant to adopt new apps.", ec:"年长一代往往不愿使用新应用。" },
    { w:"tedious", p:"/ˈtiːdiəs/", m:"adj. 冗长乏味的", e:"Data entry is tedious but necessary.", ec:"数据录入枯燥但必要。" },
    { w:"versatile", p:"/ˈvɜːsətaɪl/", m:"adj. 多才多艺的；多用途的", e:"Eggs are the most versatile ingredient in my kitchen.", ec:"鸡蛋是我厨房里最百搭的食材。" },
    { w:"ambiguous", p:"/æmˈbɪɡjuəs/", m:"adj. 模棱两可的", e:"The instructions were ambiguous, so I asked again.", ec:"说明含糊不清，所以我又问了一遍。" },
    { w:"conducive", p:"/kənˈdjuːsɪv/", m:"adj. 有助于……的", e:"A quiet room is conducive to deep work.", ec:"安静的房间有助于深度工作。" },
    { w:"deprive", p:"/dɪˈpraɪv/", m:"v. 剥夺", e:"Long commutes deprive people of family time.", ec:"长通勤剥夺了人们的家庭时间。" },
    { w:"exacerbate", p:"/ɪɡˈzæsəbeɪt/", m:"v. 使恶化，加剧", e:"Cheap fast fashion exacerbates textile waste.", ec:"廉价快时尚加剧了纺织品浪费。" },
    { w:"integral", p:"/ˈɪntɪɡrəl/", m:"adj. 不可或缺的", e:"Reflection is an integral part of learning.", ec:"复盘是学习中不可或缺的一环。" },
    { w:"notion", p:"/ˈnəʊʃn/", m:"n. 观念，看法", e:"The notion that money buys happiness is oversimplified.", ec:"「金钱买来幸福」的观念过于简化。" },
    { w:"resilient", p:"/rɪˈzɪliənt/", m:"adj. 有韧性的，能快速恢复的", e:"A diversified portfolio is more resilient in downturns.", ec:"多元化组合在下行期更有韧性。" },
    { w:"scarce", p:"/skeəs/", m:"adj. 稀缺的", e:"Attention is the scarcest resource online.", ec:"注意力是网络上最稀缺的资源。" },
    { w:"transparent", p:"/trænsˈpærənt/", m:"adj. 透明的，公开的", e:"Brands should be transparent about sponsorship.", ec:"品牌应对广告合作保持透明。" },
    { w:"underestimate", p:"/ˌʌndərˈestɪmeɪt/", m:"v. 低估", e:"People consistently underestimate how long tasks take.", ec:"人们总是低估任务所需时间。" },
    { w:"viable", p:"/ˈvaɪəbl/", m:"adj. 可行的，能存活的", e:"Freelancing became a viable career for her.", ec:"自由职业成了她可行的职业选择。" },
    { w:"catalyst", p:"/ˈkætəlɪst/", m:"n. 催化剂，促成因素", e:"The pandemic was a catalyst for online education.", ec:"疫情是在线教育的催化剂。" },
    { w:"discrepancy", p:"/dɪsˈkrepənsi/", m:"n. 差异，不一致", e:"There's a discrepancy between the two reports.", ec:"两份报告之间存在差异。" },
    { w:"empirical", p:"/ɪmˈpɪrɪkl/", m:"adj. 实证的，基于经验的", e:"There is little empirical evidence for that claim.", ec:"该说法缺乏实证依据。" },
    { w:"nuanced", p:"/ˈnjuːɑːnst/", m:"adj. 细致入微的", e:"The issue requires a more nuanced discussion.", ec:"这个问题需要更细致的讨论。" },
    { w:"proliferate", p:"/prəˈlɪfəreɪt/", m:"v. 激增，扩散", e:"AI tools have proliferated in the past two years.", ec:"AI 工具在过去两年激增。" },
    { w:"stagnant", p:"/ˈstæɡnənt/", m:"adj. 停滞的", e:"Wages have remained stagnant despite inflation.", ec:"尽管通胀，工资仍停滞不前。" },
    { w:"threshold", p:"/ˈθreʃhəʊld/", m:"n. 门槛，临界点", e:"The entry threshold for content creation is very low.", ec:"内容创作的入门门槛非常低。" },
    { w:"unprecedented", p:"/ʌnˈpresɪdentɪd/", m:"adj. 史无前例的", e:"We have unprecedented access to information.", ec:"我们获取信息的渠道前所未有。" },
    { w:"validate", p:"/ˈvælɪdeɪt/", m:"v. 验证，证实", e:"You should validate an idea before investing in it.", ec:"投入之前应先验证想法。" },
    { w:"wholesome", p:"/ˈhəʊlsəm/", m:"adj. 有益健康的；正能量的", e:"Cooking at home is a wholesome habit.", ec:"在家做饭是个健康的习惯。" }
  ];

  /* ---------- 雅思 · 影视精听 ---------- */
  const listening = [
    { film:"《穿普拉达的女王》", scene:"Miranda 第一次交代任务", lvl:"中等",
      text:"I need ___ things from Calvin Klein. Details of your ___ are of no ___ to me.",
      full:"I need ten or fifteen skirts from Calvin Klein. Details of your incompetence are of no interest to me.",
      ans:["ten or fifteen skirts","incompetence","interest"],
      note:"注意 of no interest to me 这个结构，表达「与我无关」，口语里很地道。" },
    { film:"《怦然心动》", scene:"外公谈论 Juli", lvl:"简单",
      text:"Some of us get ___, some get ___, some get beautiful. But every once in a while you find someone who's ___.",
      full:"Some of us get dipped in flat, some in satin, some get beautiful. But every once in a while you find someone who's iridescent.",
      ans:["dipped in flat","satin","iridescent"],
      note:"every once in a while = 偶尔，写作和口语都好用。iridescent 形容「光彩夺目」。" },
    { film:"《实习生》", scene:"Ben 的自我介绍", lvl:"中等",
      text:"Musicians don't ___, they stop when there's no more ___ in them.",
      full:"Musicians don't retire, they stop when there's no more music in them.",
      ans:["retire","music"],
      note:"这句可以直接用在 Part 3「老年人是否该继续工作」的话题里。" },
    { film:"《社交网络》", scene:"开场对白", lvl:"较难",
      text:"You don't have to ___ everything, you just have to be ___ than everyone else in the room.",
      full:"You don't have to study everything, you just have to be faster than everyone else in the room.",
      ans:["study","faster"],
      note:"语速快、连读多，适合练 shadowing（影子跟读）。" },
    { film:"《朱莉与朱莉娅》", scene:"Julia 谈烹饪", lvl:"简单",
      text:"The only ___ you need in the kitchen is a willingness to ___.",
      full:"The only thing you need in the kitchen is a willingness to learn.",
      ans:["thing","learn"],
      note:"a willingness to do sth 是很好的替换表达，写作中可替代 be willing to。" },
    { film:"《当幸福来敲门》", scene:"父子在球场", lvl:"中等",
      text:"Don't ever let somebody tell you you can't do something. You got a ___, you gotta ___ it.",
      full:"Don't ever let somebody tell you you can't do something. You got a dream, you gotta protect it.",
      ans:["dream","protect"],
      note:"注意 gotta = got to 的口语弱读，听力里非常常见。" },
    { film:"《生活大爆炸》", scene:"Sheldon 讲规则", lvl:"较难",
      text:"I'm not ___, my mother had me ___.",
      full:"I'm not crazy, my mother had me tested.",
      ans:["crazy","tested"],
      note:"have sb/sth done 的使役结构，口语里高频。" },
    { film:"《爱在黎明破晓前》", scene:"火车上的对话", lvl:"中等",
      text:"If there's any kind of ___, it must be in the little ___ between people.",
      full:"If there's any kind of magic in this world, it must be in the attempt of understanding someone.",
      ans:["magic in this world","attempt of understanding someone"],
      note:"文艺片语速慢、发音清晰，适合精听入门。" },
    { film:"《风雨哈佛路》", scene:"Liz 谈努力", lvl:"中等",
      text:"I knew at that moment I had to make a ___: I could ___ my life, or I could make it good.",
      full:"I knew at that moment I had to make a choice: I could submit to everything around me, or I could push myself.",
      ans:["choice","submit to everything around me"],
      note:"make a choice / push myself 这类短语在 Part 2「困难经历」里很好用。" },
    { film:"《国王的演讲》", scene:"语言治疗", lvl:"较难",
      text:"You have a ___ voice, and now you must ___ it.",
      full:"You have a voice of your own, and now you must find it.",
      ans:["voice of your own","find"],
      note:"英式口音标准范本，跟读它对雅思口语发音帮助极大。" }
  ];

  /* ---------- 简单菜谱库 ---------- */
  const recipes = [
    { n:"番茄炒蛋盖饭", t:"12 分钟", lv:"入门", kcal:"约 520 kcal",
      ing:"鸡蛋 3 个、番茄 2 个、米饭 1 碗、糖 1 小勺、盐、葱花",
      steps:["鸡蛋打散加一点点盐，热油下锅炒到七成熟盛出。","番茄切块下锅，加半勺糖炒出汁。","倒回鸡蛋翻炒 30 秒，加盐调味。","浇在米饭上，撒葱花。"],
      tip:"糖不是为了甜，是为了压番茄的酸，让味道更圆润。" },
    { n:"蒜香黄油虾", t:"15 分钟", lv:"入门", kcal:"约 310 kcal",
      ing:"虾 12 只、黄油 20g、蒜 5 瓣、黑胡椒、柠檬半个",
      steps:["虾开背去虾线，用厨房纸吸干水分。","黄油小火融化，下蒜末煸香但别焦。","下虾中火煎至两面变红。","撒黑胡椒，挤柠檬汁出锅。"],
      tip:"虾一定要擦干，不然会出水变成煮虾，煎不出焦香。" },
    { n:"日式亲子丼", t:"18 分钟", lv:"进阶", kcal:"约 620 kcal",
      ing:"鸡腿肉 1 块、洋葱半个、鸡蛋 2 个、生抽 2 勺、味淋 2 勺、糖 1 勺、水 4 勺",
      steps:["鸡腿去骨切块，洋葱切丝。","小锅下调料和水煮开，放洋葱煮软。","下鸡肉煮 5 分钟至熟。","蛋液分两次淋入，盖盖焖 30 秒即关火，盖在米饭上。"],
      tip:"蛋液分两次下，第一次成型、第二次保持嫩滑，这是关键。" },
    { n:"上汤娃娃菜", t:"10 分钟", lv:"入门", kcal:"约 160 kcal",
      ing:"娃娃菜 2 棵、皮蛋 1 个、咸蛋 1 个、蒜 3 瓣、高汤或清水",
      steps:["娃娃菜撕成条，皮蛋咸蛋切丁。","蒜末爆香，下蛋丁炒香。","加水或高汤煮开。","下娃娃菜煮 3 分钟，加盐即可。"],
      tip:"没有高汤就用一小勺鸡精+开水，味道相差不大。" },
    { n:"照烧鸡腿饭", t:"20 分钟", lv:"入门", kcal:"约 680 kcal",
      ing:"去骨鸡腿 2 块、生抽 2 勺、老抽半勺、蜂蜜 1 勺、料酒 1 勺、姜片",
      steps:["鸡腿皮朝下冷锅下锅，小火煎出油。","翻面煎 3 分钟至金黄。","倒掉多余油，加调好的照烧汁。","中小火收汁到浓稠裹住鸡腿，切块盖饭。"],
      tip:"冷锅下鸡皮是脆皮的秘诀，不要着急开大火。" },
    { n:"番茄龙利鱼", t:"15 分钟", lv:"入门", kcal:"约 280 kcal",
      ing:"龙利鱼柳 2 片、番茄 2 个、番茄酱 1 勺、淀粉少许",
      steps:["鱼柳切块，用盐、白胡椒、淀粉抓匀腌 5 分钟。","番茄切丁炒出沙，加番茄酱和小半碗水。","下鱼块煮 4 分钟。","勾薄芡出锅。"],
      tip:"鱼肉下锅后不要频繁翻动，容易碎。" },
    { n:"香菇滑鸡粥", t:"25 分钟", lv:"入门", kcal:"约 340 kcal",
      ing:"大米 1 杯、鸡胸肉 1 块、香菇 4 朵、姜丝、香油",
      steps:["米洗净加香油拌一下，加水大火煮开转小火。","鸡肉切片用盐淀粉抓匀。","米煮 20 分钟成粥后下香菇。","下鸡片搅散煮 3 分钟，加姜丝调味。"],
      tip:"米提前用香油拌过，煮出来更绵密起胶。" },
    { n:"泰式青木瓜沙拉（简化版）", t:"12 分钟", lv:"入门", kcal:"约 180 kcal",
      ing:"胡萝卜/黄瓜丝、圣女果、鱼露 1 勺、青柠 1 个、糖 1 勺、蒜、小米辣",
      steps:["蔬菜切细丝，冰水泡 5 分钟增加脆度。","蒜和辣椒剁碎，加鱼露、糖、青柠汁调汁。","沥干蔬菜，拌入酱汁。","加碎花生和圣女果。"],
      tip:"酸甜咸辣的比例可以先按 1:1:1 试，再按自己口味调。" },
    { n:"芝士焗红薯", t:"25 分钟", lv:"入门", kcal:"约 390 kcal",
      ing:"红薯 1 个、马苏里拉芝士 40g、黄油 10g、牛奶 2 勺",
      steps:["红薯蒸熟或微波 8 分钟至软。","对半切开挖出薯肉，压成泥。","薯泥加黄油和牛奶拌匀，填回皮里。","铺芝士，烤箱 200° 烤 8 分钟。"],
      tip:"没有烤箱可以用空气炸锅 180° 6 分钟。" },
    { n:"葱油拌面", t:"12 分钟", lv:"入门", kcal:"约 480 kcal",
      ing:"面条 1 把、小葱一大把、生抽 3 勺、老抽半勺、糖 1 勺、油",
      steps:["葱切段，白绿分开。","冷油下葱白，小火慢炸 8 分钟至焦黄。","加葱绿再炸 2 分钟，捞出葱。","葱油里加生抽老抽糖煮开，拌煮好的面。"],
      tip:"全程小火，葱要炸到深褐色但不能糊，这是香味的来源。" },
    { n:"电饭煲杂蔬鸡胸饭", t:"30 分钟", lv:"零失败", kcal:"约 520 kcal",
      ing:"米 1 杯、鸡胸 1 块、胡萝卜、玉米粒、豌豆、生抽 2 勺",
      steps:["米洗好加正常水量。","鸡胸切丁用生抽腌 5 分钟。","所有食材铺在米上。","按下煮饭键，跳闸后焖 5 分钟拌匀。"],
      tip:"一键出餐、洗一个锅，适合加班回家没力气的日子。" },
    { n:"牛油果鸡蛋吐司", t:"8 分钟", lv:"入门", kcal:"约 350 kcal",
      ing:"吐司 2 片、牛油果 1 个、鸡蛋 1 个、柠檬汁、黑胡椒、海盐",
      steps:["吐司烤到微脆。","牛油果压泥，加柠檬汁和盐拌匀。","煎一个溏心蛋。","牛油果泥抹吐司，放蛋，撒黑胡椒。"],
      tip:"柠檬汁不只是提味，还能防止牛油果氧化变黑。" },
    { n:"麻酱凉面", t:"12 分钟", lv:"入门", kcal:"约 460 kcal",
      ing:"面条、芝麻酱 2 勺、生抽 2 勺、醋 1 勺、糖半勺、蒜泥、黄瓜丝",
      steps:["芝麻酱用温水一点点澥开，直到顺滑。","加生抽、醋、糖、蒜泥调匀。","面煮熟过冷水，沥干。","拌入酱汁，铺黄瓜丝。"],
      tip:"芝麻酱一定要少量多次加水，一次加太多会结块澥不开。" },
    { n:"番茄牛腩（电饭煲版）", t:"60 分钟", lv:"进阶", kcal:"约 560 kcal",
      ing:"牛腩 500g、番茄 3 个、洋葱半个、番茄膏 1 勺、八角 1 个",
      steps:["牛腩冷水下锅焯水，撇沫捞出。","锅里炒香洋葱和番茄，加番茄膏。","所有材料放电饭煲，加水没过。","煮饭键跳后再按一次，共约 50 分钟。"],
      tip:"周末做一大锅，分装冷冻，工作日一热就是一顿饭。" },
    { n:"韩式泡菜炒饭", t:"10 分钟", lv:"入门", kcal:"约 540 kcal",
      ing:"隔夜饭 1 碗、泡菜半碗、午餐肉/培根、鸡蛋 1 个、芝麻油",
      steps:["泡菜切碎，肉切丁煎香。","下泡菜炒 1 分钟，炒出酸香。","下米饭炒散炒匀。","淋芝麻油，盖一个煎蛋。"],
      tip:"一定要用隔夜饭，新饭水分多会炒成泥。" },
    { n:"清蒸鲈鱼", t:"18 分钟", lv:"入门", kcal:"约 240 kcal",
      ing:"鲈鱼 1 条、姜片、葱段、蒸鱼豉油 3 勺、热油 2 勺",
      steps:["鱼身划两刀，用姜葱和料酒腌 10 分钟。","水开后大火蒸 8 分钟，关火焖 2 分钟。","倒掉盘中腥水，铺新葱丝。","淋蒸鱼豉油，浇热油激香。"],
      tip:"蒸鱼时间按「一斤 8 分钟」算，宁短勿长。" },
    { n:"奶油蘑菇汤", t:"20 分钟", lv:"入门", kcal:"约 290 kcal",
      ing:"口蘑 200g、洋葱半个、黄油 20g、面粉 1 勺、牛奶 250ml",
      steps:["蘑菇切片，黄油炒到出水收干。","加洋葱丁炒软，撒面粉炒 1 分钟。","分次加牛奶，边加边搅。","小火煮 5 分钟，加盐黑胡椒。"],
      tip:"面粉炒香再加奶，汤才不会有生粉味。" },
    { n:"生煎鸡胸配时蔬", t:"15 分钟", lv:"健身友好", kcal:"约 330 kcal",
      ing:"鸡胸 1 块、西兰花、口蘑、橄榄油、黑胡椒、迷迭香",
      steps:["鸡胸横片成两片，用刀背轻拍。","盐、黑胡椒、橄榄油腌 10 分钟。","热锅每面煎 3 分钟，静置 3 分钟再切。","蔬菜同锅炒熟。"],
      tip:"煎完静置是鸡胸不柴的关键，让肉汁重新分布。" },
    { n:"皮蛋瘦肉粥", t:"30 分钟", lv:"入门", kcal:"约 360 kcal",
      ing:"大米 1 杯、皮蛋 2 个、里脊肉 100g、姜丝、白胡椒",
      steps:["米加水煮开转小火，煮 20 分钟。","肉切丝用盐、淀粉、油抓匀。","下一半皮蛋煮 5 分钟融进粥里。","下肉丝和剩余皮蛋，煮 3 分钟，加白胡椒。"],
      tip:"皮蛋分两次下，一次给香味、一次给口感。" },
    { n:"空气炸锅琥珀鸡翅", t:"22 分钟", lv:"零失败", kcal:"约 400 kcal",
      ing:"鸡翅中 8 个、蜂蜜 1 勺、生抽 2 勺、蚝油 1 勺、蒜粉",
      steps:["鸡翅两面划刀，用调料腌 20 分钟（隔夜更好）。","空气炸锅 180° 预热 3 分钟。","翅中摆好，180° 炸 12 分钟。","翻面刷一层蜂蜜，再炸 5 分钟。"],
      tip:"蜂蜜最后刷，早了会焦苦。" }
  ];

  /* ---------- 地球 Online 任务池 ---------- */
  const quests = [
    { e:"💧", t:"补水任务", d:"今天喝够 6 杯水", p:10, tag:"生存" },
    { e:"🌤", t:"出门晒太阳", d:"到户外待满 15 分钟", p:15, tag:"探索" },
    { e:"🚶", t:"步行 6000 步", d:"人类续航测试", p:20, tag:"体能" },
    { e:"📵", t:"数字排毒 1 小时", d:"睡前一小时不碰手机", p:25, tag:"意志" },
    { e:"🧹", t:"清理一个角落", d:"只收拾一个抽屉/桌面，不许贪多", p:15, tag:"整理" },
    { e:"📞", t:"联络任务", d:"给家人或老朋友发条消息", p:15, tag:"社交" },
    { e:"🍳", t:"自炊成就", d:"自己做一顿饭并拍照", p:20, tag:"生活" },
    { e:"📖", t:"阅读 20 分钟", d:"纸质书优先，手机放远点", p:20, tag:"智力" },
    { e:"💰", t:"记账不断更", d:"今天所有支出都记下来", p:15, tag:"财务" },
    { e:"🗣", t:"英语开口 10 分钟", d:"跟读或自言自语都算", p:20, tag:"技能" },
    { e:"🧘", t:"静坐 5 分钟", d:"什么都不做，只是呼吸", p:10, tag:"心智" },
    { e:"✍️", t:"写下三件小确幸", d:"再糟的一天也能找到三件", p:15, tag:"心智" },
    { e:"🛏", t:"23:30 前上床", d:"人类充电协议", p:25, tag:"生存" },
    { e:"🎬", t:"剪一条 15 秒视频", d:"不求完美，只求发布", p:30, tag:"创作" },
    { e:"🚫", t:"零冲动消费日", d:"今天不买任何计划外的东西", p:25, tag:"财务" },
    { e:"🧺", t:"扔掉 3 件不用的东西", d:"物品也需要新陈代谢", p:15, tag:"整理" },
    { e:"🎧", t:"精听 5 分钟", d:"逐句听写一个影视片段", p:20, tag:"技能" },
    { e:"🌱", t:"学一个新词", d:"记一个雅思词并造句", p:10, tag:"智力" },
    { e:"💪", t:"运动 20 分钟", d:"拉伸/跳操/跑步任选", p:25, tag:"体能" },
    { e:"📝", t:"完成今日复盘", d:"睡前 5 分钟，给今天一个交代", p:20, tag:"心智" },
    { e:"🎨", t:"拍一张好看的照片", d:"练构图，也是内容素材", p:15, tag:"创作" },
    { e:"☕️", t:"独处半小时", d:"不社交、不刷屏，只跟自己待着", p:15, tag:"心智" }
  ];

  /* ---------- 成就徽章 ---------- */
  const badges = [
    { id:"b_first", e:"🌱", n:"初入地球", c:"完成第一个任务" },
    { id:"b_100", e:"⭐️", n:"百分玩家", c:"累计 100 积分" },
    { id:"b_500", e:"🌟", n:"资深居民", c:"累计 500 积分" },
    { id:"b_1000", e:"👑", n:"地球公民", c:"累计 1000 积分" },
    { id:"b_streak3", e:"🔥", n:"三日连击", c:"连续打卡 3 天" },
    { id:"b_streak7", e:"🏅", n:"七日不断", c:"连续打卡 7 天" },
    { id:"b_streak30", e:"💎", n:"月度传说", c:"连续打卡 30 天" },
    { id:"b_ledger", e:"💰", n:"记账新手", c:"记账满 10 笔" },
    { id:"b_book", e:"📚", n:"读书人", c:"读书打卡 7 次" },
    { id:"b_word", e:"🔤", n:"词汇猎人", c:"记住 50 个单词" },
    { id:"b_cook", e:"👩‍🍳", n:"厨房新星", c:"上传 5 张菜品照片" },
    { id:"b_post", e:"🎬", n:"内容创作者", c:"发布 10 条内容" },
    { id:"b_muse", e:"📝", n:"生活记录者", c:"写下 30 条碎碎念" }
  ];

  /* ---------- 碎碎念类型 ---------- */
  const museTypes = {
    note:     { key:"note",     label:"碎碎念", emoji:"💭", color:"--clay",  s:"--clay-s"  },
    complain: { key:"complain", label:"小抱怨", emoji:"🌀", color:"--terra", s:"--terra-s" },
    beauty:   { key:"beauty",   label:"小美好", emoji:"🌿", color:"--sage",  s:"--sage-s"  },
    photo:    { key:"photo",    label:"随手拍", emoji:"📷", color:"--mist",  s:"--mist-s"  }
  };

  /* ---------- 剪辑技巧库 ---------- */
  const editTips = [
    { t:"三秒钩子法则", d:"前 3 秒决定 70% 的完播率。开头别铺垫，直接给结果、给冲突或给反常识。",
      steps:["把最精彩的画面剪到第 0 秒","第 1 句话就抛出结论或悬念","删掉所有「大家好我是XX」式开场"] },
    { t:"J-Cut 与 L-Cut", d:"让声音比画面早出现（J-Cut）或晚消失（L-Cut），观感会立刻从「业余」变「顺滑」。",
      steps:["在时间线上把音频轨向前拖 0.5 秒","画面切换时保留上一段的环境音","对话类内容用 J-Cut，情绪收尾用 L-Cut"] },
    { t:"卡点的正确姿势", d:"不是每个鼓点都要切，而是「重音切画面、轻音切细节」，留出呼吸感。",
      steps:["先在音频波形上打标记点","主歌切慢、副歌切快","每 8 拍留一个长镜头作为喘息"] },
    { t:"文字动效的克制", d:"一条视频只用一种字体、两个字号、三种颜色。花哨的字幕会稀释信息。",
      steps:["主字幕居中偏下，避开界面遮挡","关键词用色块或加粗强调","入场动效统一用「淡入+轻微上移」"] },
    { t:"景别节奏法", d:"远—中—近—特写循环，观众的注意力会被自然牵引。同景别连切超过 3 个就会腻。",
      steps:["拍摄时每个动作至少拍 3 种景别","剪辑时按远中近排列","情绪高点一定给特写"] },
    { t:"降噪三件套", d:"声音比画面更影响「专业感」。手机也能出好声音，关键在环境和后期。",
      steps:["录音时靠近声源 30cm 内","软装房间录音（有窗帘、床、地毯）","后期用降噪 + 压缩 + EQ 提亮 3–5kHz"] },
    { t:"空镜的作用", d:"空镜不是废片，是节奏调节器。它给观众消化上一句话的时间。",
      steps:["每次出门都拍 3 个空镜存素材","转场处插 1 秒空镜","配合环境原声，别全铺 BGM"] },
    { t:"变速的两种用法", d:"加速用于压缩过程（做饭、整理），慢放用于强调瞬间（表情、动作落点）。",
      steps:["过程类片段 2–8 倍速","关键瞬间 0.5 倍速 + 音效","变速处加一个轻微缩放让它更自然"] },
    { t:"色调统一的懒人法", d:"不会调色就用同一个 LUT + 统一白平衡，比每条视频各调各的更有辨识度。",
      steps:["选定 1 个主色调（如奶油灰、青橙）","拍摄时手动锁定白平衡","后期只微调曝光和饱和度"] },
    { t:"结尾的三种收法", d:"钩子式（下期预告）、共鸣式（一句话金句）、行动式（引导评论）。别用「感谢观看」。",
      steps:["共鸣式：把视频主题浓缩成一句话","行动式：抛一个具体的、好回答的问题","钩子式：露出下一条的最精彩画面"] },
    { t:"字幕断句的秘密", d:"按呼吸断句，不按标点断句。一屏字幕不超过 15 个字，观众才不用「读」。",
      steps:["朗读一遍，在换气处断开","长句拆成两屏，不要缩小字号","数字和专有名词单独成屏"] },
    { t:"素材整理工作流", d:"剪辑速度慢 80% 是因为找素材。建立文件夹规范能省下大量时间。",
      steps:["按「日期_主题」建文件夹","拍完当天就粗筛一遍，删废片","好素材单独放 BEST 文件夹随时可调"] },
    { t:"BGM 的选取逻辑", d:"BGM 服务于情绪，不是填补空白。人声段落 BGM 音量应压到 -20dB 以下。",
      steps:["先定情绪：温暖/清冷/轻快/治愈","找纯音乐，人声 BGM 会抢词","开头 2 秒淡入，结尾 3 秒淡出"] },
    { t:"封面比内容更重要", d:"小红书的点击率 70% 来自封面。封面要有「标题 + 一个视觉记忆点」。",
      steps:["封面文字不超过 12 个字","用 3:4 竖版占满屏","同一账号封面模板保持一致"] },
    { t:"口播的剪辑技巧", d:"删掉所有「嗯、那个、然后」，每句之间留 0.2 秒，节奏会紧凑到不想划走。",
      steps:["用自动字幕定位废词","批量删除静音段（超 0.5 秒）","语速慢的地方整体提速 1.05 倍"] },
    { t:"转场不需要花哨", d:"90% 的场景用硬切最好。真要转场，用「同色转场」或「运动匹配」。",
      steps:["同色转场：上一帧结尾和下一帧开头主色一致","运动匹配：镜头运动方向保持连贯","少用软件自带的花式转场"] },
    { t:"竖版构图安全区", d:"上方 15%、下方 25% 会被平台 UI 遮挡，重要信息必须放中间区域。",
      steps:["剪辑软件里开启安全框","字幕位置固定在画面 65%–75% 处","人脸放在上三分之一交点"] },
    { t:"一条素材剪三条", d:"同一批素材换钩子、换封面、换标题，可以做成三条不同的视频测试数据。",
      steps:["A 版：结果前置","B 版：故事开场","C 版：提问开场"] },
    { t:"数据复盘怎么看", d:"完播率看开头，点赞率看价值，评论率看争议，收藏率看实用性。对症下药。",
      steps:["完播低 → 改前 3 秒","收藏低 → 增加干货密度","评论低 → 结尾加提问"] },
    { t:"批量生产的节奏", d:"把「拍」和「剪」分开。一天集中拍 5 条，另一天集中剪 5 条，效率翻倍。",
      steps:["周末半天拍摄日","工作日晚上各剪 1 条","固定发布时间训练算法"] }
  ];

  /* ---------- 自媒体 30 天起号路线 ---------- */
  const mediaPath = [
    { wk:"DAY 1–3", t:"账号定位与人设", d:"确定「给谁看、看什么、为什么是你」。写下一句话简介，设置头像、昵称、简介三件套。" },
    { wk:"DAY 4–7", t:"对标账号拆解", d:"找 10 个同赛道账号，记录他们的选题、封面、标题结构和爆款率。做一张对标表。" },
    { wk:"DAY 8–14", t:"发布前 10 条", d:"不追求爆款，追求「发出来」。测试三种内容形式：干货、日常、情绪。观察哪种数据最好。" },
    { wk:"DAY 15–20", t:"打磨爆款要素", d:"根据前 10 条的数据，固定表现最好的封面模板和开头方式，形成自己的公式。" },
    { wk:"DAY 21–25", t:"建立内容系列", d:"把单条内容做成系列（如「浅浅的100天」），系列感是涨粉的加速器。" },
    { wk:"DAY 26–30", t:"互动与私域", d:"认真回复每条评论，主动去同赛道评论区互动。引导关注，铺垫后续变现。" }
  ];

  /* ---------- 变现路径 ---------- */
  const monetize = [
    { s:"0–1000 粉", t:"打基础，不谈变现", d:"这个阶段唯一的任务是把内容做稳定。可以开始接触「好物体验」类合作，攒经验和素材。", c:"#9FB3A4" },
    { s:"1000–5000 粉", t:"品牌合作起步", d:"开通蒲公英/星图，报价从 300–800 元/条起。同步做「个人主页」引流，铺垫私域。", c:"#A3B4C2" },
    { s:"5000–1w 粉", t:"多元收入并行", d:"品牌合作 + 联盟带货（选品要克制）+ 开始设计自己的轻服务，比如咨询、模板、社群。", c:"#CBB999" },
    { s:"1w+ 粉", t:"产品化与长期主义", d:"把最被需要的内容做成产品：课程、陪伴营、实体或数字商品。此时账号是渠道，产品才是资产。", c:"#BE9184" }
  ];

  /* ---------- 脚本拆解模板 ---------- */
  const scriptFrame = [
    { p:"钩子 0–3s", q:"它用什么留住我？", eg:"反常识结论 / 冲突画面 / 直接给结果 / 提出我正在困扰的问题" },
    { p:"背景 3–8s", q:"它怎么建立可信度？", eg:"身份亮明 / 数据支撑 / 场景代入" },
    { p:"主体 8–40s", q:"信息怎么组织的？", eg:"三点式 / 时间线 / 对比式 / 故事线" },
    { p:"高潮 40–50s", q:"情绪峰值在哪？", eg:"反转 / 金句 / 结果揭晓" },
    { p:"结尾 最后 5s", q:"它引导我做什么？", eg:"提问引评论 / 预告下期 / 引导收藏" }
  ];

  /* ---------- 默认（离线兜底）热点 & 新闻 ---------- */
  const fallbackTrends = {
    date:"", note:"这是内置示例内容。开启每日 8:00 自动推送后，这里会替换成真实热榜。",
    xhs:[
      { t:"# 打工人早八自救指南", d:"通勤 + 早餐 + 效率工具类内容持续走高，笔记形式以「清单 + 实拍」为主。" },
      { t:"# 一人食也要好好吃饭", d:"低成本一人食做法，封面用俯拍餐桌图，标题带具体价格更容易点击。" },
      { t:"# 我的存钱进度条", d:"可视化存钱记录，用手绘/表格截图做封面，评论区互相监督氛围强。" },
      { t:"# 雅思备考日记", d:"备考类日更打卡，系列感强的账号涨粉快，适合真实分享。" },
      { t:"# 周末去哪儿city walk", d:"本地生活类流量稳定，路线图 + 实拍九宫格是标准打法。" }
    ],
    dy:[
      { t:"沉浸式做饭第一视角", d:"无口播、原声 ASMR + 字幕说明，完播率高，适合新手起号。" },
      { t:"30 秒学会一个英语表达", d:"短平快知识类，固定片头 + 固定板式，容易形成记忆点。" },
      { t:"我的一天 vlog（打工版）", d:"时间戳剪辑 + 真实吐槽，共鸣型内容评论率高。" },
      { t:"存钱挑战第 N 天", d:"进度可视化 + 每日小结，系列化留存好。" },
      { t:"新手剪辑教学", d:"手机操作录屏 + 关键步骤放大，收藏率高。" }
    ],
    script:{
      title:"示例拆解：《一人食·10 分钟番茄炒蛋盖饭》",
      rows:[
        { p:"0–3s", c:"特写鸡蛋滑入油锅的「滋啦」声，字幕：「10 分钟，一个人也值得好好吃饭」", w:"声音先行 + 情绪共鸣，直接跳过所有铺垫" },
        { p:"3–8s", c:"俯拍食材摆盘，字幕列出成本「¥8.5」", w:"给出具体数字，建立可信度和实用价值" },
        { p:"8–35s", c:"四步操作，每步一个特写 + 变速", w:"信息密度高但不啰嗦，变速压缩等待时间" },
        { p:"35–45s", c:"成品出锅 + 第一口特写", w:"情绪峰值，也是最容易被点赞的一帧" },
        { p:"45–50s", c:"字幕：「你今天吃了什么？」", w:"低门槛提问，评论区自然活跃" }
      ]
    }
  };

  const fallbackNews = {
    date:"", note:"这是内置占位内容。开启每日 8:30 自动推送后，这里会替换成当天真实要闻。",
    items:[
      { t:"开启每日新闻推送", d:"在设置里查看自动化说明，助手会在每天 8:30 抓取并写入当日要闻。" },
      { t:"新闻会怎么呈现", d:"每天 5–8 条，含财经、科技、社会民生，每条附一句「与你有什么关系」。" },
      { t:"离线也能看", d:"推送内容会缓存在本地，没网时依然可以读到最近一次的推送。" }
    ]
  };

  /* ---------- 股市 · 基础知识（零基础友好） ---------- */
  const stockBasics = [
    { t:"股票到底是什么", d:"公司把所有权切成很多小份卖出来筹钱，你买一股就是成了它的小股东。公司赚钱会分红，市场觉得它值钱时股价就涨。你赚的来自两部分：分红 + 股价涨跌。" },
    { t:"A股 / 港股 / 美股", d:"A股是大陆上市、用人民币（沪市、深市）；港股在香港、用港币；美股在美国、用美元。三者交易时间、涨跌幅限制、规则都不同，新手先从熟悉的 A 股开始。" },
    { t:"开盘价 / 收盘价", d:"开盘价是上午第一笔成交价，收盘价是下午最后一笔。收盘价常用来判断当天强弱——收在高位说明买盘强。" },
    { t:"涨跌停板", d:"A股主板一天最多涨/跌 10%，创业板、科创板是 20%。到顶就「停牌」不让再涨跌，目的是防暴涨暴跌。ST 股限制是 5%。" },
    { t:"成交量", d:"当天一共成交了多少股。价是方向，量是温度：放量上涨说明真有人买，无量上涨容易回落。量是价格的体温计。" },
    { t:"上证 / 深证 / 创业板指", d:"把一篮子股票按规则算出一个数字，就是「大盘指数」。看它就知道市场整体是冷是热，比如上证指数代表沪市整体。" },
    { t:"市盈率 PE", d:"股价 ÷ 每股赚的钱，约等于「多少年回本」。同行业横向比才有意义，跨行业比是耍流氓。PE 高代表市场给的期待高。" },
    { t:"市净率 PB", d:"股价 ÷ 每股净资产。银行、地产这类「重资产」公司常看 PB，PB<1 常被说成「破净」，但不等于便宜，要看为什么。" },
    { t:"牛市 与 熊市", d:"长期上涨叫牛市，长期下跌叫熊市。新手最危险的时刻，是牛市末端才冲进场——前面的人都在等人接盘。" },
    { t:"主力 与 散户", d:"资金量大的机构叫主力，个人叫散户。看「主力净流入」能感受大钱往哪去，但别盲跟，主力也会错。" },
    { t:"北向资金", d:"通过沪深港通，从香港买 A 股的外资。它们常被看作「聪明钱」的风向标，连续净流入常被解读为机构看好。" },
    { t:"板块轮动", d:"资金今天炒科技、明天炒消费，同一时间不同行业冷热不同。理解轮动，就不会追在热点尾巴上。" },
    { t:"K线 长什么样", d:"一根「蜡烛」记下一根 K 线：开盘、收盘、最高、最低。A 股习惯红涨绿跌。看形状能读出当天的多空情绪。" },
    { t:"换手率", d:"一段时间里股票「转手」的比例。太高可能过热、太低可能没人气。配合价格一起看才有意义。" },
    { t:"分红 与 股息率", d:"公司把利润分给股东就是分红。股息率 = 每股分红 ÷ 股价，像「收租」的回报，适合看重稳定现金流的人。" },
    { t:"手续费 与 印花税", d:"买卖都有成本：佣金（约万 2.5）、卖出时印花税（0.05%）、过户费。频繁交易会默默被手续费吃掉利润。" },
    { t:"怎么开户买第一只", d:"选一个券商 App（如华泰、东方财富），备好身份证+银行卡，做视频认证，开户后就能买。新手先拿小钱练手，别一上来重仓。" },
    { t:"ETF 是什么", d:"像股票一样买卖的「一篮子」。比如沪深300ETF，买一份等于买一篮大盘股，分散又省心，适合不懂选股的新手。" }
  ];

  /* ---------- 股市 · 变化与规律 ---------- */
  const stockMoves = [
    { t:"价格由供需决定", d:"想买的人多过想卖的，价就涨；反过来就跌。所有新闻、政策、业绩，最终都作用在「多空力量」这杆秤上。" },
    { t:"政策面最容易先动预期", d:"降息、降准、行业扶持，消息出来前股价常常已经涨过一轮。等新闻铺天盖地，往往是在兑现预期而非开始。" },
    { t:"业绩是股价的地基", d:"季报、年报超预期，股价通常给反应；不及预期就跌。一句行话：利好出尽是利空——好消息兑现完反而易跌。" },
    { t:"利率影响估值", d:"利率下行时，未来赚的钱更值钱，估值被抬高；加息则压缩估值。所以美联储/央行动作，全球股市都盯着。" },
    { t:"先看大盘，再挑个股", d:"约 80% 的股票跟着大盘走。大盘环境差时，逆着做的难度陡增。先看指数冷暖，再决定仓位轻重。" },
    { t:"情绪会放大波动", d:"贪婪时追高、恐慌时踩踏。市场先生情绪化，你的冷静就是优势。别人恐惧我贪婪，反过来也成立。" },
    { t:"量价要互相验证", d:"价涨量增才健康，像车有油；价涨量缩像没油的空转，容易回落。下跌放量则要警惕真有资金出逃。" },
    { t:"资金面看三条线索", d:"北向资金、主力净流入、两融余额，都是「钱往哪去」的线索。三者共振时，信号更可靠。" },
    { t:"板块轮动有季节逻辑", d:"经济复苏早期看周期（有色、化工），流动性宽松看成长（科技），防御时段看消费、医药。理解逻辑胜过追代码。" },
    { t:"别去猜点位", d:"没人能稳定猜准顶和底。普通人该做的是：用定投摊平成本 + 管好仓位，而不是赌一个精确方向。" }
  ];

  /* ---------- 股市 · 怎么看新闻 ---------- */
  const stockNews = [
    { t:"先分真假信息源", d:"首选交易所公告、财联社、央视财经、东方财富。小道消息和「内部票」多半是坑。权威源慢一点，但踩雷少。" },
    { t:"同一件事对不同行业是反的", d:"油价涨，对航空公司是利空（成本升），对石油公司却是利好。看新闻要问：它影响谁的利润？" },
    { t:"分清「预期」还是「兑现」", d:"政策刚出是预期炒作，真正落地才看业绩。别在利好兑现后去追高，那时往往是最拥挤的时候。" },
    { t:"财报看三张表", d:"利润表（赚不赚）、资产负债表（稳不稳）、现金流量表（钱真不真）。其中现金流最关键——利润可以粉饰，现金很难。" },
    { t:"关注北向 / 主力动向", d:"连续净流入常被解读为机构看好，但务必结合估值看，别盲跟。它们也会错，信号只是参考。" },
    { t:"别被标题党带节奏", d:"「暴跌」「惊天」多为吸引点击。点进去看具体幅度与原因，数字比形容词靠谱。" },
    { t:"固定 2–3 个信息源就够", d:"每天花 10 分钟看权威源，比刷 100 条小作文有用。信息源太多反而容易焦虑、乱操作。" },
    { t:"练「因果链」思维", d:"看到一条，问自己：它影响供给还是需求？影响利润还是估值？练多了，新闻就不再是噪音。" }
  ];

  const stockSources = [
    { n:"东方财富", u:"https://quote.eastmoney.com", e:"📈" },
    { n:"同花顺", u:"https://www.10jqka.com.cn", e:"🔍" },
    { n:"财联社", u:"https://www.cls.cn", e:"📰" },
    { n:"央视财经", u:"https://finance.cctv.com", e:"📺" },
    { n:"雪球", u:"https://xueqiu.com", e:"⚪" },
    { n:"上交所", u:"https://www.sse.com.cn", e:"🏛️" }
  ];

  /* ---------- 播客节目库（精选，跨分类） ---------- */
  const podcasts = [
    // 理财 / 投资
    { t:"知行小酒馆", host:"有知有行", tag:"理财", where:"小宇宙", d:"把「好好赚钱、好好生活」讲透，新手最友好的理财播客，不焦虑、重理念。" },
    { t:"无人知晓", host:"孟岩", tag:"理财", where:"小宇宙", d:"慢节奏深聊，关于钱、关于选择、关于怎么过好这一生。" },
    { t:"声动早咖啡", host:"声动活泼", tag:"商业", where:"小宇宙", d:"每天 15 分钟，用一杯咖啡的时间读懂商业世界，适合通勤听。" },
    { t:"商业就是这样", host:"第一财经", tag:"商业", where:"小宇宙", d:"把复杂的商业事件讲成人话，建立商业直觉很合适。" },
    { t:"高能量", host:"高能量", tag:"商业", where:"小宇宙", d:"创业者与职场人的真实故事，听别人怎么踩坑、怎么破局。" },
    { t:"自由会客厅", host:"自由会客厅", tag:"理财", where:"小宇宙", d:"聊财富自由与生活方式设计，适合想搞清「钱为了什么」的人。" },
    // 成长 / 思维
    { t:"得意忘形", host:"Steve 与小伙伴", tag:"成长", where:"小宇宙", d:"一档关于自我与世界的播客，信息密度高，适合边走边想。" },
    { t:"组织进化论", host:"组织进化论", tag:"成长", where:"小宇宙", d:"聊职场、管理与个人成长，给打工人一点清醒视角。" },
    { t:"三五环", host:"刘飞", tag:"成长", where:"小宇宙", d:"商业 + 内容创作双视角，想做自媒体的人能听到很多底层逻辑。" },
    // 英语 / 雅思
    { t:"BBC 6 Minute English", host:"BBC Learning English", tag:"英语", where:"苹果播客", d:"每期 6 分钟聊一个话题，附实用词汇，雅思听力磨耳朵神器。" },
    { t:"The English We Speak", host:"BBC Learning English", tag:"英语", where:"苹果播客", d:"每期学一个英式俚语 / 习语，短小精悍，碎片时间就能听。" },
    { t:"ESL Pod", host:"Center for Educational Development", tag:"英语", where:"官网/App", d:"慢速英语场景讲解，职场与生活全覆盖，适合精听跟读。" },
    { t:"All Ears English", host:"Lindsay & Michelle", tag:"英语", where:"苹果播客", d:"聊美式表达与留学职场，轻松不枯燥，练地道口语。" },
    { t:"Luke's English Podcast", host:"Luke Thompson", tag:"英语", where:"官网", d:"幽默的英式长节目，进阶听力与词汇量友好。" },
    // 科技
    { t:"硅谷 101", host:"泓君", tag:"科技", where:"小宇宙", d:"中文讲全球科技与 AI 前沿，跟踪硅谷与创投动态很顺手。" },
    { t:"津津乐道", host:"津津乐道", tag:"科技", where:"小宇宙", d:"多个子节目覆盖数码、出行、生活，科技爱好者日常补给。" },
    { t:"内核恐慌", host:"内核恐慌", tag:"科技", where:"小宇宙", d:"技术人闲聊，硬核但有料，了解工程师怎么想事情。" },
    { t:"硬地骇客", host:"独立开发者", tag:"科技", where:"小宇宙", d:"独立开发者与出海故事，适合想做产品 / 副业的人。" },
    { t:"科技乱炖", host:"科技乱炖", tag:"科技", where:"小宇宙", d:"轻松聊科技圈新鲜事，不烧脑的科技陪伴。" },
    // 文化 / 故事
    { t:"故事 FM", host:"故事 FM", tag:"文化", where:"小宇宙", d:"普通人的真实人生故事，声音温柔，适合睡前听。" },
    { t:"日谈公园", host:"日谈公园", tag:"文化", where:"小宇宙", d:"轻松有梗的文化聊天，像和朋友瞎侃一下午。" },
    { t:"忽左忽右", host:"忽左忽右", tag:"文化", where:"小宇宙", d:"每期一个话题深聊，历史、社会、文化都能听出味道。" },
    { t:"随机波动", host:"随机波动", tag:"文化", where:"小宇宙", d:"三位主播聊书、电影与社会，女性视角的清醒对话。" },
    { t:"不合时宜", host:"不合时宜", tag:"文化", where:"小宇宙", d:"聊时代与个体的关系，适合想多想一点的人。" },
    // 生活 / 创作
    { t:"杯弓舌瘾", host:"杯弓舌瘾", tag:"生活", where:"小宇宙", d:"讲酒与生活的文化节目，有趣又有知识量。" },
    { t:"展开讲讲", host:"展开讲讲", tag:"文化", where:"小宇宙", d:"聊影视与流行文化，放松时听很舒服。" },
    { t:"螺丝在拧紧", host:"螺丝在拧紧", tag:"文化", where:"小宇宙", d:"文化访谈类节目，聊创作者的思考方式。" }
  ];

  const fallbackPodcasts = {
    date:"", note:"这是内置示例内容。开启每日 09:00 自动推送后，这里会替换成当天精选。",
    theme:"先从一档开始，不用贪多",
    items:[
      { t:"知行小酒馆", host:"有知有行", tag:"理财", where:"小宇宙", d:"把「好好赚钱、好好生活」讲透，新手最友好的理财播客。", why:"想理财但怕术语？这档从理念讲起，不焦虑。" },
      { t:"BBC 6 Minute English", host:"BBC Learning English", tag:"英语", where:"苹果播客", d:"每期 6 分钟聊一个话题，附实用词汇，雅思听力磨耳朵神器。", why:"每天通勤听一期，顺手把听力练了。" },
      { t:"故事 FM", host:"故事 FM", tag:"文化", where:"小宇宙", d:"普通人的真实人生故事，声音温柔，适合睡前听。", why:"累了的时候，听别人的故事很治愈。" }
    ]
  };


  return { quotes, books, finance, finPath, cats, incomeCats, ieltsScenes, ieltsWords,
           listening, recipes, quests, badges, editTips, mediaPath, monetize,
           scriptFrame, fallbackTrends, fallbackNews,
           stockBasics, stockMoves, stockNews, stockSources,
           podcasts, fallbackPodcasts,
           museTypes };
})();
