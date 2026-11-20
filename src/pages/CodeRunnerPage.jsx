import { useState } from 'react';

const compilers = {
  clang: { name: 'C', compiler: 'gcc-13.2.0-c' },
  clangpp: { name: 'C++', compiler: 'gcc-13.2.0' },
  python: { name: 'Python', compiler: 'cpython-3.12.7' },
  quickjs: { name: 'JavaScript', compiler: 'nodejs-20.17.0' },
};

function readRunnerPayload() {
  const runId = new URLSearchParams(window.location.search).get('run');
  if (!runId) return null;
  try {
    return JSON.parse(localStorage.getItem(`gcaCodeRun:${runId}`));
  } catch {
    return null;
  }
}

export default function CodeRunnerPage() {
  const [payload] = useState(readRunnerPayload);
  const language = compilers[payload?.language] ? payload.language : 'clang';
  const [code, setCode] = useState(payload?.code || '');
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState('Run the code to see its result.');
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(false);

  const runCode = async () => {
    setRunning(true);
    setFailed(false);
    setResult('Running…');
    try {
      const response = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, compiler: compilers[language].compiler, stdin, save: false }),
      });
      const output = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(output.message || 'The code runner is unavailable.');
      const sections = [
        output.compiler_error,
        output.compiler_message,
        output.program_output,
        output.program_error,
        output.program_message,
      ].filter(Boolean);
      const didFail = String(output.status) !== '0' || Boolean(output.compiler_error || output.program_error);
      setFailed(didFail);
      setResult(sections.join('\n') || (didFail ? 'The program finished with an error.' : 'Program finished successfully with no output.'));
    } catch (error) {
      setFailed(true);
      setResult(error.message || 'Unable to run the code.');
    } finally {
      setRunning(false);
    }
  };

  if (!payload) return <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-white"><div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center"><h1 className="text-2xl font-bold">Code unavailable</h1><p className="mt-3 text-slate-400">Return to the lesson and open the code runner again.</p></div></main>;

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-left text-slate-100 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-400">Global Coding Academy</p><h1 className="mt-1 text-2xl font-black">Code runner</h1></div>
          <div className="flex items-center gap-3"><span className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-bold text-slate-300">{compilers[language].name}</span><button type="button" onClick={runCode} disabled={running || !code.trim()} className="rounded-lg bg-[#ffd700] px-5 py-2.5 font-black text-[#082f55] disabled:opacity-50">{running ? 'Running…' : '▶ Run code'}</button></div>
        </header>

        <section className="grid min-h-[calc(100vh-8rem)] gap-4 lg:grid-cols-2">
          <div className="flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900"><div className="border-b border-slate-700 px-4 py-3 text-sm font-bold">Code editor</div><textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck="false" className="min-h-0 flex-1 resize-none bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 outline-none" aria-label="Code editor" /><label className="border-t border-slate-700 p-4 text-xs font-bold text-slate-300">Program input (optional)<textarea value={stdin} onChange={(event) => setStdin(event.target.value)} className="mt-2 h-20 w-full resize-none rounded border border-slate-700 bg-slate-950 p-3 font-mono text-sm font-normal text-white outline-none" placeholder="Input passed to the program" /></label></div>
          <div className="flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900"><div className="flex items-center justify-between border-b border-slate-700 px-4 py-3"><span className="text-sm font-bold">Result</span><span className={`h-2.5 w-2.5 rounded-full ${failed ? 'bg-red-500' : 'bg-emerald-400'}`} /></div><pre className={`min-h-0 flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-6 ${failed ? 'text-red-300' : 'text-emerald-300'}`}>{result}</pre></div>
        </section>
      </div>
    </main>
  );
}
