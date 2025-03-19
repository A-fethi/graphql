const loginBtn = document.getElementById("login-btn");
let jwt;

const checkAuth = () => {
    jwt = localStorage.getItem("jwt")
    if (jwt) {
        document.getElementById("logged-in-section").style.display = "block";
        document.getElementById("guest-section").style.display = "none";
    } else {
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
            Authorization: `Bearer ${btoa(email + ":" + password)}`
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
            localStorage.setItem("jwt", data);
            checkAuth();
        })
        .catch(error => console.error(error));
};


loginBtn.addEventListener("click", login);

const logout = () => {
    localStorage.removeItem("jwt");
    jwt = null;
    checkAuth();
};

const dataDisplay = (jwt) => {
    console.log(jwt);

    const query = `
        query GetUserInfo {
            user {
                id
                login
                email
            }
        }
    `;

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
            console.log("User Data:", data);
            document.getElementById("user-info").innerHTML = `
                <p>ID: ${data.data.user[0].id}</p>
                <p>Login: ${data.data.user[0].login}</p>
                <p>Email: ${data.data.user[0].email}</p>
            `;
        })
        .catch(error => console.error("Error fetching user data:", error));
};

dataDisplay(jwt);
checkAuth();