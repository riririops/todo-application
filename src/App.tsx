import { useEffect, useState } from 'react'
import './App.css'
// import { fetchTodosFromGitHub, saveTodosToGitHub } from './githubApI'
// import debounce from 'lodash.debounce'

type Todo = {
  id: number
  text: string
  date: string
  category: string
  done: boolean
}

const CATEGORIES = ['すべて', '仕事', '勉強', 'プライベート']

function App() {
  const [text, setText] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('仕事')
  const [filter, setFilter] = useState('すべて')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editCategory, setEditCategory] = useState('')

  // 初回読み込み
  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  // 自動保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // 通知許可リクエスト（初回のみ）
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // 締切が近いタスクを通知
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return
    const today = new Date().toISOString().slice(0, 10)
    const soonTodos = todos.filter(todo =>
      !todo.done &&
      todo.date &&
      todo.date <= today
    )
    if (soonTodos.length > 0) {
      new Notification('締切が近いタスクがあります', {
        body: soonTodos.map(t => t.text + '（' + t.date + '）').join('\n')
      })
    }
  }, [todos])

  const addTodo = () => {
    if (text.trim() === '' || date === '') return
    const newTodo: Todo = {
      id: Date.now(),
      text,
      date,
      category,
      done: false,
    }
    setTodos([...todos, newTodo])
    setText('')
    setDate('')
    setCategory('仕事')
  }

  const toggleDone = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
    setEditDate(todo.date)
    setEditCategory(todo.category)
  }

  const saveEdit = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? {
        ...todo,
        text: editText,
        date: editDate,
        category: editCategory
      } : todo
    ))
    setEditingId(null)
  }

  const filteredTodos = todos
    .filter(todo =>
      (filter === 'すべて' || todo.category === filter) &&
      todo.text.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="container">
      <h1>ToDo リスト</h1>

      <div className="todo-input">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="やることを入力"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.slice(1).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={addTodo}>追加</button>
      </div>

      <div style={{ marginBottom: '1em' }}>
        カテゴリで絞り込み：
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1em' }}>
        検索：
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="キーワードで検索"
          style={{ marginLeft: '0.5em', padding: '0.4em', width: '60%' }}
        />
      </div>

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  {CATEGORIES.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button onClick={() => saveEdit(todo.id)}>保存</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleDone(todo.id)}
                />
                <span className={todo.done ? 'done' : ''}>
                  {todo.text}（{todo.category} / {todo.date}）
                </span>
                <button onClick={() => startEdit(todo)}>編集</button>
                <button onClick={() => deleteTodo(todo.id)}>削除</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
