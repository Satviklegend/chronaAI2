// Gemini AI integration — replaces OpenAI with Google's Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export interface AnalysisResult {
  productivityScore: number
  summary: string
  suggestions: string[]
  timeBreakdown: Record<string, number>
  overloadWarning: boolean
  balanceScore: number
  focusBlocks: string[]
}

export interface AutoScheduleResult {
  scheduledEvents: { title: string; startTime: string; endTime: string; category: string; priority: string }[]
  message: string
}

/** Full weekly schedule analysis using Gemini */
export async function analyzeSchedule(events: any[], goals: any[], habits: any[], weekStart: string): Promise<AnalysisResult> {
  const prompt = `You are ChronaAI, an elite productivity coach and scheduling analyst.

Analyze this user's weekly schedule and provide deep insights.

WEEK: ${weekStart}
EVENTS: ${JSON.stringify(events)}
GOALS: ${JSON.stringify(goals)}
HABITS: ${JSON.stringify(habits)}

Analyze for:
1. Time distribution across categories
2. Peak-hour alignment (deep work in morning?)
3. Schedule density and overload risk
4. Goal-calendar alignment
5. Work-life balance
6. Missing critical blocks (exercise, recovery, focus)

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "productivityScore": <0-100>,
  "summary": "<2-3 sentence personalized weekly overview>",
  "suggestions": ["<specific tip 1>","<specific tip 2>","<specific tip 3>","<specific tip 4>","<specific tip 5>"],
  "timeBreakdown": {"work":<hours>,"personal":<hours>,"health":<hours>,"social":<hours>,"learning":<hours>,"unscheduled":<hours>},
  "overloadWarning": <true|false>,
  "balanceScore": <0-100>,
  "focusBlocks": ["<time recommendation 1>","<time recommendation 2>"]
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().replace(/```json|```/g, '').trim()
  return JSON.parse(text) as AnalysisResult
}

/** AI auto-scheduling: distribute a goal across available slots */
export async function autoScheduleGoal(goalTitle: string, hoursNeeded: number, existingEvents: any[], sessionDuration: number, weekStart: string): Promise<AutoScheduleResult> {
  const prompt = `You are ChronaAI scheduler. Auto-schedule a goal into the user's calendar.

GOAL: "${goalTitle}"
HOURS NEEDED: ${hoursNeeded}
SESSION LENGTH: ${sessionDuration} minutes
WEEK STARTING: ${weekStart}
EXISTING EVENTS (avoid conflicts): ${JSON.stringify(existingEvents)}

Rules:
- Achieve exactly ${hoursNeeded} hours total
- Never overlap existing events
- Prefer morning slots (8-12) for focus work
- Spread sessions across different days
- Add 15min buffer between sessions

Respond ONLY with valid JSON:
{
  "scheduledEvents": [
    {"title":"${goalTitle} — Session 1","startTime":"<ISO8601>","endTime":"<ISO8601>","category":"learning","priority":"high"}
  ],
  "message": "<brief friendly message about the schedule>"
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().replace(/```json|```/g, '').trim()
  return JSON.parse(text) as AutoScheduleResult
}

/** Quick single-event insight when user creates an event */
export async function getQuickInsight(event: any, dayEvents: any[]): Promise<string> {
  const prompt = `You are ChronaAI. Give ONE concise insight (1-2 sentences max) about this new event's timing and fit.
NEW EVENT: ${JSON.stringify(event)}
OTHER EVENTS TODAY: ${JSON.stringify(dayEvents)}
Be specific and helpful. No preamble.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}
