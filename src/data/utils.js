import CryptoJS from 'crypto-js';
const encryptionKey = import.meta.env.VITE_APP_API_URL
export const selectThemeColors = (theme) => ({
    ...theme,
    colors: {
        ...theme.colors,
        // primary25: '#7367f01a', // for option hover bg-color
        // primary: '#7367f0', // for selected option bg-color
        primary75: "#E7FFFE", // for option hover bg-color
        primary50: "#E7FFFE", // for option hover bg-color
        primary25: "#E7FFFE", // for option hover bg-color
        primary: "#00B1A9", // for selected option bg-color
        neutral10: "#D9DEE3", // for tags bg-color
        neutral20: "#D9DEE3", // for input border-color
        neutral30: "#16B3AC", // for input hover border-color
    },
});

export const returnRole = (role) => {
    if (role == "1") {
        return "Admin"
    } else if (role == "2") {
        return "PPK"
    } else if (role == "3") {
        return "User"
    } else if (role == "4") {
        return "Direktur"
    } else if (role == "5") {
        return "User"
    }
    else {
        return ""
    }
}

export const encryptId = (id) => {
    const encryptedId = CryptoJS.AES.encrypt(id.toString(), encryptionKey).toString();
    return encryptedId;
};

export const decryptId = (encryptedId) => {
    const decryptedId = CryptoJS.AES.decrypt(encryptedId, encryptionKey).toString(CryptoJS.enc.Utf8);
    return decryptedId;
};

export const formatRupiah = (price) => {
    return `${price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};