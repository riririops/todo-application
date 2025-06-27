const REPO = 'your-name/your-repo'; // ← ここを自分のアカウント名・GitHubリポジトリ名に書き換えてください
const PATH = 'todos.json';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export async function fetchTodosFromGitHub() {
  try {
    const apiUrl = `https://api.github.com/repos/${REPO}/contents/${PATH}`;
    const res = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const content = atob(data.content);
    return JSON.parse(content);
  } catch (e: any) {
    if (e.response?.status === 404) {
      return []
    }
    throw e
  }
}

export async function saveTodosToGitHub(todos: any[]) {
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${PATH}`;
  // 最新のSHAを毎回取得
  let sha: string | undefined = undefined;
  const res = await fetch(apiUrl, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` }
  });
  if (res.ok) {
    const data = await res.json();
    sha = data.sha;
  }
  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Update todos',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(todos)))),
      ...(sha ? { sha } : {})
    })
  });
  if (!putRes.ok) {
    const error = await putRes.text();
    console.error('GitHub API Error:', putRes.status, error);
    alert('GitHub API Error: ' + putRes.status + '\n' + error);
  }
}