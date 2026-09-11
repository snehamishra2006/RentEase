import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  toggleChatDrawer,
  closeChatDrawer,
  clearMessages,
  addUserMessage,
  searchPropertiesAI,
} from '../../redux/slices/aiSlice';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Trash2,
  Building2,
  MapPin,
  Bed,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { resolvePropertyImage } from '../../utils/imageHelper';

const SUGGESTED_PROMPTS = [
  '2 BHK under ₹20,000',
  'Properties near metro',
  'Affordable homes in Ghaziabad',
  'Show me family-friendly properties',
];

const AIChatDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { messages, isOpen, loading } = useSelector((state) => state.ai);

  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query || !query.trim() || loading) return;

    dispatch(addUserMessage(query.trim()));
    dispatch(searchPropertiesAI(query.trim()));
    setInputQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptChipClick = (prompt) => {
    handleSend(prompt);
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom-Right Corner */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => dispatch(toggleChatDrawer())}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-[#1B3B2B] hover:bg-[#152e22] text-white font-extrabold text-xs shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-500/30"
          aria-label="Open RentEase AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#1B3B2B]" />
          </div>
          <span className="font-serif tracking-wide hidden sm:inline text-sm">RentEase AI</span>
          <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-sans font-bold">
            Assistant
          </span>
        </button>
      </div>

      {/* Expandable Chat Drawer Window */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-full sm:w-[440px] h-full sm:h-[620px] max-h-screen bg-white dark:bg-[#1C1C1A] border-0 sm:border border-[#E2DACD] dark:border-stone-800 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Drawer Header */}
          <div className="p-4 bg-[#1B3B2B] text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                <Bot className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base text-white">RentEase AI</h3>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30">
                    Smart Search
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Natural Language Property Finder
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => dispatch(clearMessages())}
                title="Clear Chat History"
                className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => dispatch(closeChatDrawer())}
                title="Close Assistant"
                className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scrollable Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF7F2] dark:bg-[#121210]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400 px-1 font-mono">
                  {msg.sender === 'ai' ? (
                    <span className="font-semibold text-[#1B3B2B] dark:text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> RentEase AI
                    </span>
                  ) : (
                    <span>You</span>
                  )}
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#1B3B2B] text-white rounded-br-none font-medium'
                      : 'bg-white dark:bg-stone-900 border border-[#E2DACD] dark:border-stone-800 text-[#1C1917] dark:text-stone-100 rounded-bl-none shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Fallback Warning / Suggestion banner if active */}
                  {msg.isFallback && msg.fallbackReason && (
                    <div className="mt-2.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                      <span>{msg.fallbackReason}</span>
                    </div>
                  )}

                  {/* Property Result Cards inside AI Message */}
                  {msg.properties && msg.properties.length > 0 && (
                    <div className="mt-3 space-y-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 pb-1">
                        Matching Listings ({msg.properties.length})
                      </p>
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {msg.properties.map((prop, propIdx) => {
                          const propImage = resolvePropertyImage(prop.images && prop.images[0], propIdx);
                          return (
                            <div
                              key={prop._id}
                              className="group p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-stone-800/80 border border-[#E2DACD] dark:border-stone-700 flex gap-3 items-center hover:border-[#1B3B2B] transition-all"
                            >
                              <img
                                src={propImage}
                                alt={prop.title}
                                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-[#1C1917] dark:text-stone-100 truncate group-hover:text-[#1B3B2B] dark:group-hover:text-emerald-400 transition-colors">
                                  {prop.title}
                                </h4>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 truncate mt-0.5">
                                  <MapPin className="w-3 h-3 shrink-0 text-amber-600" />
                                  {prop.address?.city || 'NCR'}, {prop.address?.state || 'India'}
                                </p>
                                <div className="flex items-center justify-between mt-1.5">
                                  <span className="text-xs font-serif font-extrabold text-[#1B3B2B] dark:text-emerald-400">
                                    ₹{prop.rentAmount?.toLocaleString('en-IN')}/mo
                                  </span>
                                  <span className="text-[10px] font-semibold text-stone-600 dark:text-stone-300 bg-stone-200/60 dark:bg-stone-700 px-1.5 py-0.5 rounded">
                                    {prop.bedrooms} BHK
                                  </span>
                                </div>
                              </div>

                              <Link
                                to={`/properties/${prop._id}`}
                                onClick={() => dispatch(closeChatDrawer())}
                                className="p-2 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white text-[10px] font-bold shrink-0 flex items-center gap-1 shadow-2xs hover:scale-105 transition-all"
                              >
                                View <ArrowUpRight className="w-3 h-3" />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Suggestions Chips if returned */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handlePromptChipClick(sug)}
                          className="px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 border border-stone-200 dark:border-stone-700 text-[10px] font-medium text-stone-700 dark:text-stone-300 transition-colors"
                        >
                          💡 {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Loader State */}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-[#E2DACD] dark:border-stone-800 text-xs rounded-bl-none shadow-2xs flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#1B3B2B] dark:text-emerald-400 animate-spin" />
                  <span className="text-stone-500 dark:text-stone-400 font-medium text-[11px] animate-pulse">
                    RentEase AI is analyzing properties...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Chips Bar */}
          <div className="px-3 py-2 bg-white dark:bg-stone-900 border-t border-[#E2DACD] dark:border-stone-800 shrink-0">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
              Suggested queries:
            </p>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptChipClick(prompt)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full bg-[#FAF7F2] dark:bg-stone-800 hover:bg-[#EBF3EE] dark:hover:bg-emerald-950/60 border border-[#E2DACD] dark:border-stone-700 text-[10px] font-semibold text-[#1C1917] dark:text-stone-200 whitespace-nowrap transition-all shadow-2xs hover:border-[#1B3B2B]"
                >
                  ✨ {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-[#1C1C1A] border-t border-[#E2DACD] dark:border-stone-800 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask RentEase AI (e.g. 2 BHK Ghaziabad under 20k)..."
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-stone-900 border border-[#E2DACD] dark:border-stone-700 text-xs text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B] dark:focus:border-emerald-500 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim() || loading}
                className="p-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#152e22] disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-center text-stone-400 dark:text-stone-500 mt-1.5">
              Powered by RentEase Intelligent Parser • Live MongoDB Sync
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatDrawer;
