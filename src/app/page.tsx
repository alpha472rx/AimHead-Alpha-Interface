'use client';

import { useState, useEffect, useTransition } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { runOptimization, type ActionState } from './actions';
import { Cpu, Loader2, MousePointer, ScanLine, Settings, Sigma } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


const CrosshairVisualizer = ({ isActive }: { isActive: boolean }) => (
  <div
    className={cn(
      'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none transition-opacity duration-300',
      isActive ? 'opacity-100' : 'opacity-0'
    )}
  >
    <div className="relative flex items-center justify-center w-8 h-8">
      <div className={cn("absolute w-0.5 h-3 bg-primary transition-all duration-300", isActive && 'shadow-[0_0_5px_theme(colors.primary)]')} />
      <div className={cn("absolute w-3 h-0.5 bg-primary transition-all duration-300", isActive && 'shadow-[0_0_5px_theme(colors.primary)]')} />
    </div>
  </div>
);

const SettingRow = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
  <div className="flex items-center justify-between py-3 text-sm">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span>{label}:</span>
    </div>
    <span className="font-bold text-primary">{value}</span>
  </div>
);

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin" /> : <Sigma />}
      Optimize with AI
    </Button>
  );
}

export default function AimHeadPage() {
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState({ fov: 8.5, sensitivity: 0.7 });
  const { toast } = useToast();

  const initialState: ActionState = {};
  const [state, formAction] = useFormState(runOptimization, initialState);

  const form = useForm({
      defaultValues: { gameplayData: '' },
  });

  useEffect(() => {
    if (state.message) {
      toast({ title: "Success", description: state.message });
      if (state.fov !== undefined && state.sensitivityMultiplier !== undefined) {
        setSettings({
          fov: parseFloat(state.fov.toFixed(2)),
          sensitivity: parseFloat(state.sensitivityMultiplier.toFixed(2)),
        });
      }
      form.reset();
    }
    if (state.error) {
      toast({ variant: 'destructive', title: 'Error', description: state.error });
    }
  }, [state, toast, form]);

  const toggleSystem = () => setIsActive((prev) => !prev);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F9') {
        event.preventDefault();
        toggleSystem();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 overflow-hidden">
      <CrosshairVisualizer isActive={isActive} />
      <Card className="w-full max-w-md z-10 border-border shadow-[0_0_30px_rgba(0,255,153,0.1)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary uppercase tracking-widest">
            𝐚𝐥𝐩𝐡𝐚 Aim Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between p-3 rounded-md bg-card">
            <span className="font-semibold">System Status:</span>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'h-3 w-3 rounded-full transition-all duration-300',
                  isActive
                    ? 'bg-primary animate-pulse-green'
                    : 'bg-destructive animate-pulse-red'
                )}
              />
              <span
                className={cn(
                  'font-bold uppercase tracking-wider',
                  isActive ? 'text-primary' : 'text-destructive'
                )}
              >
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <div className="space-y-1 rounded-md bg-card p-3">
            <SettingRow icon={<ScanLine size={16}/>} label="Target Mode" value="Head/Neck Priority" />
            <Separator className="bg-border/50" />
            <SettingRow icon={<Settings size={16}/>} label="Field of View (FOV)" value={`${settings.fov}°`} />
            <Separator className="bg-border/50" />
            <SettingRow icon={<Sigma size={16}/>} label="Sensitivity Multiplier" value={`${settings.sensitivity}x`} />
            <Separator className="bg-border/50" />
            <SettingRow icon={<MousePointer size={16}/>} label="Trigger Key" value="LMB (Mouse1)" />
          </div>

          <Button
            onClick={toggleSystem}
            variant={isActive ? 'default' : 'destructive'}
            className="mt-4 w-full font-bold uppercase tracking-wider"
          >
            {isActive ? 'Deactivate System' : 'Activate System'} (F9)
          </Button>

          <Separator className="my-4 border-dashed" />
          
          <Form {...form}>
            <form action={formAction} className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Cpu />
                <span>Dynamic Parameter Adjustment</span>
              </div>
              <FormField
                control={form.control}
                name="gameplayData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gameplay Data Input</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your gameplay data here (e.g., accuracy stats, K/D ratio, target acquisition times, etc.) for AI-powered optimization."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton />
            </form>
          </Form>

        </CardContent>
      </Card>
    </main>
  );
}
