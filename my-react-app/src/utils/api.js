// frontend/src/utils/api.js

export const checkExistingEmail = async (email) => {
    try {
      const response = await fetch("http://localhost:5000/checkEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.exists;
      } else {
        console.error("Error checking existing email:", response.statusText);
        return false;
      }
    } catch (error) {
      console.error("Error checking existing email:", error.message);
      return false;
    }
  };
  