import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { addDays, startOfWeek, setHours, setMinutes } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding ChronaAI database...')

  const user = await prisma.user.upsert({
    where: { email: 'demo@chrona.ai' },
    update: {},
    create: {
      email: 'demo@chrona.ai',
      name: 'Demo User',
      password: await bcrypt.hash('demo12345', 12),
      timezone: 'America/New_York',
    },
  })
  console.log('✅ User:', user.email)

  await Promise.all([
    prisma.goal.create({ data: { userId: user.id, title: 'Complete ML Course', type: 'long-term', category: 'learning', targetDate: addDays(new Date(), 60), hoursPerWeek: 8, progress: 35, status: 'active' } }),
    prisma.goal.create({ data: { userId: user.id, title: 'Run 5K in 25min', type: 'short-term', category: 'fitness', targetDate: addDays(new Date(), 30), hoursPerWeek: 4, progress: 60, status: 'active' } }),
    prisma.goal.create({ data: { userId: user.id, title: 'Launch side project', type: 'long-term', category: 'work', targetDate: addDays(new Date(), 90), hoursPerWeek: 10, progress: 20, status: 'active' } }),
  ])
  console.log('✅ Goals seeded')

  await Promise.all([
    prisma.habit.create({ data: { userId: user.id, name: 'Morning meditation', frequency: 'daily', timeOfDay: 'morning', duration: 15, streak: 7 } }),
    prisma.habit.create({ data: { userId: user.id, name: 'Evening reading', frequency: 'daily', timeOfDay: 'evening', duration: 30, streak: 14 } }),
    prisma.habit.create({ data: { userId: user.id, name: 'Weekly review', frequency: 'weekly', timeOfDay: 'morning', duration: 60, streak: 3 } }),
  ])
  console.log('✅ Habits seeded')

  const ws = startOfWeek(new Date(), { weekStartsOn: 1 })
  const mkTime = (day: number, h: number, m = 0) => setMinutes(setHours(addDays(ws, day), h), m)

  const eventsData = [
    { title: 'Team standup', day: 0, sh: 9, sm: 0, eh: 9, em: 30, cat: 'work', pri: 'medium' },
    { title: 'Deep work: ML course', day: 0, sh: 10, sm: 0, eh: 12, em: 0, cat: 'learning', pri: 'high' },
    { title: 'Lunch break', day: 0, sh: 12, sm: 30, eh: 13, em: 30, cat: 'personal', pri: 'low' },
    { title: 'Morning run', day: 1, sh: 7, sm: 0, eh: 7, em: 45, cat: 'fitness', pri: 'high' },
    { title: 'Product roadmap', day: 1, sh: 10, sm: 0, eh: 11, em: 30, cat: 'work', pri: 'high' },
    { title: 'ML lecture', day: 1, sh: 14, sm: 0, eh: 16, em: 0, cat: 'learning', pri: 'high' },
    { title: 'Doctor appointment', day: 2, sh: 9, sm: 0, eh: 10, em: 0, cat: 'health', pri: 'high' },
    { title: 'Team standup', day: 2, sh: 10, sm: 30, eh: 11, em: 0, cat: 'work', pri: 'medium' },
    { title: 'Side project coding', day: 2, sh: 14, sm: 0, eh: 17, em: 0, cat: 'work', pri: 'high' },
    { title: 'Morning run', day: 3, sh: 7, sm: 0, eh: 7, em: 45, cat: 'fitness', pri: 'high' },
    { title: 'Client presentation', day: 3, sh: 11, sm: 0, eh: 12, em: 0, cat: 'work', pri: 'high' },
    { title: '1:1 with manager', day: 3, sh: 15, sm: 0, eh: 16, em: 0, cat: 'work', pri: 'medium' },
    { title: 'Gym session', day: 4, sh: 7, sm: 0, eh: 8, em: 30, cat: 'fitness', pri: 'high' },
    { title: 'Team standup', day: 4, sh: 9, sm: 0, eh: 9, em: 30, cat: 'work', pri: 'medium' },
    { title: 'Code review', day: 4, sh: 10, sm: 0, eh: 11, em: 30, cat: 'work', pri: 'medium' },
    { title: 'Weekly planning', day: 4, sh: 16, sm: 0, eh: 17, em: 0, cat: 'personal', pri: 'medium' },
  ]

  await Promise.all(eventsData.map(e =>
    prisma.event.create({
      data: { userId: user.id, title: e.title, startTime: mkTime(e.day, e.sh, e.sm), endTime: mkTime(e.day, e.eh, e.em), category: e.cat, priority: e.pri, status: 'scheduled' },
    })
  ))
  console.log('✅ Events seeded:', eventsData.length)

  await prisma.notification.create({
    data: { userId: user.id, title: '🚀 Welcome to ChronaAI', message: 'Your intelligent time OS is ready. Run your first AI analysis to get insights!', type: 'insight' },
  })

  console.log('\n🎉 Seeding complete!')
  console.log('   Email:    demo@chrona.ai')
  console.log('   Password: demo12345')
}

main().catch(console.error).finally(() => prisma.$disconnect())
