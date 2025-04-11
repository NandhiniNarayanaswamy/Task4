const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income');
const expenseDisplay = document.getElementById('expense');
const resetBtn = document.getElementById('reset-btn');

const filterRadios = document.getElementsByName('filter');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentFilter = 'all';

function renderTransactions() {
    transactionList.innerHTML = '';
    const filteredTransactions = transactions.filter(transaction => {
        if (currentFilter === 'income') return transaction.amount > 0;
        if (currentFilter === 'expense') return transaction.amount < 0;
        return true;
    });

    filteredTransactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.classList.add(transaction.amount >= 0 ? 'income' : 'expense');

        li.innerHTML = `
      ${transaction.description} <span>$${transaction.amount.toFixed(2)}</span>
      <div class="actions">
        <button onclick="editTransaction(${index})">Edit</button>
        <button onclick="deleteTransaction(${index})">Delete</button>
      </div>
    `;

        transactionList.appendChild(li);
    });

    updateSummary();
    saveTransactions();
}

function updateSummary() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0);
    const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0);
    const expense = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0);

    balanceDisplay.textContent = `$${total.toFixed(2)}`;
    incomeDisplay.textContent = `$${income.toFixed(2)}`;
    expenseDisplay.textContent = `$${Math.abs(expense).toFixed(2)}`;
}

function addTransaction(e) {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    if (!description || isNaN(amount)) return;

    transactions.push({ description, amount });
    descriptionInput.value = '';
    amountInput.value = '';
    renderTransactions();
}

function editTransaction(index) {
    const transaction = transactions[index];
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    deleteTransaction(index);
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    renderTransactions();
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

filterRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        currentFilter = radio.value;
        renderTransactions();
    });
});

resetBtn.addEventListener('click', () => {
    descriptionInput.value = '';
    amountInput.value = '';
});

transactionForm.addEventListener('submit', addTransaction);

renderTransactions();
