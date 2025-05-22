export const getColor = () => {
    let value = "#"
    const hex = "0123456789ABCDEF"
    for (let i = 0; i < 6; i++) {
        value += hex[Math.floor(Math.random(i) * hex.length)]
    }
    return value
}

export const getExtension = (totalXP) => {
    if (totalXP >= 1000000000) {
        return (totalXP / 1000000000).toFixed(2) + " GB";
    } else if (totalXP >= 1000000) {
        return (totalXP / 1000000).toFixed(2) + " MB";
    } else if (totalXP >= 1000) {
        return (totalXP / 1000).toFixed(2) + " KB";
    } else {
        return totalXP + " B";
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
