// Authentication Service

const API_URL = "http://localhost:5000";

export const authService = {
    login: async (credentials: any) => {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.emailOrPhone, password: credentials.password }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            throw new Error(data?.error || "Failed to login");
        }

        const user = await response.json();
        
        // Return fraudScore as well
        const userData = {
            id: user._id || "user_123",
            _id: user._id, // Explicitly add _id
            name: credentials.emailOrPhone.split("@")[0], // Mock name from email
            email: user.email,
            fraudScore: user.fraudScore || 0,
            token: "fake-jwt-token-123456" // mock token
        };

        sessionStorage.setItem("user", JSON.stringify(userData));
        return userData;
    },

    register: async (userData: any) => {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                email: userData.email, 
                password: userData.password,
                fullName: userData.fullName,
                phoneNumber: userData.phoneNumber,
                licenseNumber: userData.licenseNumber
            }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            throw new Error(data?.error || "Failed to register");
        }

        return await response.json().catch(() => ({}));
    },

    logout: () => {
        sessionStorage.removeItem("user");
    },

    isAuthenticated: () => {
        if (typeof window !== "undefined") {
            return !!sessionStorage.getItem("user");
        }
        return false;
    }
};

