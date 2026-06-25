import { Metadata } from 'next';
import './global.css';
import { ApolloProvider } from './provider/ApolloProvider';

export const metadata: Metadata = {
  title: 'Task Studio', 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
     
      <body className="bg-[#0a0f24]">
        
<div className="relative flex items-center mb-6">
  <input 
    type="text" 
    placeholder="What's next on your schedule?..." 
    className="w-full bg-[#0f1636] border border-blue-900 rounded-2xl pl-4 pr-20 py-3.5 text-sm text-slate-200 placeholder-blue-300/30 focus:outline-none focus:border-cyan-400 transition-all"
  />
  <button className="absolute right-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 active:scale-95 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-cyan-500/10">
    Add
  </button>
</div>
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
