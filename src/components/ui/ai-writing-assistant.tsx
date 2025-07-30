'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';


interface AIWritingAssistantProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  context: 'symptoms' | 'emergency' | 'consultation' | 'mental-health';
  userProfile?: {
    age: number;
    gender: string;
    conditions: string[];
    healthProfile: string;
  };
}

export function AIWritingAssistant({ 
  value, 
  onChange, 
  placeholder, 
  context,
  userProfile 
}: AIWritingAssistantProps) {
  const [isImproving, setIsImproving] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const getContextPrompt = () => {
    const profileInfo = userProfile ? 
      `Patient profile: ${userProfile.age}yo ${userProfile.gender}, health profile: ${userProfile.healthProfile}, conditions: ${userProfile.conditions.join(', ')}` : '';
    
    switch (context) {
      case 'symptoms':
        return `Help improve this symptom description for medical assessment. ${profileInfo}. Make it more specific, include timing, severity, and relevant details:`;
      case 'emergency':
        return `Improve this emergency description for triage. ${profileInfo}. Focus on urgency, specific symptoms, and timeline:`;
      case 'consultation':
        return `Enhance this consultation request. ${profileInfo}. Include relevant medical history and specific concerns:`;
      case 'mental-health':
        return `Improve this mental health description. Focus on feelings, duration, triggers, and impact on daily life:`;
      default:
        return 'Improve this medical description:';
    }
  };

  const improveDescription = async () => {
    if (!value.trim()) return;
    
    setIsImproving(true);
    try {
      const prompt = `${getContextPrompt()}\n\nOriginal: "${value}"\n\nProvide an improved version that is more medically accurate and detailed:`;
      
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, temperature: 0.3 })
      });
      
      const data = await response.json();
      if (data.text) {
        onChange(data.text);
      } else if (data.error) {
        setSuggestions([data.fallback || 'AI service temporarily unavailable. Please continue with your description.']);
      }
    } catch (error) {
      console.error('AI improvement failed:', error);
      if ((error as Error).name === 'TypeError' && (error as Error).message.includes('fetch')) {
        setSuggestions(['Network error. Please check your connection and try again.']);
      } else {
        setSuggestions(['AI service temporarily unavailable. Please continue with your description.']);
      }
    } finally {
      setIsImproving(false);
    }
  };

  const getSuggestions = async () => {
    setIsImproving(true);
    try {
      const prompt = `${getContextPrompt()}\n\nCurrent text: "${value}"\n\nProvide 3 short suggestions to improve this description. Format as: "1. suggestion" "2. suggestion" "3. suggestion":`;
      
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, temperature: 0.5 })
      });
      
      const data = await response.json();
      if (data.text) {
        const suggestionList = data.text.split(/\d+\./).filter((s: string) => s.trim()).map((s: string) => s.trim());
        setSuggestions(suggestionList.slice(0, 3));
      } else if (data.error) {
        setSuggestions([data.fallback || 'AI service temporarily unavailable']);
      }
    } catch (error) {
      console.error('AI suggestions failed:', error);
      if ((error as Error).name === 'TypeError' && (error as Error).message.includes('fetch')) {
        setSuggestions(['Network error. Please check your connection and try again.']);
      } else {
        setSuggestions(['AI service temporarily unavailable']);
      }
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px] pr-12"
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={value.trim() ? improveDescription : getSuggestions}
          disabled={isImproving}
        >
          {isImproving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 text-blue-500" />
          )}
        </Button>
      </div>
      
      {suggestions.length > 0 && (
        <Card className="p-3 bg-blue-50 border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-2">AI Suggestions:</p>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="text-xs text-blue-700 hover:text-blue-900 block text-left w-full p-1 hover:bg-blue-100 rounded"
                onClick={() => {
                  onChange(value + (value ? ' ' : '') + suggestion);
                  setSuggestions([]);
                }}
              >
                • {suggestion}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}