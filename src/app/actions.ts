'use server';

import { z } from 'zod';
import { optimizeSettingsFromGameplay } from '@/ai/flows/optimize-settings-from-gameplay';

const ActionInputSchema = z.object({
  gameplayData: z.string().min(50, "Please provide at least 50 characters of gameplay data for an effective analysis."),
});

export type ActionState = {
  fov?: number;
  sensitivityMultiplier?: number;
  error?: string;
  message?: string;
}

export async function runOptimization(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const validatedFields = ActionInputSchema.safeParse({
    gameplayData: formData.get('gameplayData'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.gameplayData?.[0] || "Invalid input.",
    };
  }

  try {
    const result = await optimizeSettingsFromGameplay({ gameplayData: validatedFields.data.gameplayData });
    return {
      fov: result.fov,
      sensitivityMultiplier: result.sensitivityMultiplier,
      message: "Settings optimized successfully!",
    };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return {
      error: `AI Optimization Failed: ${errorMessage}`,
    };
  }
}
