import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Download, FileText, Users, RefreshCw, MessageSquare } from 'lucide-react';

const CognitiveTypologist = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('claudeApiKey') || '');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [cognitiveStack, setCognitiveStack] = useState(null);
  const [assessmentCount, setAssessmentCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const systemPrompt = `You are Jung-AI-n, an expert Jungian cognitive function analyst. Your role is to determine someone's cognitive stack through natural conversation.

CORE FRAMEWORK:
Carl Jung's 8 Cognitive Functions (not MBTI):
- Ti (Introverted Thinking): Internal logical framework
- Te (Extraverted Thinking): External efficiency and systems
- Fi (Introverted Feeling): Internal values and authenticity
- Fe (Extraverted Feeling): External harmony and social values
- Ni (Introverted Intuition): Abstract synthesis and patterns
- Ne (Extraverted Intuition): External possibilities and connections
- Si (Introverted Sensing): Internal experiences and memory
- Se (Extraverted Sensing): External sensory engagement

4-FUNCTION STACKS (examples):
Ti-Ne-Si-Fe (INTP), Te-Ni-Se-Fi (ENTJ), Fi-Ne-Si-Te (INFP), etc.

ASSESSMENT PROCESS:
1. Start with a warm, conversational greeting
2. Ask 3-5 strategic questions covering:
   - How they process information (Abstract/Concrete)
   - How they make decisions (Logic/Values)
   - What energizes them (Internal/External)
   - How they perceive the world
3. Ask follow-up questions based on responses
4. Once confident, provide the cognitive stack

OUTPUT FORMAT when complete:
After determining the type, respond with:
COGNITIVE_STACK: [XX-XX-XX-XX]
TYPE: [Full name like "Introverted Thinking with Extraverted Intuition"]
FUNCTIONS:
1. [Function] - [Description]
2. [Function] - [Description]
3. [Function] - [Description]
4. [Function] - [Description]

PROFILE:
[2-3 paragraph description of their cognitive approach]

Be warm, engaging, and insightful. Make the person feel understood.`;

  const startAssessment = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your Claude API key');
      return;
    }
    
    localStorage.setItem('claudeApiKey', apiKey);
    setSessionStarted(true);
    setMessages([]);
    setAssessmentComplete(false);
    setCognitiveStack(null);
    
    const welcomeMessage = {
      role: 'assistant',
      content: 'Welcome! I\'m Jung-AI-n, your cognitive function analyst. I\'ll help you discover your Jungian cognitive stack through a natural conversation. Ready to begin?'
    };
    
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputMessage };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt,
          messages: newMessages
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text
      };

      setMessages([...newMessages, assistantMessage]);

      // Check if assessment is complete
      if (assistantMessage.content.includes('COGNITIVE_STACK:')) {
        setAssessmentComplete(true);
        setAssessmentCount(prev => prev + 1);
        parseCognitiveStack(assistantMessage.content);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error communicating with Claude API. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseCognitiveStack = (content) => {
    const stackMatch = content.match(/COGNITIVE_STACK:\s*\[?([^\]]+)\]?/);
    const typeMatch = content.match(/TYPE:\s*(.+?)(?:\n|$)/);
    
    if (stackMatch) {
      setCognitiveStack({
        stack: stackMatch[1].trim(),
        type: typeMatch ? typeMatch[1].trim() : '',
        fullAnalysis: content
      });
    }
  };

  const newAssessment = () => {
    setSessionStarted(false);
    setMessages([]);
    setAssessmentComplete(false);
    setCognitiveStack(null);
  };

  const exportMarkdown = () => {
    let markdown = `# Jungian Cognitive Stack Assessment\n\n`;
    markdown += `**Assessment Date:** ${new Date().toLocaleString()}\n`;
    markdown += `**Session Number:** ${assessmentCount}\n\n`;
    markdown += `---\n\n## Conversation Transcript\n\n`;
    
    messages.forEach((msg, idx) => {
      const role = msg.role === 'user' ? 'You' : 'Jung-AI-n';
      markdown += `### ${role}:\n${msg.content}\n\n`;
    });

    if (cognitiveStack) {
      markdown += `---\n\n## Final Analysis\n\n`;
      markdown += cognitiveStack.fullAnalysis;
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognitive-stack-assessment-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF library not loaded. Please refresh the page.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPosition = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    const addText = (text, fontSize = 12, isBold = false) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }
      
      const lines = doc.splitTextToSize(text, 170);
      lines.forEach(line => {
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    };

    addText('Jungian Cognitive Stack Assessment', 18, true);
    yPosition += 5;
    addText(`Date: ${new Date().toLocaleString()}`, 10);
    yPosition += 10;

    if (cognitiveStack) {
      addText('Cognitive Stack Result', 16, true);
      yPosition += 3;
      addText(`Stack: ${cognitiveStack.stack}`, 14, true);
      addText(`Type: ${cognitiveStack.type}`, 12);
      yPosition += 10;
      
      addText('Full Analysis:', 14, true);
      yPosition += 3;
      addText(cognitiveStack.fullAnalysis.replace(/COGNITIVE_STACK:.*?\n/g, '').replace(/TYPE:.*?\n/g, ''), 10);
    }

    doc.save(`cognitive-stack-report-${Date.now()}.pdf`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Jung-AI-n</h1>
          </div>
          <p className="text-gray-600">Jungian Cognitive Stack Typologist</p>
          <p className="text-sm text-gray-500 mt-2">Discover your cognitive function stack through AI-powered analysis</p>
        </div>

        {!sessionStarted ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome</h2>
              <p className="text-gray-600 mb-4">
                Jung-AI-n uses Claude AI to conduct a personalized cognitive function assessment based on Carl Jung's theory,
                not MBTI. The conversation adapts to your responses to accurately identify your cognitive stack.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-indigo-600 mr-2 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Natural Conversation</h3>
                    <p className="text-sm text-gray-600">Answer 3-5 strategic questions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Brain className="w-5 h-5 text-indigo-600 mr-2 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">8-Function Analysis</h3>
                    <p className="text-sm text-gray-600">Complete cognitive stack profile</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-indigo-600 mr-2 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Export Options</h3>
                    <p className="text-sm text-gray-600">Download MD or PDF reports</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-indigo-600 mr-2 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Multiple Assessments</h3>
                    <p className="text-sm text-gray-600">Type multiple people</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Claude API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Your API key is stored locally and never sent to our servers.
                Get your key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">console.anthropic.com</a>
              </p>
            </div>

            <button
              onClick={startAssessment}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center"
            >
              <Brain className="w-5 h-5 mr-2" />
              Start Assessment
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Chat Area */}
            <div className="h-96 overflow-y-auto p-6 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block max-w-3/4 p-4 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-left">
                  <div className="inline-block bg-white text-gray-800 border border-gray-200 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="animate-pulse">Jung-AI-n is thinking...</div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex flex-wrap gap-2">
              <button
                onClick={exportMarkdown}
                disabled={messages.length === 0}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export MD
              </button>
              <button
                onClick={exportPDF}
                disabled={!assessmentComplete}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={newAssessment}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Assessment
              </button>
            </div>

            {/* Stats */}
            {assessmentCount > 0 && (
              <div className="border-t border-gray-200 p-4 bg-white text-center text-sm text-gray-600">
                <Users className="w-4 h-4 inline mr-2" />
                Assessments completed: {assessmentCount}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Based on Carl Jung's theory of cognitive functions</p>
          <p className="mt-2">Open source • MIT License</p>
        </div>
      </div>
    </div>
  );
};

export default CognitiveTypologist;
