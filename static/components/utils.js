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