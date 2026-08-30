// Modelling Coach — vetted templates (Architecture §7: templates first, LLM later).
// Each opportunity: [title, one-step instruction, why it's natural] in EN and ZH.

import type { Lang, TherapyFocus } from '../types'

type Tip = { title: [string, string]; step: [string, string]; why: [string, string] }

const T = (title: [string, string], step: [string, string], why: [string, string]): Tip => ({ title, step, why })

const OPPORTUNITIES: Record<string, Record<string, Tip[]>> = {
  help: {
    breakfast: [
      T(['A lid that is actually stuck', '一个真的打不开的盖子'], ['Hand over the sealed yoghurt or cereal box, then wait.', '递给她密封的酸奶或麦片盒，然后等待。'], ['She wants what is inside, so asking for help changes something real.', '她想要里面的东西，所以求助会带来真实的改变。']),
      T(['Spoon out of reach', '勺子够不到'], ['Put the spoon where she can see it but not reach it. Model help once.', '把勺子放在她看得到但够不到的地方。示范一次“帮忙”。'], ['A visible problem invites a request without you asking a question.', '看得见的问题会引发请求，而不需要你提问。']),
      T(['Pour a little, then pause', '倒一点，然后停下'], ['Pour a small amount of milk, hold the carton, and wait.', '倒一点牛奶，拿着盒子，等待。'], ['Pausing mid-routine is the gentlest way to create a need.', '在日常中途停顿是创造需求最温和的方式。']),
    ],
    play: [
      T(['Toy in a clear container', '玩具在透明盒子里'], ['Put a favourite toy in a container she cannot open. Set it beside her.', '把喜欢的玩具放进她打不开的盒子里，放在她旁边。'], ['She can see the goal and the obstacle at the same time.', '她能同时看到目标和障碍。']),
      T(['Bubbles with the lid on', '盖着盖子的泡泡水'], ['Blow bubbles once, close the lid, hand it over.', '吹一次泡泡，盖上盖子，递给她。'], ['The first blow shows what is possible; the lid creates the reason.', '第一次吹泡泡展示了可能性；盖子创造了理由。']),
      T(['Swing that needs a push', '需要推的秋千'], ['Give one push, then step back and wait quietly.', '推一下，然后退后安静等待。'], ['Wanting more motion is a strong, natural motivator.', '想要继续摇动是强烈而自然的动力。']),
      T(['Wind-up toy stops', '发条玩具停了'], ['Let it run down. Do not restart it until there is a request or a clear look.', '让它停下。在有请求或明确眼神前不要重新启动。'], ['The toy stopping is the cue; you do not need to say anything.', '玩具停下就是提示；你不需要说什么。']),
    ],
    school: [
      T(['Zip or buckle she finds hard', '她觉得难的拉链或扣子'], ['Start the zip a little, then hand it back and wait.', '拉开一点拉链，然后递回去等待。'], ['A task she already wants to finish is a better opportunity than a worksheet.', '她已经想完成的任务比作业更好。']),
      T(['Water bottle with a tight cap', '瓶盖很紧的水壶'], ['Keep the bottle capped at drink time. Model help once on the same card.', '喝水时保持瓶盖拧紧。在同一张卡上示范一次“帮忙”。'], ['Same card, same position as home. School should not feel like a different system.', '和家里相同的卡片和位置。学校不应感觉像另一套系统。']),
      T(['Paper stuck in a folder', '卡在文件夹里的纸'], ['Leave the sheet half in. Wait, then model.', '让纸留一半在里面。等待，然后示范。'], ['Small, real frustrations are the most honest reasons to ask.', '小而真实的困扰是最诚实的求助理由。']),
    ],
    wake: [
      T(['Sleeve inside out', '袖子翻过来了'], ['Offer the jumper with one sleeve inside out. Wait before fixing it.', '递给她一只袖子翻过来的毛衣。修好前先等待。'], ['Dressing already involves helping; this just adds a pause.', '穿衣本来就需要帮忙；这只是加了一个停顿。']),
      T(['Light switch too high', '灯的开关太高'], ['Stand near the switch and wait for a look or a tap.', '站在开关旁等待眼神或点击。'], ['She knows what she wants; you are making space for her to say it.', '她知道自己想要什么；你在给她表达的空间。']),
    ],
    dinner: [
      T(['Cut-up food, then stop', '切开食物，然后停下'], ['Cut a few pieces, put the knife down, wait.', '切几块，放下刀，等待。'], ['A half-finished task is a natural, low-pressure reason to ask.', '未完成的任务是自然、低压力的求助理由。']),
      T(['Cup with a lid', '带盖子的杯子'], ['Serve the drink with the lid on. Model help once if needed.', '上饮料时盖上盖子。如果需要示范一次“帮忙”。'], ['Same as breakfast — repeating the pattern across scenes builds generalisation.', '和早餐一样——在不同场景重复模式有助于泛化。']),
    ],
  },
  more: {
    breakfast: [
      T(['Give a little at a time', '一次给一点'], ['Serve two spoonfuls, then pause with the bowl visible.', '给两勺，然后把碗放在看得见的地方停下。'], ['Small portions turn a meal into several natural requests.', '小份量把一餐变成多次自然的请求。']),
    ],
    play: [
      T(['Stop the fun thing', '停止有趣的事'], ['Tickle, spin or bounce once, then stop and wait.', '挠痒、转圈或弹跳一次，然后停下等待。'], ['Wanting more of a good thing is the easiest motivation there is.', '想要更多好东西是最简单的动力。']),
    ],
  },
  stop: {
    play: [
      T(['Offer a real choice to stop', '给一个真正的停止选择'], ['During rough play or tickling, model stop once and stop immediately.', '在打闹或挠痒时，示范一次“停”并立即停止。'], ['Stop must always work. That is what makes it worth using.', '“停”必须总是有效。这才值得使用。']),
    ],
  },
  no: {
    dinner: [
      T(['Offer something she does not want', '给她不想要的东西'], ['Hold out a food she usually refuses. Model no, then remove it.', '拿出她通常拒绝的食物。示范“不要”，然后拿走。'], ['Refusal is communication. Honouring it teaches the word means something.', '拒绝也是沟通。尊重它能让她知道这个词有意义。']),
    ],
  },
  go: {
    school: [
      T(['Pause at the door', '在门口停一下'], ['Stand at the door with shoes on. Wait for go, or a clear look.', '穿好鞋站在门口。等待“走”或明确的眼神。'], ['Transitions already have a beat; you are letting her start it.', '过渡本来就有节奏；你让她来开始。']),
    ],
  },
}

