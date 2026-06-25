'use client';

import { useState } from 'react';


import { useGetUsers, useCreateTodo } from './graphql/todo';


const Page = () => {
  const [inputValue, setInputValue] = useState("");

  const users = useGetUsers();
  const { onSubmit: createTodo, loading: creating } = useCreateTodo();


  const [mockTodos, setMockTodos] = useState([
    { id: "1", title: "Math homework", isDone: false },
    { id: "2", title: "Read a book", isDone: true }
  ]);


  const handleAddTask = async () => {
    if (!inputValue.trim()) return;
    
    try {
   
      await createTodo({ title: inputValue, description: "test", xpReward: 10 });
      
    
      setInputValue("");
      
    
    } catch (err) {
      console.error("Алдаа гарлаа:", err);
    }
  };


  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
   

   
      setMockTodos(prev => prev.map(todo => 
        todo.id === taskId ? { ...todo, isDone: !todo.isDone } : todo
      ));
    } catch (err) {
      console.error("Алдаа:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-10 p-4 flex flex-col gap-6 text-slate-200">
      

      <div className="relative flex items-center">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Шинэ даалгавар..." 
          className="w-full bg-[#0f1636] border border-blue-900 rounded-2xl pl-4 pr-24 py-3.5 text-sm focus:outline-none focus:border-cyan-400"
        />
        <button 
          onClick={handleAddTask}
          disabled={creating}
          className="absolute right-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all"
        >
          {creating ? 'Adding...' : 'Add'}
        </button>
      </div>

  
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-400">My Tasks</h3>
        
        {mockTodos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer" onClick={() => handleToggleTask(todo.id, todo.isDone)}>
            
       
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${todo.isDone ? 'bg-cyan-500 border-cyan-500' : 'border-slate-500'}`}>
              {todo.isDone && <span className="text-white text-xs">✓</span>}
            </div>
            
            <span className={`text-sm ${todo.isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {todo.title}
            </span>
            
          </div>
        ))}
      </div>

    </div>
  );
};

export default Page;