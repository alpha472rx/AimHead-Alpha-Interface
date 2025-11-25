'use server';
/**
 * @fileOverview A Genkit flow for optimizing aim-assist settings based on gameplay data.
 *
 * - optimizeSettingsFromGameplay - A function that optimizes aim-assist settings based on gameplay data.
 * - OptimizeSettingsInput - The input type for the optimizeSettingsFromGameplay function.
 * - OptimizeSettingsOutput - The return type for the optimizeSettingsFromGameplay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeSettingsInputSchema = z.object({
  gameplayData: z.string().describe('A string containing gameplay data, including metrics like accuracy, target acquisition time, and K/D ratio.'),
});
export type OptimizeSettingsInput = z.infer<typeof OptimizeSettingsInputSchema>;

const OptimizeSettingsOutputSchema = z.object({
  fov: z.number().describe('The optimized field of view (FOV) setting.'),
  sensitivityMultiplier: z.number().describe('The optimized sensitivity multiplier setting.'),
});
export type OptimizeSettingsOutput = z.infer<typeof OptimizeSettingsOutputSchema>;

export async function optimizeSettingsFromGameplay(input: OptimizeSettingsInput): Promise<OptimizeSettingsOutput> {
  return optimizeSettingsFromGameplayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeSettingsPrompt',
  input: {schema: OptimizeSettingsInputSchema},
  output: {schema: OptimizeSettingsOutputSchema},
  prompt: `You are an expert in optimizing aim-assist settings for video games. Analyze the provided gameplay data and suggest optimized settings for FOV and sensitivity multiplier.

Gameplay Data: {{{gameplayData}}}

Consider the following:
- Higher accuracy generally indicates a smaller FOV and/or lower sensitivity might be beneficial.
- Faster target acquisition time suggests the current settings are good, but could be fine-tuned.
- A high K/D ratio indicates effective aim, but further optimization is always possible.

Provide the optimized FOV and sensitivity multiplier settings in the output.  The FOV should be between 5 and 15. The sensitivityMultiplier should be between 0.5 and 1.5.
`,
});

const optimizeSettingsFromGameplayFlow = ai.defineFlow(
  {
    name: 'optimizeSettingsFromGameplayFlow',
    inputSchema: OptimizeSettingsInputSchema,
    outputSchema: OptimizeSettingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
