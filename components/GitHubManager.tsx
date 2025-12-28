
import React, { useState, useEffect } from 'react';
import { Github, Key, RefreshCw, Folder, ExternalLink, Shield, Globe, Lock, ChevronLeft, FileCode, CloudSync } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  owner: { login: string };
  description: string;
  html_url: string;
  private: boolean;
  language: string;
  updated_at: string;
}

interface RepoContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url: string | null;
}

interface Props {
  onSync: (code: string) => void;
}

const GitHubManager: React.FC<Props> = ({ onSync }) => {
  const [token, setToken] = useState(() => localStorage.getItem('gh_token') || '');
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Repository browser state
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [contents, setContents] = useState<RepoContent[]>([]);
  const [fetchingContents, setFetchingContents] = useState(false);
  const [syncingFile, setSyncingFile] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchRepos();
    }
  }, []);

  const fetchRepos = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    localStorage.setItem('gh_token', token);

    try {
      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories. Please check your token.');
      }

      const data = await response.json();
      setRepos(data);
    } catch (err: any) {
      setError(err.message);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepoContents = async (repo: Repository, path: string = '') => {
    setFetchingContents(true);
    setError(null);
    try {
      const response = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/${path}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!response.ok) throw new Error('Failed to load contents');
      const data = await response.json();
      setContents(Array.isArray(data) ? data : [data]);
      setCurrentPath(path);
      setSelectedRepo(repo);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetchingContents(false);
    }
  };

  const handleSyncFile = async (file: RepoContent) => {
    if (!file.download_url) return;
    setSyncingFile(file.path);
    try {
      const response = await fetch(file.download_url, {
        headers: { 'Authorization': `token ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch file content');
      const content = await response.text();
      onSync(content);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSyncingFile(null);
    }
  };

  const navigateBack = () => {
    if (!selectedRepo) return;
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length === 0) {
      setSelectedRepo(null);
      setContents([]);
    } else {
      parts.pop();
      fetchRepoContents(selectedRepo, parts.join('/'));
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Github className="text-slate-200" />
            Source Control
          </h1>
          <p className="text-slate-500 mt-1">Sync your autonomous agent code directly with GitHub repositories.</p>
        </div>
        {selectedRepo && (
          <button 
            onClick={navigateBack}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 border border-slate-700 transition-all"
          >
            <ChevronLeft size={18} /> BACK
          </button>
        )}
      </div>

      <div className="max-w-4xl space-y-6">
        {!selectedRepo && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Key className="text-blue-500" size={20} />
              <h3 className="font-bold text-lg">Authentication</h3>
            </div>
            <p className="text-xs text-slate-500">Enter your GitHub Personal Access Token (PAT) with 'repo' scope to access your codebases.</p>
            <div className="flex gap-3">
              <input 
                type="password" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <button 
                onClick={fetchRepos}
                disabled={loading || !token}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                FETCH REPOS
              </button>
            </div>
            {error && <p className="text-xs text-red-500 flex items-center gap-1"><Shield size={12} /> {error}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!selectedRepo ? (
            repos.length > 0 ? (
              repos.map(repo => (
                <div key={repo.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition-all group shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Folder className="text-blue-500" size={20} />
                      <h4 className="font-bold text-slate-200 truncate max-w-[200px]">{repo.name}</h4>
                    </div>
                    {repo.private ? <Lock size={14} className="text-slate-600" /> : <Globe size={14} className="text-slate-600" />}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 h-8 mb-4">
                    {repo.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <button 
                      onClick={() => fetchRepoContents(repo)}
                      className="px-3 py-1 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all"
                    >
                      Browse Files
                    </button>
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-blue-400 transition-all"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))
            ) : !loading && (
              <div className="col-span-full py-12 text-center space-y-4 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
                <Github className="mx-auto text-slate-800" size={48} />
                <div className="space-y-1">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No repositories loaded</p>
                  <p className="text-slate-700 text-[10px] font-mono">Authenticate with a token to view your source assets.</p>
                </div>
              </div>
            )
          ) : (
            <div className="col-span-full bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-mono">
                  <Folder className="text-blue-500" size={16} />
                  <span className="text-slate-400">{selectedRepo.name}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-200 truncate max-w-[300px]">{currentPath || '(root)'}</span>
                </div>
                {fetchingContents && <RefreshCw className="animate-spin text-blue-500" size={16} />}
              </div>
              <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto custom-scrollbar">
                {contents.length === 0 && !fetchingContents && (
                  <div className="p-12 text-center text-slate-600 italic text-sm">Empty directory</div>
                )}
                {contents.map((item) => (
                  <div key={item.path} className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      {item.type === 'dir' ? <Folder className="text-blue-500" size={18} /> : <FileCode className="text-slate-400" size={18} />}
                      <span className={`text-sm ${item.type === 'dir' ? 'font-bold text-slate-200' : 'text-slate-400'}`}>{item.name}</span>
                    </div>
                    <div>
                      {item.type === 'dir' ? (
                        <button 
                          onClick={() => fetchRepoContents(selectedRepo, item.path)}
                          className="px-3 py-1 bg-slate-800 group-hover:bg-slate-700 rounded-lg text-[10px] font-bold uppercase text-slate-400 transition-all"
                        >
                          Open
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSyncFile(item)}
                          disabled={syncingFile === item.path}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all disabled:opacity-50"
                        >
                          {syncingFile === item.path ? <RefreshCw size={12} className="animate-spin" /> : <CloudSync size={12} />}
                          Sync to Lab
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(loading || fetchingContents) && !selectedRepo && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse h-36">
              <div className="h-4 bg-slate-800 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-slate-800 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitHubManager;
