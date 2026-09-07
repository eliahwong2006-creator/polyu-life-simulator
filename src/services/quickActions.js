// src/services/quickActions.js
// Pre-programmed life events that modify multiple attributes at once

export const quickActions = [
  {
    id: 'partTimeJob',
    label: '💼 Part-time Job',
    requirements: { strength: 3 }, // Admin checks manually
    effects: { money: +200, energy: -2, sanity: -1 },
    announcement: 'Player X got a part-time job! 💼',
  },
  {
    id: 'studySession',
    label: '📚 Study Session',
    requirements: {},
    effects: { wisdom: +2, energy: -1 },
    announcement: 'Player X hit the books! 📚',
  },
  {
    id: 'gymWorkout',
    label: '🏋️ Gym Workout',
    requirements: { energy: 2 },
    effects: { strength: +2, energy: -1, sanity: +1 },
    announcement: 'Player X is getting gains! 💪',
  },
  {
    id: 'socialEvent',
    label: '🎉 Social Event',
    requirements: { money: 50 },
    effects: { social: +2, energy: -1, money: -50 },
    announcement: 'Player X is networking! 🎉',
  },
  {
    id: 'mentalBreak',
    label: '🧘 Mental Break',
    requirements: {},
    effects: { sanity: +2, energy: -1 },
    announcement: 'Player X is practicing self-care! 🧘',
  },
  {
    id: 'coffeeBreak',
    label: '☕ Coffee Break',
    requirements: { money: 20 },
    effects: { energy: +1, money: -20 },
    announcement: 'Player X grabbed a coffee! ☕',
  },
  {
    id: 'allNighter',
    label: '💊 All-Nighter',
    requirements: { energy: 2 },
    effects: { wisdom: +3, sanity: -3, energy: -2 },
    announcement: 'Player X pulled an all-nighter! 😱',
  },
];