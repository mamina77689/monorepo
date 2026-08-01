'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

interface Todo {
  id: string;
  title: string;
  timeString: string;
  dueDate: string;
  isRemoving?: boolean;
}

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

const Page = () => {
  const [inputValue, setInputValue] = useState("");
  const [dueInput, setDueInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedTodos = localStorage.getItem("emerald_todos_v8");
    const savedCount = localStorage.getItem("emerald_completed_v8");
    const savedAuth = localStorage.getItem("emerald_auth_v8");
    
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedCount) {
      setCompletedCount(parseInt(savedCount, 10) || 0);
    }
    if (savedAuth) {
      setIsSignedUp(true);
      setUserName(savedAuth);
    }
    setIsLoaded(true);

    const scriptId = 'google-gsi-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && !GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID")) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            cancel_on_tap_outside: true,
          });
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("emerald_todos_v8", JSON.stringify(todos));
    localStorage.setItem("emerald_completed_v8", completedCount.toString());
  }, [todos, completedCount, isLoaded]);

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const handleGoogleResponse = (response: any) => {
    const profile = parseJwt(response.credential);
    const name = profile?.name || "Hulan Bilegdemberel";
    setIsSignedUp(true);
    setUserName(name);
    localStorage.setItem("emerald_auth_v8", name);
    setIsSignUpOpen(false);
  };

  const triggerGoogleLogin = () => {
    if (GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID")) {
      const name = "Hulan Bilegdemberel";
      setIsSignedUp(true);
      setUserName(name);
      localStorage.setItem("emerald_auth_v8", name);
      setIsSignUpOpen(false);
      return;
    }

    if (window.google) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.warn("Google prompt skipped or blocked:", notification.getNotDisplayedReason());
          }
        });
      } catch (error) {
        console.error("Google prompt error:", error);
      }
    } else {
      alert("Google Sign-In is still loading. Please try again.");
    }
  };

  const handleAddTask = () => {
    if (!isSignedUp) {
      setIsSignUpOpen(true);
      return;
    }
    if (!inputValue.trim()) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: inputValue.trim(),
      timeString: formattedTime,
      dueDate: dueInput.trim() || "No deadline",
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInputValue("");
    setDueInput("");
  };

  const handleCompleteTask = (taskId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === taskId ? { ...todo, isRemoving: true } : todo
      )
    );

    setTimeout(() => {
      setTodos((prev) => prev.filter((todo) => todo.id !== taskId));
      setCompletedCount((prev) => prev + 1);
    }, 350);
  };

  const handleDeleteTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setTodos((prev) => prev.filter((todo) => todo.id !== taskId));
  };

  const handleResetTasks = () => {
    if (confirm("Are you sure you want to reset all tasks and stats?")) {
      setTodos([]);
      setCompletedCount(0);
      localStorage.removeItem("emerald_todos_v8");
      localStorage.removeItem("emerald_completed_v8");
    }
  };

  const handleSignOut = () => {
    setIsSignedUp(false);
    setUserName("");
    localStorage.removeItem("emerald_auth_v8");
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSignedUp(true);
    setUserName(email);
    localStorage.setItem("emerald_auth_v8", email);
    setIsSignUpOpen(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="relative min-h-screen bg-[#020408] text-slate-100 flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-emerald-500 selection:text-black py-16 px-4">
      
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-lg flex flex-col gap-6 z-10">
        
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Workspace</span>
          </div>

          <div>
            {isSignedUp ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#0b0f19] px-3 py-1.5 rounded-full border border-emerald-500/30 text-xs text-emerald-300 font-medium shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {userName}
                </div>
                <button 
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="text-xs text-slate-400 hover:text-rose-400 bg-[#0b0f19] px-3 py-1.5 rounded-full border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsSignUpOpen(true)}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-lg active:scale-95 animate-bounce"
              >
                Sign In / Sign Up ⚡
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-6 rounded-3xl bg-[#0b0f19]/90 border border-emerald-500/20 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Inbox
            </h1>
            <p className="text-xs text-slate-400">
              {todos.length === 0 
                ? "Inbox is clean and clear" 
                : `${todos.length} task${todos.length > 1 ? 's' : ''} waiting in inbox`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black/60 px-4 py-2.5 rounded-2xl border border-emerald-500/20 shadow-inner">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Done
              </span>
              <span className="text-xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
                {completedCount}
              </span>
            </div>

            {(todos.length > 0 || completedCount > 0) && (
              <button 
                onClick={handleResetTasks}
                title="Reset All"
                className="p-3 bg-black/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 rounded-2xl transition-all duration-200 cursor-pointer text-xs"
              >
                🔄
              </button>
            )}
          </div>
        </div>

        {!isSignedUp && (
          <div 
            onClick={() => setIsSignUpOpen(true)}
            className="flex items-center justify-between p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 cursor-pointer hover:bg-amber-950/50 transition-all shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-amber-400 text-lg">⚠️</span>
              <div>
                <p className="text-xs font-bold text-amber-200">Account Required</p>
                <p className="text-[11px] text-amber-400/80">Please sign in or sign up to create and manage tasks.</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl">Sign In</span>
          </div>
        )}

        <div className={`flex flex-col gap-3 p-4 rounded-3xl bg-[#0b0f19]/90 border border-slate-800 backdrop-blur-md shadow-2xl relative ${!isSignedUp ? 'opacity-60' : ''}`}>
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder={isSignedUp ? "What needs to be done today?" : "Sign in to add tasks..."} 
            disabled={!isSignedUp}
            className="w-full bg-black/40 border border-slate-800 focus:border-emerald-500/60 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
          />

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-3 text-xs text-slate-500">⏱️</span>
              <input 
                type="text"
                value={dueInput}
                onChange={(e) => setDueInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="Due (e.g. 10 PM, in 5 days)"
                disabled={!isSignedUp}
                className="w-full bg-black/40 border border-slate-800 focus:border-emerald-500/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            <button 
              onClick={handleAddTask}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 active:scale-95 cursor-pointer flex items-center justify-center tracking-wide"
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {!isLoaded ? (
            <div className="text-center py-12 text-slate-500 text-sm animate-pulse">
              Loading inbox...
            </div>
          ) : todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl border border-dashed border-slate-800 bg-[#0b0f19]/40 text-center gap-3 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                📥
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Your inbox is empty</p>
                <p className="text-xs text-slate-500 mt-1">Add tasks with due timers above!</p>
              </div>
            </div>
          ) : (
            todos.map((todo) => (
              <div 
                key={todo.id}
                onClick={() => handleCompleteTask(todo.id)}
                className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                  todo.isRemoving
                    ? 'opacity-0 scale-95 translate-x-4 bg-emerald-950/40 border-emerald-500/60'
                    : 'bg-[#0b0f19]/70 border-slate-800 hover:border-emerald-500/40 hover:bg-[#0f1523] hover:shadow-xl hover:shadow-emerald-500/5 backdrop-blur-md'
                }`}
              >
                
                <div className="flex items-center gap-3.5 flex-1 pr-4">
                  <div 
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                      todo.isRemoving
                        ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-[0_0_15px_rgba(52,211,153,0.8)]'
                        : 'border-slate-700 group-hover:border-emerald-400 bg-black/40'
                    }`}
                  >
                    {todo.isRemoving && (
                      <span className="text-slate-950 text-xs font-black animate-in zoom-in-50 duration-200">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className={`text-sm font-medium transition-all duration-300 ${
                      todo.isRemoving
                        ? 'line-through text-slate-500'
                        : 'text-slate-200 group-hover:text-white'
                    }`}>
                      {todo.title}
                    </span>
                    <span className="text-[11px] text-emerald-400/80 font-mono mt-0.5 flex items-center gap-1">
                      <span>⏳</span> Due: {todo.dueDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-slate-800 text-[11px] text-slate-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-emerald-400 transition-colors" />
                    <span>{todo.timeString}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteTask(e, todo.id)}
                    title="Delete task"
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {isSignUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0b0f19] border border-emerald-500/30 rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsSignUpOpen(false)}
              className="absolute right-6 top-6 text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-white">Welcome to Task Stream</h2>
              <p className="text-xs text-slate-400 mt-1">Sign in with your Google Account or email to start.</p>
            </div>

            <div className="flex flex-col gap-4">
              
              <button 
                type="button"
                onClick={triggerGoogleLogin}
                className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg cursor-pointer text-sm flex items-center justify-center gap-3 active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.2v3.15C3.16 21.32 7.22 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.2C.44 8.12 0 9.87 0 11.73s.44 3.61 1.2 5.15l4.08-2.61z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.16 2.68 1.2 6.58l4.08 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Sign in with Google
              </button>

              <div className="flex items-center my-2">
                <div className="flex-1 border-t border-slate-800"></div>
                <span className="px-3 text-xs text-slate-500 uppercase font-medium">Or email</span>
                <div className="flex-1 border-t border-slate-800"></div>
              </div>

              <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-black/50 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <button 
                  type="submit"
                  className="mt-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 cursor-pointer text-sm"
                >
                  Continue with Email
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Page;