const GENERIC: Tip[] = [
  T(['Use a real moment', '用真实的时刻'], ['Find something in this scene that genuinely needs the word.', '在这个场景中找到真正需要这个词的事。'], ['Communication that changes something is the only kind worth practising.', '能改变什么的沟通才值得练习。']),
  T(['Model once', '示范一次'], ['Tap the word on the same card she sees, say it, then pause.', '在她看到的同一张卡上点击这个词，说出来，然后停顿。'], ['One clear model is enough. Repeating it becomes pressure.', '一次清楚的示范就够了。重复会变成压力。']),
  T(['Wait, then continue life', '等待，然后继续生活'], ['Give the wait time. If nothing comes, carry on and try later.', '给足等待时间。如果没有回应，继续生活，稍后再试。'], ['Not every moment has to be a communication moment.', '不是每一刻都必须是沟通时刻。']),
]

export function opportunitiesFor(conceptId: string, sceneId: string): Tip[] {
  const specific = OPPORTUNITIES[conceptId]?.[sceneId]
  if (specific && specific.length >= 2) return specific
  return [...(specific ?? []), ...GENERIC].slice(0, 4)
}

// Branching support when it does not go to plan (Product §8, Design §6).
export const WHAT_IF: { q: [string, string]; a: [string, string] }[] = [
  {
    q: ['She doesn’t tap', '她没有点击'],
    a: ['Model once, wait the full time, then accept any other clear communication — a look, a reach, a sound. If nothing, carry on with the routine and try later. Do not ask her to tap again.', '示范一次，等足时间，然后接受任何其他清楚的沟通——眼神、伸手、声音。如果没有，继续日常，稍后再试。不要要求她再点。'],
  },
  {
    q: ['She taps a different word', '她点了别的词'],
    a: ['Do not treat it as wrong. Ask yourself whether it made sense in the moment. Respond to it if it did. Then, if useful, model the target once.', '不要当作错误。想想在那一刻它是否有意义。如果有，回应它。然后如果有用，示范一次目标词。'],
  },
  {
    q: ['She taps many buttons', '她点了很多按钮'],
    a: ['Reduce pressure and complexity. Fewer scene words, calmer environment. Log it as unclear, not as failure, and look for patterns that repeat in the same context.', '减少压力和复杂度。更少的场景词，更安静的环境。记录为不明确，而不是失败，并寻找在相同情境中重复的模式。'],
  },
  {
    q: ['She gestures, looks, or leads your hand', '她用手势、眼神或拉你的手'],
    a: ['That is communication. Respond to it straight away. If it fits, model the symbol alongside — never instead of — what she just did.', '那就是沟通。立即回应。如果合适，在她刚才的方式旁边示范符号——而不是取代它。'],
  },
  {
    q: ['She walks away or gets upset', '她走开或不高兴'],
    a: ['Stop the attempt. Completion is never required. Her agency matters more than the opportunity. Log it as stopped if you like — it is useful information, not a fail.', '停止尝试。从不要求完成。她的自主比机会更重要。可以记录为停止——这是有用的信息，不是失败。'],
  },
  {
    q: ['How long should I wait?', '我应该等多久？'],
    a: ['Use the therapist’s wait time. It feels long. Count silently. Adjust only within what the plan allows.', '使用治疗师设定的等待时间。会感觉很长。默默数数。只在计划允许的范围内调整。'],
  },
]

export function focusPlainLanguage(f: TherapyFocus, lang: Lang, word: string, childName: string) {
  return lang === 'en'
    ? `This week we’re helping ${childName} use ${word.toUpperCase()}. Model it once, wait ${f.waitSeconds} seconds, and respond to any clear communication — not just a tap. Review on ${f.reviewDate}.`
    : `本周我们帮助 ${childName} 使用「${word}」。示范一次，等待 ${f.waitSeconds} 秒，回应任何清楚的沟通——不只是点击。${f.reviewDate} 复查。`
}
