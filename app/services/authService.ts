// Mock Authentication Service

export const authService = {
    // Mock login that returns a fake user object
    login: async (credentials: any) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (credentials.emailOrPhone && credentials.password) {
                    
                    // Check if we already have a registered user in local storage so we don't overwrite their name
                    const existingUserRaw = localStorage.getItem("user");
                    let name = "Demo User";
                    if (existingUserRaw) {
                        try {
                            const parsed = JSON.parse(existingUserRaw);
                            if (parsed.email === credentials.emailOrPhone && parsed.name) {
                                name = parsed.name; // Keep their registered name!
                            }
                        } catch(e) {}
                    }

                    const user = {
                        id: "user_123",
                        name: name,
                        email: credentials.emailOrPhone,
                        token: "fake-jwt-token-123456"
                    };
                    localStorage.setItem("user", JSON.stringify(user));
                    resolve(user);
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 800); // Simulate network delay
        });
    },

    // Mock register
    register: async (userData: any) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Registered new user:", userData);
                resolve({ success: true, message: "Registration successful" });
            }, 1000);
        });
    },

    // Mock logout
    logout: () => {
        localStorage.removeItem("user");
    },
    
    // Check auth status
    isAuthenticated: () => {
        if (typeof window !== "undefined") {
            return !!localStorage.getItem("user");
        }
        return false;
    }
};
