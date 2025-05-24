export const getColor = () => {
    let value = "#"
    const hex = "0123456789ABCDEF"
    for (let i = 0; i < 6; i++) {
        value += hex[Math.floor(Math.random(i) * hex.length)]
    }
    return value
}

export const getExtension = (totalXP) => {
    const sign = totalXP < 0 ? "-" : "";
    const absXP = Math.abs(totalXP);

    if (absXP >= 1000000000) {
        return sign + (absXP / 1000000000).toFixed(2) + " GB";
    } else if (absXP >= 1000000) {
        return sign + (absXP / 1000000).toFixed(2) + " MB";
    } else if (absXP >= 1000) {
        return sign + (absXP / 1000).toFixed(2) + " KB";
    } else {
        return sign + absXP + " B";
    }
};

export const showMessage = (message, type = "success") => {
    const messageBox = document.getElementById("message-box");
    messageBox.innerHTML = message;

    messageBox.className = "message-box";
    messageBox.classList.add(type);
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 3000);
};
