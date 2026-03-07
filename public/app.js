const API_BASE = '/api';

function setToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

function authHeader() {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function showMessage(elementId, message, isError = true) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.className = isError ? 'error' : 'success';
        setTimeout(() => {
            el.textContent = '';
            el.className = '';
        }, 3000);
    }
}

function updateNav() {
    const token = getToken();
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const homeLink = document.getElementById('homeLink');

    if (token) {
        if (homeLink) homeLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline';
    } else {
        if (homeLink) homeLink.style.display = 'inline';
        if (loginLink) loginLink.style.display = 'inline';
        if (registerLink) registerLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutLink');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            removeToken();
            updateNav();
            window.location.href = '/';
        });
    }
}

function setupLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_BASE}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                setToken(data.token);
                showMessage('message', 'Login successful! Redirecting...', false);
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1000);
            } else {
                showMessage('message', data.message || 'Login failed');
            }
        } catch (err) {
            showMessage('message', 'Server error');
        }
    });
}

function setupRegister() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_BASE}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                setToken(data.token);
                showMessage('message', 'Registration successful! Redirecting...', false);
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1000);
            } else {
                showMessage('message', data.message || 'Registration failed');
            }
        } catch (err) {
            showMessage('message', 'Server error');
        }
    });
}


async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        const categories = await res.json();
        const filterCategory = document.getElementById('filterCategory');
        const addCategory = document.getElementById('category_id');
        if (filterCategory) {
            filterCategory.innerHTML = '<option value="">All</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                filterCategory.appendChild(option);
            });
        }
        if (addCategory) {
            addCategory.innerHTML = '';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                addCategory.appendChild(option);
            });
        }
    } catch (err) {
        console.error('Failed to load categories', err);
    }
}

async function loadTransactions() {
    try {
        const type = document.getElementById('filterType')?.value || '';
        const categoryId = document.getElementById('filterCategory')?.value || '';
        let url = `${API_BASE}/transactions`;
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (categoryId) params.append('category_id', categoryId);
        if (params.toString()) url += '?' + params.toString();

        const res = await fetch(url, { headers: authHeader() });
        if (!res.ok) {
            if (res.status === 401) {
                removeToken();
                window.location.href = '/login.html';
                return;
            }
            throw new Error('Failed to load transactions');
        }
        const transactions = await res.json();
        renderTransactions(transactions);
        calculateSummary(transactions);
    } catch (err) {
        console.error(err);
    }
}

function renderTransactions(transactions) {
    const tbody = document.getElementById('transactionsBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    transactions.forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.description}</td>
            <td>${t.category ? t.category.name : '-'}</td>
            <td class="${t.type}">${t.type === 'income' ? 'Income' : 'Expense'}</td>
            <td class="${t.type}">£${t.amount}</td>
            <td>
                <button onclick="editTransaction(${t.id})">Edit</button>
                <button onclick="deleteTransaction(${t.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function calculateSummary(transactions) {
    let totalIncome = 0, totalExpense = 0;
    transactions.forEach(t => {
        if (t.type === 'income') totalIncome += parseFloat(t.amount);
        else totalExpense += parseFloat(t.amount);
    });
    const incomeSpan = document.getElementById('totalIncome');
    const expenseSpan = document.getElementById('totalExpense');
    const balanceSpan = document.getElementById('balance');
    if (incomeSpan) incomeSpan.textContent = totalIncome.toFixed(2);
    if (expenseSpan) expenseSpan.textContent = totalExpense.toFixed(2);
    if (balanceSpan) balanceSpan.textContent = (totalIncome - totalExpense).toFixed(2);
}

window.deleteTransaction = async function(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
        const res = await fetch(`${API_BASE}/transactions/${id}`, {
            method: 'DELETE',
            headers: authHeader()
        });
        if (res.ok) {
            loadTransactions();
        } else {
            alert('Delete failed');
        }
    } catch (err) {
        alert('Server error');
    }
};

function setupDashboard() {
    if (!getToken()) {
        window.location.href = '/login.html';
        return;
    }
    loadCategories();
    loadTransactions();
    setupEditForm();

    const filterBtn = document.getElementById('applyFilter');
    if (filterBtn) {
        filterBtn.addEventListener('click', loadTransactions);
    }

    const form = document.getElementById('transactionForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                description: document.getElementById('description').value,
                amount: parseFloat(document.getElementById('amount').value),
                type: document.getElementById('type').value,
                date: document.getElementById('date').value,
                category_id: parseInt(document.getElementById('category_id').value)
            };
            try {
                const res = await fetch(`${API_BASE}/transactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...authHeader() },
                    body: JSON.stringify(formData)
                });
                if (res.ok) {
                    alert('Transaction added');
                    loadTransactions();
                    form.reset();
                } else {
                    const data = await res.json();
                    alert('Error: ' + data.message);
                }
            } catch (err) {
                alert('Server error');
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    setupLogout();

    const path = window.location.pathname;

    if (path === '/login.html') {
        setupLogin();
    } else if (path === '/register.html') {
        setupRegister();
    } else if (path === '/dashboard.html') {
        setupDashboard();
    }
});



window.editTransaction = async function(id) {
  try {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      headers: authHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch transaction');
    const t = await res.json();

    document.getElementById('editId').value = t.id;
    document.getElementById('editDescription').value = t.description;
    document.getElementById('editAmount').value = t.amount;
    document.getElementById('editType').value = t.type;
    document.getElementById('editDate').value = t.date;

    await loadEditCategories(t.category_id);

    document.getElementById('editModal').style.display = 'block';
  } catch (err) {
    alert('Error loading transaction: ' + err.message);
  }
};

async function loadEditCategories(selectedCategoryId) {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const categories = await res.json();
    const select = document.getElementById('editCategory');
    select.innerHTML = '';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      if (cat.id === selectedCategoryId) option.selected = true;
      select.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load categories', err);
  }
}

window.closeEditModal = function() {
  document.getElementById('editModal').style.display = 'none';
};

function setupEditForm() {
  const form = document.getElementById('editForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const updatedData = {
      description: document.getElementById('editDescription').value,
      amount: parseFloat(document.getElementById('editAmount').value),
      type: document.getElementById('editType').value,
      date: document.getElementById('editDate').value,
      category_id: parseInt(document.getElementById('editCategory').value)
    };
    try {
      const res = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        alert('Transaction updated');
        closeEditModal();
        loadTransactions();
      } else {
        const data = await res.json();
        alert('Update failed: ' + data.message);
      }
    } catch (err) {
      alert('Server error');
    }
  });
}