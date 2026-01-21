"use client";

import { useState } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const suggestedPrompts = [
    "Summarize your experience in 30 seconds",
    "What projects match a Senior PM role?",
    "What's your Snowflake/dbt experience?",
    "What industries have you worked in?",
];

export default function ResumeChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (promptText?: string) => {
        const messageText = promptText || input;
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: messageText };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/resume-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) throw new Error("Failed to get response");

            const data = await response.json();
            const assistantMessage: Message = {
                role: "assistant",
                content: data.reply,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I encountered an error. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-normal text-base">Chat with my Resume</h3>
                <p className="text-xs text-gray-600 mt-1">
                    Ask me anything about my experience
                </p>
            </div>

            {/* Suggested Prompts (if no messages) */}
            {messages.length === 0 && (
                <div className="p-4 space-y-2">
                    <p className="text-sm text-gray-600 mb-3">Try asking:</p>
                    {suggestedPrompts.map((prompt) => (
                        <button
                            key={prompt}
                            onClick={() => handleSend(prompt)}
                            className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[85%] px-4 py-2 rounded-lg text-sm ${message.role === "user"
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-600">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask anything about my background..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
