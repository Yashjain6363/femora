import { prisma } from '../config/prisma';
import { createError } from '../middleware/errorHandler';
import type { CreateCravingInput, UpdateCravingInput } from '../validations/resources.validation';

// Rule-based wellness suggestions (NOT medical advice)
const CRAVING_SUGGESTIONS: Record<string, string[]> = {
  SWEET: [
    'Try a piece of fresh fruit — natural sugars with fiber',
    'Greek yogurt with honey can satisfy a sweet craving',
    'A handful of dates or dried mango is a nutritious alternative',
    'Dark chocolate (70%+) in small amounts can help',
  ],
  SALTY: [
    'Handful of roasted nuts — healthy fats and satisfying saltiness',
    'Hummus with veggie sticks is a great savory option',
    'Try air-popped popcorn with a pinch of sea salt',
    'Edamame with light salt is protein-rich and satisfying',
  ],
  SOUR: [
    'Lemon water or kombucha can satisfy sour cravings',
    'Plain yogurt with a squeeze of citrus',
    'Pickled vegetables (in moderation) as a snack',
  ],
  SPICY: [
    'Homemade spiced chickpeas are a healthy spicy option',
    'Jalapeño-infused hummus with whole grain crackers',
    "Try a warming ginger tea if it's a warmth craving",
  ],
  FATTY: [
    'Avocado on whole grain toast — healthy monounsaturated fats',
    'A small handful of mixed nuts or nut butter',
    'Salmon or tuna provides healthy omega-3 fatty acids',
  ],
  CARBS: [
    'Sweet potato is a nutritious complex carb option',
    'Whole grain crackers with hummus or nut butter',
    'Oatmeal with fruits is filling and energy-sustaining',
  ],
  PROTEIN: [
    'Hard-boiled eggs are convenient and protein-rich',
    'Greek yogurt or cottage cheese',
    'Edamame or lentil soup for plant-based protein',
  ],
  DAIRY: [
    'Low-fat Greek yogurt with granola',
    'A small serving of cheese with whole grain crackers',
    'Warm turmeric milk (golden milk) as a nourishing option',
  ],
  FRUITS: [
    'Seasonal fresh fruit is always a great choice',
    'Frozen fruit smoothie with no added sugar',
    'Fruit salad with a drizzle of honey and mint',
  ],
  OTHER: [
    'Stay hydrated — sometimes cravings are actually thirst',
    'A short walk can help reset craving signals',
    'Try mindful eating: pause before reaching for a snack',
  ],
};

export const cravingService = {
  async getAll(userId: string, limit = 100) {
    const entries = await prisma.cravingEntry.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
      take: limit,
    });

    // Aggregate top cravings by category
    const categoryCounts: Record<string, number> = {};
    for (const entry of entries) {
      categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
    }

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    return { entries, topCategories };
  },

  async getSuggestions(category: string) {
    const suggestions = CRAVING_SUGGESTIONS[category] || CRAVING_SUGGESTIONS['OTHER'];
    return {
      category,
      suggestions,
      disclaimer: 'These are general wellness suggestions, not medical advice.',
    };
  },

  async create(userId: string, input: CreateCravingInput) {
    return prisma.cravingEntry.create({
      data: {
        userId,
        food: input.food,
        category: input.category,
        intensity: input.intensity,
        mood: input.mood,
        notes: input.notes,
        loggedAt: input.loggedAt ? new Date(input.loggedAt) : new Date(),
      },
    });
  },

  async update(userId: string, id: string, input: UpdateCravingInput) {
    const existing = await prisma.cravingEntry.findFirst({ where: { id, userId } });
    if (!existing) throw createError('Craving entry not found', 404);

    return prisma.cravingEntry.update({
      where: { id },
      data: {
        ...(input.food && { food: input.food }),
        ...(input.category && { category: input.category }),
        ...(input.intensity !== undefined && { intensity: input.intensity }),
        ...(input.mood !== undefined && { mood: input.mood }),
        ...(input.notes !== undefined && { notes: input.notes }),
        ...(input.loggedAt && { loggedAt: new Date(input.loggedAt) }),
      },
    });
  },

  async delete(userId: string, id: string) {
    const existing = await prisma.cravingEntry.findFirst({ where: { id, userId } });
    if (!existing) throw createError('Craving entry not found', 404);
    await prisma.cravingEntry.delete({ where: { id } });
    return { message: 'Craving entry deleted' };
  },
};
