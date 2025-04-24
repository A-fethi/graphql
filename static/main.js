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
            if (data.errors) {
                logout()
                return
            }

            const user = data.data.user[0];
            const xpTransactions = data.data.xpTransactions;
            const allXpTransactions = data.data.allXpTransactions;


            let totalXp = 0;

            for (let i = 0; i < allXpTransactions.length; i++) {
                totalXp += allXpTransactions[i].amount
            }

            const persoContent = document.getElementById("personal-info-div")
            persoContent.classList.add("personal-info", "card")
            persoContent.innerHTML = `
                <h1>Personal Informations</h1>
                <div id="personal-info-content">
                <p>First Name: <span>${user.firstName}</span></p>
                <p>Last Name: <span>${user.lastName}</span></p>
                </div>
            `;

            const accountContent = document.getElementById("account-info-div")
            accountContent.classList.add("account-info", "card")
            accountContent.innerHTML = `
                <h1>Account Details</h1>
                <div id="account-info-content">
                <p>ID: <span>${user.id}</span></p>
                <p>Login: <span>${user.login}</span></p>
                <p>Email: <span>${user.email}</span></p></div>
            `;

            const remove = document.getElementsByClassName("remove")
            const section = document.getElementById("logged-in-section")

            if (allXpTransactions.length === 0 || xpTransactions.length === 0) {
                // const elementsToRemove = [...stats, ...xpProject, ...xpProg];
                for (let i = 0; i < remove.length; i++) {
                    remove[i].remove();
                }
                const warning = document.createElement("div")
                warning.classList.add("card", "data-error")
                warning.innerHTML = "This account does not include data to generate svg charts!"
                section.append(warning)
                return
            } else {

                document.getElementById("stats-info-div").innerHTML = `
                    <p>Audits ratio: <span>${(user.auditRatio).toFixed(1)}</span></p>
                    <p>Total XP: <span>${getExtension(totalXp)}</span></p>
                `;
    
                document.getElementById("xp-pie-div").innerHTML = `
                    <h1>XP by Project</h1>
                    <svg id="xpPieChart" width="300" height="300" viewBox="-150 -150 300 300"></svg>
                `
    
                document.getElementById("xp-progression-div").innerHTML = `
                    <h1>XP Progression</h1>
                    <svg id="xpGraph" width="100%" height="400"></svg>
                `
    
                lineChart(allXpTransactions);
                circleChart(xpTransactions)
            }

        })
        .catch(error => console.error("Error fetching user data:", error));
};

checkAuth();

const themeToggleBtn = document.getElementById("theme-toggle");

const setThemeIcon = () => {
    if (document.body.classList.contains("light-mode")) {
        themeToggleBtn.textContent = "🌞";
    } else {
        themeToggleBtn.textContent = "🌙";
    }
};

const currentTheme = localStorage.getItem("theme");
if (currentTheme === "light") {
    document.body.classList.add("light-mode");
}
setThemeIcon();

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    setThemeIcon();
});
