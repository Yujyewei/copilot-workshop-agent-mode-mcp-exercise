// localStorage 儲存資料所使用的鍵值
const STORAGE_KEY = "todo-list-items";
const THEME_STORAGE_KEY = "todo-list-theme";

// 取得畫面上需要操作的元素
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyHint = document.getElementById("empty-hint");
const remainingCount = document.getElementById("remaining-count");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const filterRow = document.getElementById("filter-row");

// 待辦事項陣列,每個項目為 { id, text, completed }
let todos = loadTodos();

// 目前的篩選條件:all(全部) / active(未完成) / completed(已完成)
let currentFilter = "all";

// 從 localStorage 讀取待辦資料,若無資料或格式錯誤則回傳空陣列
function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("讀取待辦資料失敗,將使用空清單:", error);
    return [];
  }
}

// 將目前的待辦資料寫入 localStorage
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 產生唯一的待辦事項 ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// 根據目前的篩選條件,取得要顯示的待辦事項清單
function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }
  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }
  return todos;
}

// 根據目前的篩選條件回傳清單為空時要顯示的提示文字
function getEmptyHintText() {
  if (todos.length === 0) {
    return "還沒有任何待辦事項,新增一個吧!";
  }
  if (currentFilter === "active") {
    return "目前沒有未完成的待辦事項";
  }
  if (currentFilter === "completed") {
    return "目前沒有已完成的待辦事項";
  }
  return "還沒有任何待辦事項,新增一個吧!";
}

// 根據目前的 todos 陣列重新渲染整個清單畫面
function render() {
  list.innerHTML = "";

  const filteredTodos = getFilteredTodos();

  // 篩選後清單為空時顯示對應的提示文字,否則隱藏提示
  emptyHint.textContent = getEmptyHintText();
  emptyHint.style.display = filteredTodos.length === 0 ? "block" : "none";

  filteredTodos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.completed ? " completed" : "");
    item.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "刪除";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(deleteBtn);
    list.appendChild(item);
  });

  updateRemainingCount();
}

// 更新底部「未完成:N 項」的顯示文字,此數字不受篩選影響,永遠反映整體數量
function updateRemainingCount() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${remaining} 項`;
}

// 套用指定的主題(light 或 dark),並將選擇存進 localStorage
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  updateThemeToggleLabel(theme);
}

// 更新主題切換按鈕上的圖示與文字
function updateThemeToggleLabel(theme) {
  themeToggleBtn.textContent = theme === "dark" ? "☀️ 淺色模式" : "🌙 深色模式";
}

// 初始化主題:若使用者曾手動選擇過,套用該選擇;否則跟隨系統設定顯示按鈕文字
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
    return;
  }

  // 尚未手動切換過,依系統目前的深淺色設定顯示按鈕文字(CSS 會自動套用系統配色)
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  updateThemeToggleLabel(prefersDark ? "dark" : "light");
}

// 切換深色 / 淺色模式
function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark"
    || (!document.documentElement.getAttribute("data-theme")
      && window.matchMedia("(prefers-color-scheme: dark)").matches);

  applyTheme(isDark ? "light" : "dark");
}

// 切換目前的篩選條件並更新按鈕樣式
function setFilter(filter) {
  currentFilter = filter;

  filterRow.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  render();
}

// 新增一筆待辦事項
function addTodo(text) {
  const trimmed = text.trim();
  if (trimmed === "") {
    return; // 空白內容不新增
  }

  todos.push({ id: generateId(), text: trimmed, completed: false });
  saveTodos();
  render();
}

// 切換指定待辦事項的完成狀態
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  }
}

// 刪除指定待辦事項
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

// 監聽表單送出事件以新增待辦事項
form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(input.value);
  input.value = "";
  input.focus();
});

// 監聽深色模式切換按鈕
themeToggleBtn.addEventListener("click", toggleTheme);

// 監聽篩選按鈕點擊
filterRow.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

// 頁面載入時先套用主題設定,再渲染既有資料
initTheme();
render();
