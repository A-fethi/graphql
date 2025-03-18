
const loginBtn = document.getElement("login-btn")
console.log(loginBtn);



const login = () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    fetch("https://learn.zone01oujda.ma/api/auth/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${btoa(email + ":" + password)}`
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(err => { throw new Error(err); });
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error(error))
}

loginBtn.addEventListener("click", login);