const API_BASE = 'http://127.0.0.1:8000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('chvalue_token') || sessionStorage.getItem('chvalue_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getProducts = async (params = {}) => {
    try {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(API_BASE + '/products?' + query, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'API error');
        }
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProductStats = async (params = {}) => {
    try {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(API_BASE + '/products/stats?' + query, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'API error');
        }
        return data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

export const getGroupedProducts = async (params = {}) => {
    try {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(API_BASE + '/products/grouped?' + query, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'API error');
        }
        return data;
    } catch (error) {
        console.error('Error fetching grouped products:', error);
        throw error;
    }
};

export const getMetrics = async () => {
    try {
        const response = await fetch(API_BASE + '/metrics', {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'API error');
        }
        return data;
    } catch (error) {
        console.error('Error fetching metrics:', error);
        throw error;
    }
};

export const getOrders = async (params = {}) => {
    try {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(API_BASE + '/orders?' + query, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'API error');
        }
        return data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

// Authentication API functions
export const login = async (username, password) => {
    try {
        const response = await fetch(API_BASE + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.trim().toLowerCase(),
                password: password.trim(),
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || data.message || 'Login failed');
        }

        if (!data.success) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const refreshToken = async (refreshToken) => {
    try {
        const response = await fetch(API_BASE + '/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Token refresh failed');
        }

        return data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await fetch(API_BASE + '/auth/logout', {
            method: 'POST',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Logout failed');
        }

        return data;
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await fetch(API_BASE + '/auth/me', {
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to get user info');
        }

        if (!data.success) {
            throw new Error(data.error || 'Failed to get user info');
        }

        return data;
    } catch (error) {
        console.error('Error getting current user:', error);
        throw error;
    }
};