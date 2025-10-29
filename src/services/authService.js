export async function login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@test.com" && password === "1234") {
          resolve({ token: "mock-token-123" });
        } else {
          reject("Felaktiga inloggningsuppgifter");
        }
      }, 700);
    });
  }
  
  export async function register(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Registrering lyckades (mock)" });
      }, 1000);
    });
  }