'use client';

import { Settings2 } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Assuming you have shadcn/ui or similar
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AI_MODELS, ChatConfig } from "@/types/types";

interface ChatSettingsProps {
  config: ChatConfig;
  onConfigChange: (config: ChatConfig) => void;
  disabled?: boolean;
}

export function ChatSettings({ config, onConfigChange, disabled }: ChatSettingsProps) {
  
  const updateConfig = (key: keyof ChatConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" disabled={disabled}>
          <Settings2 className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Model Configuration</h4>
          
          {/* Model Select */}
          <div className="space-y-2">
            <Label>Model</Label>
            <Select 
              value={config.model} 
              onValueChange={(val) => updateConfig('model', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model.split(':')[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Temperature</Label>
              <span className="text-xs text-muted-foreground">{config.temperature}</span>
            </div>
            <Slider
              value={[config.temperature]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([val]) => updateConfig('temperature', val)}
            />
          </div>

          {/* Top P */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Top P</Label>
              <span className="text-xs text-muted-foreground">{config.top_p}</span>
            </div>
            <Slider
              value={[config.top_p]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([val]) => updateConfig('top_p', val)}
            />
          </div>

           {/* Max Tokens */}
           <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Max Tokens</Label>
              <span className="text-xs text-muted-foreground">{config.max_tokens}</span>
            </div>
            <Slider
              value={[config.max_tokens]}
              min={100}
              max={4000}
              step={100}
              onValueChange={([val]) => updateConfig('max_tokens', val)}
            />
          </div>

         
        </div>
      </PopoverContent>
    </Popover>
  );
}