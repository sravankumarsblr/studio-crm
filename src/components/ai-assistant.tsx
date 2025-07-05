"use client";

import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import { Bot, Loader2, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAssistantResponse } from "@/app/actions/chat";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: "smooth"
        });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: nanoid(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
        const assistantResponse = await getAssistantResponse(input);
        const assistantMessage: Message = { id: nanoid(), role: 'assistant', content: assistantResponse };
        setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to get a response from the assistant.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg">
          <Bot className="h-7 w-7" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-96 p-0">
        <Card className="shadow-none border-none">
          <CardHeader className="border-b">
            <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96" ref={scrollAreaRef as any}>
                <div className="p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                        Ask about your sales pipeline or to create new items.
                    </div>
                )}
                {messages.map(m => (
                    <div key={m.id} className={cn("flex items-start gap-3", m.role === 'user' ? 'justify-end' : '')}>
                        {m.role === 'assistant' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <Bot className="h-5 w-5" />
                            </div>
                        )}
                        <div className={cn(
                            "p-3 rounded-lg max-w-xs", 
                            m.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                        )}>
                            <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        </div>
                         {m.role === 'user' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                                <User className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-2 border-t">
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="e.g., What is my conversion rate?"
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
