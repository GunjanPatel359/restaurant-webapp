export const setCookie = (name, value, days,secure) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    // Set the cookie with Secure and SameSite=None
    document.cookie =
      name + "=" + (value || "") + expires + `; path=/; Secure=${secure===true?true:false}; SameSite=None`;
};