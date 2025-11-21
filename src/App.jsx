import React, { useState, useEffect, useRef } from 'react';
import { Send, User, TrendingUp, Dumbbell, Target, Activity, BarChart3, X, Check, Eye, MessageCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import miLogo from './assets/milogo.jpeg';
const FitnessApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [progress, setProgress] = useState([]);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseInstructions, setExerciseInstructions] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [loadingInstructions, setLoadingInstructions] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: '¡Bienvenido a FitBot! 💪 Soy tu asistente personal de entrenamiento.\n\nPara comenzar, cuéntame:\n• Tu nombre\n• Tu nivel (principiante, intermedio, avanzado)\n• Tus objetivos (perder peso, ganar músculo, etc.)' }]);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const saveApiKey = (key) => { setApiKey(key); setShowApiKeyInput(false); };

  const handleSend = async (customMessage = null) => {
    const msg = customMessage || input.trim();
    if (!msg || loading) return;
    if (!apiKey) { setShowApiKeyInput(true); return; }

    if (!customMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const systemPrompt = user 
        ? `Eres FitBot, asistente de fitness para ${user.name}, nivel ${user.level}, objetivo: ${user.goal}. SOLO responde sobre fitness/entrenamiento. Formato ejercicios: **Ejercicio** - 3 series de 12 rep. Sé breve y motivador.`
        : `Eres FitBot, asistente de fitness. SOLO responde sobre fitness. Ayuda al usuario nuevo a registrarse: nombre, nivel, objetivos. Sé breve.`;

      const chatHistory = messages.map(m => ({ role: m.role === 'assistant' ? 'CHATBOT' : 'USER', message: m.content }));

      const response = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'command-r7b-12-2024', message: msg, chat_history: chatHistory, preamble: systemPrompt, temperature: 0.7, max_tokens: 800 })
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      if (!data.text) throw new Error('Sin respuesta');

      setMessages(prev => [...prev, { role: 'assistant', content: data.text.trim() }]);

      if (!user && msg.length > 15) {
        const lower = msg.toLowerCase();
        if ((/me llamo|mi nombre|soy/i.test(msg) || /principiante|intermedio|avanzado/i.test(lower)) && /peso|músculo|resistencia|tonificar|fitness/i.test(lower)) {
          const nameMatch = msg.match(/(?:me llamo|mi nombre es|soy)\s+([A-Za-zÁÉÍÓÚáéíóúÑñ]+)/i);
          setUser({
            name: nameMatch?.[1] || 'Usuario',
            level: lower.includes('avanzado') ? 'avanzado' : lower.includes('intermedio') ? 'intermedio' : 'principiante',
            goal: lower.includes('músculo') ? 'ganar músculo' : lower.includes('peso') ? 'perder peso' : 'mejorar fitness'
          });
        }
      }

      if (data.text.includes('**') && (data.text.includes('serie') || data.text.includes('rep'))) {
        setWorkouts(prev => [...prev, { id: Date.now(), date: new Date().toISOString(), content: data.text, completed: false }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: error.message.includes('401') ? '🔑 API Key inválida' : '❌ Error de conexión' }]);
    } finally { setLoading(false); }
  };

  const fetchExerciseInstructions = async (name) => {
    if (!apiKey) return;
    setLoadingInstructions(true); setExerciseName(name); setShowExerciseModal(true);
    try {
      const res = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'command-r7b-12-2024', message: `Cómo hacer ${name}`, chat_history: [], preamble: 'Da SOLO 3 pasos cortos numerados (max 8 palabras c/u). Sin intro.', temperature: 0.5, max_tokens: 100 })
      });
      const data = await res.json();
      setExerciseInstructions(data.text?.trim() || 'Error');
    } catch { setExerciseInstructions('Error al cargar'); }
    finally { setLoadingInstructions(false); }
  };

  const completeExercise = (msgIdx, lineIdx) => {
    const id = `ex-${msgIdx}-${lineIdx}`;
    const newSet = new Set(completedExercises);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setCompletedExercises(newSet);
    
    const today = new Date().toISOString().split('T')[0];
    const existing = progress.find(p => p.date === today);
    if (existing) {
      setProgress(prev => prev.map(p => p.date === today ? { ...p, exercisesCompleted: (p.exercisesCompleted || 0) + (newSet.has(id) ? 1 : -1) } : p));
    } else if (newSet.has(id)) {
      setProgress(prev => [...prev, { date: today, exercisesCompleted: 1 }]);
    }
  };

  const renderMessage = (content, msgIdx) => {
    return content.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      const hasExerciseFormat = /\*\*[^*]+\*\*/.test(line);
      const hasReps =
        trimmed.toLowerCase().includes('serie') ||
        trimmed.toLowerCase().includes('rep') ||
        /\d+\s*x\s*\d+/i.test(trimmed);
      const startsLikeExercise = /^[-•\d]/.test(trimmed);
      const isExercise = hasReps && (hasExerciseFormat || startsLikeExercise);
      
      if (isExercise) {
        const baseLine = trimmed.replace(/^[-•\d\.\)\s]+/, '');
        const name =
          line.match(/\*\*([^*]+)\*\*/)?.[1] ||
          baseLine.split(/-|:|\(/)[0].trim();
        const id = `ex-${msgIdx}-${idx}`;
        const done = completedExercises.has(id);
        
        return (
          <div key={idx} className={`mb-4 p-4 rounded-xl border-2 transition-all duration-200 ${done ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-sm' : 'bg-white border-gray-200 shadow-md hover:shadow-lg'}`}>
            <div className="flex items-start gap-4">
              <button 
                onClick={() => completeExercise(msgIdx, idx)} 
                className={`flex-shrink-0 w-9 h-9 rounded-lg border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${done ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white shadow-md hover:from-green-600 hover:to-emerald-700' : 'border-gray-300 bg-white hover:border-green-500 hover:bg-green-50 hover:scale-105'}`}
                title={done ? 'Desmarcar' : 'Marcar completado'}
              >
                <Check
                  className={`w-5 h-5 transition-opacity duration-200 ${done ? 'opacity-100 text-white' : 'opacity-40 text-gray-400'}`}
                  strokeWidth={3}
                />
              </button>
              <div className="flex-1">
                <p className={`font-semibold text-base mb-2 ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>{line.replace(/\*\*/g, '')}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => fetchExerciseInstructions(name)} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow-md transition-all">
                    <Eye className="w-3.5 h-3.5" />Ver demo
                  </button>
                  {done && (
                    <span className="flex items-center gap-1.5 px-3 py-2 bg-green-100 text-green-700 text-xs font-semibold rounded-lg border border-green-200">
                      <Check className="w-3.5 h-3.5" />Completado
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }
      if (line.includes('**')) return <p key={idx} className="mb-2 text-gray-700" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') }} />;
      return line.trim() ? <p key={idx} className="mb-2 text-gray-700">{line}</p> : <br key={idx} />;
    });
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Botón flotante para abrir/cerrar el chat */}
      <button
        onClick={() => setIsChatOpen(prev => !prev)}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform"
        aria-label={isChatOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
      </button>

      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-[85vw] max-w-sm h-[460px] md:h-[500px] z-30 shadow-2xl rounded-3xl overflow-hidden border border-gray-200 bg-gray-50 flex flex-col">
          {/* API Key Modal (solo dentro del widget) */}
          {showApiKeyInput && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                <h2 className="text-xl font-bold mb-3">Configurar Cohere API</h2>
                <p className="text-gray-600 text-sm mb-3">
                  Obtén tu API key GRATIS en{' '}
                  <a
                    href="https://dashboard.cohere.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Cohere Dashboard
                  </a>
                </p>
                <input
                  type="password"
                  placeholder="Pega tu API key..."
                  className="w-full px-4 py-3 border-2 rounded-lg mb-3 focus:border-purple-500 outline-none"
                  onKeyPress={e => {
                    if (e.key === 'Enter' && e.target.value.trim()) saveApiKey(e.target.value.trim());
                  }}
                />
                <button
                  onClick={e => {
                    const inp = e.target.previousElementSibling;
                    if (inp.value.trim()) saveApiKey(inp.value.trim());
                  }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold"
                >
                  Guardar
                </button>
              </div>
            </div>
          )}

          {/* Modal de ejercicio */}
          {showExerciseModal && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
              <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-3xl max-w-sm w-full shadow-2xl border border-purple-500/30 overflow-hidden">
                <div className="p-5 relative">
                  <button
                    onClick={() => {
                      setShowExerciseModal(false);
                      setExerciseInstructions('');
                    }}
                    className="absolute top-4 right-4 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-purple-300 text-xs uppercase tracking-wider">Cómo hacer</p>
                      <h2 className="text-lg font-bold text-white">{exerciseName}</h2>
                    </div>
                  </div>
                  {loadingInstructions ? (
                    <div className="flex justify-center py-8">
                      <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {exerciseInstructions
                        .split('\n')
                        .filter(l => l.trim())
                        .map((step, i) => (
                          <div key={i} className="flex items-start gap-3 bg-white/10 p-3 rounded-xl">
                            <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">{i + 1}</span>
                            </div>
                            <p className="text-white/90 text-sm">{step.replace(/^\d+[\.\-\)]\s*/, '')}</p>
                          </div>
                        ))}
                      <button
                        onClick={() => {
                          setShowExerciseModal(false);
                          setExerciseInstructions('');
                        }}
                        className="w-full mt-3 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold"
                      >
                        ¡Entendido!
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-white border-b text-gray-900 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-purple-100 rounded-xl">
                  <img src={miLogo} alt="FitBot" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">FitBot</h1>
                  <p className="text-xs text-gray-500">Asistente de fitness</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                {user && (
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                  >
                    <User className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {/* Profile Sidebar */}
            {showProfile && user && (
              <div className="w-64 bg-white p-4 overflow-y-auto border-r">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold">Mi Perfil</h2>
                  <button onClick={() => setShowProfile(false)}>
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl text-white mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg font-bold mb-1">
                    {user.name[0]}
                  </div>
                  <h3 className="font-bold text-sm">{user.name}</h3>
                  <p className="text-purple-200 text-xs capitalize">{user.level}</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <p className="text-[11px] text-gray-500">Objetivo</p>
                    <p className="font-semibold capitalize">{user.goal}</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <p className="text-[11px] text-gray-500">Completados</p>
                    <p className="font-semibold">{completedExercises.size} ejercicios</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Chat */}
            <div className="flex-1 flex flex-col">
              {/* Stats */}
              {showStats && (
                <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 border-b p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm flex items-center gap-2 text-white">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                      Tu Progreso
                    </h3>
                    <button
                      onClick={() => setShowStats(false)}
                      className="text-white/60 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl text-center shadow-lg shadow-purple-500/20">
                      <p className="text-2xl font-bold text-white">{workouts.length}</p>
                      <p className="text-[11px] text-purple-200 mt-1">Rutinas</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl text-center shadow-lg shadow-orange-500/20">
                      <p className="text-2xl font-bold text-white">{completedExercises.size}</p>
                      <p className="text-[11px] text-orange-200 mt-1">Ejercicios</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl text-center shadow-lg shadow-green-500/20">
                      <p className="text-2xl font-bold text-white">{progress.length}</p>
                      <p className="text-[11px] text-green-200 mt-1">Días activos</p>
                    </div>
                  </div>

                  {completedExercises.size > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <p className="text-white/80 text-xs mb-2">Ejercicios completados hoy</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/20 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((completedExercises.size / 10) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-white text-xs font-bold">
                          {completedExercises.size}/10
                        </span>
                      </div>
                      {completedExercises.size >= 10 && (
                        <p className="text-green-400 text-xs mt-1 font-medium">
                          🎉 ¡Meta diaria alcanzada!
                        </p>
                      )}
                    </div>
                  )}

                  {completedExercises.size === 0 && workouts.length === 0 && (
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Dumbbell className="w-5 h-5 text-purple-400" />
                      </div>
                      <p className="text-white/80 text-sm font-medium">Sin actividad aún</p>
                      <p className="text-white/50 text-xs mt-1">
                        Pide una rutina y empieza a entrenar
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                          : 'bg-white shadow-sm text-gray-800'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        renderMessage(msg.content, idx)
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl p-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {user && (
                <div className="px-3 py-2 bg-white border-t flex gap-2 overflow-x-auto">
                  <button
                    onClick={() => {
                      setInput('Genera rutina para hoy');
                      setTimeout(() => handleSend('Genera rutina para hoy'), 100);
                    }}
                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs whitespace-nowrap hover:bg-purple-100"
                  >
                    🏋️ Rutina
                  </button>
                  <button
                    onClick={() => setInput('Consejos de técnica')}
                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs whitespace-nowrap hover:bg-purple-100"
                  >
                    💡 Consejos
                  </button>
                </div>
              )}

              {/* Input */}
              <div className="p-3 bg-white border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 px-3 py-2.5 border-2 rounded-xl text-sm focus:border-purple-500 outline-none"
                    disabled={loading}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl disabled:opacity-50 text-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessApp;