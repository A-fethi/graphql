import { lineChart } from "./components/linechart.js";
import { circleChart } from "./components/circlechart.js";
import { getExtension, showMessage } from "./components/utils.js";

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout")

let jwt;

const checkAuth = () => {
    jwt = localStorage.getItem("jwt")
    const expiry = localStorage.getItem("jwt_expiry");
    const now = Date.now();

    if (jwt && expiry && now < parseInt(expiry)) {
        document.getElementById("logged-in-section").style.display = "block";
        document.getElementById("guest-section").style.display = "none";
        dataDisplay(jwt);
    } else {
        localStorage.removeItem("jwt");
        localStorage.removeItem("jwt_expiry");
        document.getElementById("logged-in-section").style.display = "none";
        document.getElementById("guest-section").style.display = "block";
    }
};

const login = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("https://learn.zone01oujda.ma/api/auth/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(email + ":" + password)}`
        }
    })
        .then(async response => {
            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }
            return response.json();
        })
        .then(data => {
            const now = Date.now()
            localStorage.setItem("jwt", data);
            localStorage.setItem("jwt_expiry", now + 3600000)
            showMessage("Login successful!", "success")
            checkAuth();
            dataDisplay(data);
            setTimeout(() => {
                localStorage.removeItem("jwt");
                localStorage.removeItem("jwt_expiry");
                showMessage("Session expired. Please log in again.", "error");
                checkAuth();
            }, 3600000);
        })
        .catch(error => {
            console.error(error)
            showMessage("Login failed", "error")
        });
};

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        login()
    }
})
loginBtn.addEventListener("click", login);

const logout = () => {
    localStorage.removeItem("jwt");
    jwt = null;
    showMessage("Logout successful", "success")
    checkAuth();
};

logoutBtn.addEventListener('click', logout)

const dataDisplay = (jwt) => {
    const query = `{
        user {
            id
            login
            email
            firstName
            lastName
            auditRatio
        }
        
        xpTransactions: transaction(where: {
            _and: [{type: {_eq: "xp"}}, {eventId: {_eq: 41}}, {object: {type: {_eq: "project"}}}]
        }) {
            path
            amount
            object {
                type
                name
            }
        }
    
        allXpTransactions: transaction(where: {
            _and: [{type: {_eq: "xp"}}, {eventId: {_eq: 41}}]
        }) {
            path
            createdAt
            amount
            object {
                type
                name
            }
        }
    }`;

    fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({ query })
    })
        .then(async response => {
            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }
            return response.json();
        })
        .then(data => {
            const user = data.data.user[0];
            const xpTransactions = data.data.xpTransactions;
            const allXpTransactions = data.data.allXpTransactions;

            let totalXp = 0;

            for (let i = 0; i < allXpTransactions.length; i++) {
                totalXp += allXpTransactions[i].amount
            }


            document.getElementById("user-info-content").innerHTML = `
                <p>ID: ${user.id}</p>
                <p>Login: ${user.login}</p>
                <p>Email: ${user.email}</p>
                <p>Audits ratio: ${(user.auditRatio).toFixed(1)}</p>
                <p>Total XP: ${getExtension(totalXp)}</p>
            `;
            updateUI(user);
            lineChart(allXpTransactions);
            circleChart(xpTransactions)
        })
        .catch(error => console.error("Error fetching user data:", error));
};

const updateUI = (user) => {
    if (user) {
        document.getElementById('welcome-message').innerHTML = `Welcome ${user.firstName} ${user.lastName}!`
    }
}

checkAuth();
