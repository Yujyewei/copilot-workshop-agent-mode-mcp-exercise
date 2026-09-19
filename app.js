// localStorage 儲存資料所使用的鍵值
const STORAGE_KEY = "todo-list-items";

// 取得畫面上需要操作的元素
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyHint = document.getElementById("empty-hint");
const remainingCount = document.getElementById("remaining-count");

// 待辦事項陣列,每個項目為 { id, text, completed }
let todos = loadTodos();

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

// 根據目前的 todos 陣列重新渲染整個清單畫面
function render() {
  list.innerHTML = "";

  // 清單為空時顯示提示文字,否則隱藏
  emptyHint.style.display = todos.length === 0 ? "block" : "none";

  todos.forEach((todo) => {
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

// 更新底部「未完成:N 項」的顯示文字
function updateRemainingCount() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${remaining} 項`;
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

// 頁面載入時先渲染既有資料
render();
