"use strict";
const account1 = {
    owner: "muhammad haroon",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: "muhammad ali",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: "muhammad sarim",
    movements: [200, 200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: "java script",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const labelDate2 = document.querySelector(".date2");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const currencies = new Map([
    ["USD", "United States dollar"],
    ["EUR", "Euro"],
    ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

let d = new Date();
labelDate.innerText = `${d.getDate()}/0${d.getMonth() + 1}/${d.getFullYear()}`;

function displayTime() {
    let time = new Date();
    let hour = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    if (hour > 12) {
        hour = hour - 12;
    }
    if (hour == 0) {
        hour = 12;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    labelDate2.innerText = `${hour}:${minutes}:${seconds}`;
}
setInterval(displayTime, 10);

function display(movements, sort = false) {
    containerMovements.innerHTML = "";
    let movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
    movs.forEach(function(move, index) {
        const type = move > 0 ? "deposit" : "withdrawal";
        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
            <div class="movements__value">${move}</div>
        </div>`;
        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
}

function calBal(acc) {
    acc.balance = acc.movements.reduce((sum, current) => sum + current, 0);
    labelBalance.innerText = `${acc.balance} Rs`;
}

const createUsername = function(acco) {
    acco.forEach(function(acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(" ")
            .map((name) => name[0])
            .join("");
    });
};
createUsername(accounts);
const displaySummary = function(acc) {
    const incomes = acc.movements
        .filter((move) => move > 0)
        .reduce((acc, move) => acc + move, 0);
    labelSumIn.innerText = incomes;
    const outcomes = acc.movements
        .filter((move) => move < 0)
        .reduce((acc, move) => acc + move, 0);
    labelSumOut.innerText = Math.abs(outcomes);
    const interest = acc.movements
        .filter((move) => move > 0)
        .map((move) => move * 0.012)
        .filter((inte) => inte >= 1)
        .reduce((sum, value) => sum + value, 0);
    labelSumInterest.innerText = `${acc.interestRate}%`;
};

function updateUI(currentAccount) {
    display(currentAccount.movements);
    calBal(currentAccount);
    displaySummary(currentAccount);
}
let currentAccount;
btnLogin.addEventListener("click", function(e) {
    e.preventDefault();
    currentAccount = accounts.find(
        (acc) => inputLoginUsername.value === acc.username
    );
    console.log(currentAccount);
    if (currentAccount.pin === Number(inputLoginPin.value)) {
        containerApp.style.opacity = 100;
        let welcomeName = currentAccount.owner.split(" ")[0];
        inputLoginUsername.value = inputLoginPin.value = "";
        labelWelcome.innerText = `Welcome Back, Mr ${welcomeName}`;
        updateUI(currentAccount);
    }
});
btnTransfer.addEventListener("click", function(e) {
    e.preventDefault();
    let amount = Number(inputTransferAmount.value);
    let receiver = accounts.find((acc) => acc.username === inputTransferTo.value);
    inputTransferTo.value = inputTransferAmount.value = "";
    if (
        amount > 0 &&
        receiver.username !== currentAccount.username &&
        currentAccount.balance >= amount
    ) {
        currentAccount.movements.push(-amount);
        receiver.movements.push(amount);
        updateUI(currentAccount);
    }
});
btnClose.addEventListener("click", function(e) {
    e.preventDefault();

    inputCloseUsername;
    inputClosePin;
    if (
        inputCloseUsername.value === currentAccount.username &&
        Number(inputClosePin.value) === currentAccount.pin
    ) {
        let u = accounts.findIndex(
            (acc) => acc.username === inputCloseUsername.value
        );
        accounts.splice(u, 1);
        containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = "";
});
btnLoan.addEventListener("click", function(e) {
    e.preventDefault();
    let amount = Number(inputLoanAmount.value);
    if (
        amount > 0 &&
        currentAccount.movements.some((mov) => mov >= amount * 0.1)
    ) {
        currentAccount.movements.push(amount);
        updateUI(currentAccount);
    }
    inputLoanAmount.value = "";
});
let b = false;
btnSort.addEventListener("click", function(e) {
    e.preventDefault();
    display(currentAccount.movements, !b);
    b = !b;
});