const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper to get auth token from storage
const getAuthToken = (): string | null => {
  try {
    const authStorage = localStorage.getItem('vault-auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.accessToken || null;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return null;
};

// Helper to create authorized headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper for fetch with auth and auto-refresh
const authFetch = async (url: string, options: RequestInit = {}) => {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401) {
    try {
      // Try to refresh token
      const authStorage = localStorage.getItem('vault-auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        const refreshToken = parsed.state?.refreshToken;
        
        if (refreshToken) {
          const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            
            // Update storage with new token
            parsed.state.accessToken = refreshData.accessToken;
            localStorage.setItem('vault-auth-storage', JSON.stringify(parsed));
            localStorage.setItem('token', refreshData.accessToken);
            
            // Retry original request with new token
            response = await fetch(url, {
              ...options,
              headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshData.accessToken}`,
              },
            });
            
            return response;
          }
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    // If refresh failed, clear auth and redirect to login
    localStorage.removeItem('vault-auth-storage');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  return response;
};

export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }).then(r => r.json()),
    
    logout: () =>
      authFetch(`${API_URL}/api/auth/logout`, { method: 'POST' }).then(r => r.json()),
    
    me: () =>
      authFetch(`${API_URL}/api/auth/me`).then(r => r.json()),
    
    refresh: (refreshToken: string) =>
      fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      }).then(r => r.json()),
    
    register: (data: any) =>
      authFetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    
    getUsers: () =>
      authFetch(`${API_URL}/api/auth/users`).then(r => r.json()),
    
    updateUser: (id: string, data: any) =>
      authFetch(`${API_URL}/api/auth/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    
    deleteUser: (id: string) =>
      authFetch(`${API_URL}/api/auth/users/${id}`, { method: 'DELETE' }),
    
    changePassword: (currentPassword: string, newPassword: string) =>
      authFetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      }).then(r => r.json())
  },
  
  areas: {
    getAll: (params?: { city?: string; active?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.city) searchParams.append('city', params.city);
      if (params?.active !== undefined) searchParams.append('active', String(params.active));
      return authFetch(`${API_URL}/api/areas${searchParams.toString() ? '?' + searchParams.toString() : ''}`).then(r => r.json());
    },
    getOne: (id: string) => 
      authFetch(`${API_URL}/api/areas/${id}`).then(r => r.json()),
    create: (data: { name: string; description?: string; city?: string; isActive?: boolean }) => 
      authFetch(`${API_URL}/api/areas`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: { name?: string; description?: string; city?: string; isActive?: boolean }) => 
      authFetch(`${API_URL}/api/areas/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) => 
      authFetch(`${API_URL}/api/areas/${id}`, { method: 'DELETE' }),
    toggle: (id: string) =>
      authFetch(`${API_URL}/api/areas/${id}/toggle`, {
        method: 'POST'
      }).then(r => r.json())
  },
  
  equipment: {
    getAll: (city?: string) => 
      authFetch(`${API_URL}/api/equipment${city ? `?city=${city}` : ''}`).then(r => r.json()),
    getOne: (id: string) => 
      authFetch(`${API_URL}/api/equipment/${id}`).then(r => r.json()),
    create: (data: any) => 
      authFetch(`${API_URL}/api/equipment`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: any) => 
      authFetch(`${API_URL}/api/equipment/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) => 
      authFetch(`${API_URL}/api/equipment/${id}`, { method: 'DELETE' }),
    inspect: (id: string, data: any) =>
      authFetch(`${API_URL}/api/equipment/${id}/inspections`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    getInspections: (id: string) =>
      authFetch(`${API_URL}/api/equipment/${id}/inspections`).then(r => r.json()),
    getMaintenanceLogs: (id: string) =>
      authFetch(`${API_URL}/api/equipment/${id}/maintenance`).then(r => r.json())
  },
  
  eventBriefs: {
    getAll: (city?: string) => 
      authFetch(`${API_URL}/api/event-briefs${city ? `?city=${city}` : ''}`).then(r => r.json()),
    getOne: (id: string) => 
      authFetch(`${API_URL}/api/event-briefs/${id}`).then(r => r.json()),
    create: (data: any) => 
      authFetch(`${API_URL}/api/event-briefs`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: any) => 
      authFetch(`${API_URL}/api/event-briefs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) => 
      authFetch(`${API_URL}/api/event-briefs/${id}`, { method: 'DELETE' }),
    exportPDF: async (id: string, artist: string) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/event-briefs/${id}/export-pdf`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/pdf'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to export PDF: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-brief-${artist.replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
      } catch (error) {
        console.error('PDF Export Error:', error);
        throw error;
      }
    }
  },
  
  crew: {
    getAll: (city?: string, shift?: string) => 
      authFetch(`${API_URL}/api/crew?${city ? `city=${city}` : ''}${shift ? `&shift=${shift}` : ''}`).then(r => r.json()),
    getOne: (id: string) => 
      authFetch(`${API_URL}/api/crew/${id}`).then(r => r.json()),
    create: (data: any) => 
      authFetch(`${API_URL}/api/crew`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: any) => 
      authFetch(`${API_URL}/api/crew/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) => 
      authFetch(`${API_URL}/api/crew/${id}`, { method: 'DELETE' })
  },
  
  maintenance: {
    getAll: (city?: string) => 
      authFetch(`${API_URL}/api/maintenance${city ? `?city=${city}` : ''}`).then(r => r.json()),
    getOne: (id: string) => 
      authFetch(`${API_URL}/api/maintenance/${id}`).then(r => r.json()),
    create: (data: any) => 
      authFetch(`${API_URL}/api/maintenance`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: any) => 
      authFetch(`${API_URL}/api/maintenance/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) => 
      authFetch(`${API_URL}/api/maintenance/${id}`, { method: 'DELETE' })
  },
  
  incidents: {
    getAll: (city?: string) => 
      authFetch(`${API_URL}/api/incidents${city ? `?city=${city}` : ''}`).then(r => r.json()),
    create: (data: any) => 
      authFetch(`${API_URL}/api/incidents`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: any) => 
      authFetch(`${API_URL}/api/incidents/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) => 
      authFetch(`${API_URL}/api/incidents/${id}`, { method: 'DELETE' })
  },
  
  proposals: {
    getAll: (city?: string) => 
      authFetch(`${API_URL}/api/proposals${city ? `?city=${city}` : ''}`).then(r => r.json()),
    getOne: (id: string) => 
      authFetch(`${API_URL}/api/proposals/${id}`).then(r => r.json()),
    create: (data: any) => 
      authFetch(`${API_URL}/api/proposals`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: any) => 
      authFetch(`${API_URL}/api/proposals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) => 
      authFetch(`${API_URL}/api/proposals/${id}`, { method: 'DELETE' })
  },
  
  rnd: {
    getAll: (city?: string) => 
      authFetch(`${API_URL}/api/rnd${city ? `?city=${city}` : ''}`).then(r => r.json()),
    getOne: (id: string) => 
      authFetch(`${API_URL}/api/rnd/${id}`).then(r => r.json()),
    create: (data: any) => 
      authFetch(`${API_URL}/api/rnd`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: any) => 
      authFetch(`${API_URL}/api/rnd/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) => 
      authFetch(`${API_URL}/api/rnd/${id}`, { method: 'DELETE' })
  },
  
  consumables: {
    getAll: (city?: string, category?: string, lowStock?: boolean) => {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (category) params.append('category', category);
      if (lowStock !== undefined) params.append('lowStock', String(lowStock));
      return authFetch(`${API_URL}/api/consumables?${params.toString()}`).then(r => r.json());
    },
    getOne: (id: string) => 
      authFetch(`${API_URL}/api/consumables/${id}`).then(r => r.json()),
    create: (data: any) => 
      authFetch(`${API_URL}/api/consumables`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: any) => 
      authFetch(`${API_URL}/api/consumables/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) =>
      authFetch(`${API_URL}/api/consumables/${id}`, { method: 'DELETE' }),
    adjustStock: (id: string, data: { quantity: number; type: string; reference?: string; notes?: string; performedBy: string }) =>
      authFetch(`${API_URL}/api/consumables/${id}/adjust`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    getMovements: (id: string, page?: number, limit?: number) => {
      const params = new URLSearchParams();
      if (page) params.append('page', String(page));
      if (limit) params.append('limit', String(limit));
      return authFetch(`${API_URL}/api/consumables/${id}/movements?${params.toString()}`).then(r => r.json());
    },
    getAnalytics: (id: string) =>
      authFetch(`${API_URL}/api/consumables/${id}/analytics`).then(r => r.json()),
    deleteMovement: (movementId: string) =>
      authFetch(`${API_URL}/api/consumables/movements/${movementId}`, { method: 'DELETE' }),
    getLowStock: (city?: string) => {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      return authFetch(`${API_URL}/api/consumables/alerts/low-stock?${params.toString()}`).then(r => r.json());
    }
  },

  suppliers: {
    getAll: (city?: string, status?: string) => {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (status) params.append('status', status);
      return authFetch(`${API_URL}/api/suppliers?${params.toString()}`).then(r => r.json());
    },
    getOne: (id: string) =>
      authFetch(`${API_URL}/api/suppliers/${id}`).then(r => r.json()),
    create: (data: any) =>
      authFetch(`${API_URL}/api/suppliers`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: any) =>
      authFetch(`${API_URL}/api/suppliers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) =>
      authFetch(`${API_URL}/api/suppliers/${id}`, { method: 'DELETE' }),
    getStats: (id: string) =>
      authFetch(`${API_URL}/api/suppliers/${id}/stats`).then(r => r.json())
  },

  purchaseOrders: {
    getAll: (city?: string, status?: string, supplierId?: string) => {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (status) params.append('status', status);
      if (supplierId) params.append('supplierId', supplierId);
      return authFetch(`${API_URL}/api/purchase-orders?${params.toString()}`).then(r => r.json());
    },
    getOne: (id: string) =>
      authFetch(`${API_URL}/api/purchase-orders/${id}`).then(r => r.json()),
    create: (data: any) =>
      authFetch(`${API_URL}/api/purchase-orders`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: any) =>
      authFetch(`${API_URL}/api/purchase-orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) =>
      authFetch(`${API_URL}/api/purchase-orders/${id}`, { method: 'DELETE' }),
    receiveItems: (id: string, items: Array<{ purchaseOrderItemId: string; receivedQty: number }>, performedBy: string) =>
      authFetch(`${API_URL}/api/purchase-orders/${id}/receive`, {
        method: 'POST',
        body: JSON.stringify({ items, performedBy })
      }).then(r => r.json())
  },
  
  alerts: {
    getAll: (city?: string, acknowledged?: boolean) => 
      authFetch(`${API_URL}/api/alerts?${city ? `city=${city}` : ''}${acknowledged !== undefined ? `&acknowledged=${acknowledged}` : ''}`).then(r => r.json()),
    update: (id: string, data: any) => 
      authFetch(`${API_URL}/api/alerts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json())
  },
  
  kpi: {
    getCurrent: (city: string) => 
      authFetch(`${API_URL}/api/kpi/${city}/current`).then(r => r.json()),
    update: (city: string, data: any) => 
      authFetch(`${API_URL}/api/kpi/${city}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json())
  },

  permissions: {
    getAll: () =>
      authFetch(`${API_URL}/api/permissions`).then(r => r.json()),
    getByCategory: () =>
      authFetch(`${API_URL}/api/permissions/by-category`).then(r => r.json()),
    getByRole: (role: string) =>
      authFetch(`${API_URL}/api/permissions/role/${role}`).then(r => r.json()),
    create: (data: any) =>
      authFetch(`${API_URL}/api/permissions`, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    update: (id: string, data: any) =>
      authFetch(`${API_URL}/api/permissions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(r => r.json()),
    delete: (id: string) =>
      authFetch(`${API_URL}/api/permissions/${id}`, {
        method: 'DELETE'
      }).then(r => r.json()),
    toggleRolePermission: (role: string, permissionId: string, granted: boolean) =>
      authFetch(`${API_URL}/api/permissions/role/${role}/${permissionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ granted })
      }).then(r => r.json())
  },

  analytics: {
    getFinancialData: (city: string, timeRange: string) =>
      authFetch(`${API_URL}/api/analytics/financial?city=${city}&timeRange=${timeRange}`).then(r => r.json()),
    getEquipmentAnalytics: (city: string) =>
      authFetch(`${API_URL}/api/analytics/equipment?city=${city}`).then(r => r.json()),
    getTeamAnalytics: (city: string, timeRange: string) =>
      authFetch(`${API_URL}/api/analytics/team?city=${city}&timeRange=${timeRange}`).then(r => r.json()),
    exportReport: async (format: 'excel' | 'pdf', reportType: string, data: any) => {
      const token = getAuthToken();
      
      if (!token) {
        // Clear auth and redirect to login
        localStorage.removeItem('vault-auth-storage');
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('No authentication token found. Please login again.');
      }

      try {
      const response = await fetch(`${API_URL}/api/analytics/export`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ format, reportType, data })
      });        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Export failed' }));
          throw new Error(errorData.error || `Export failed with status ${response.status}`);
        }

        // Get filename from Content-Disposition header or create one
        const contentDisposition = response.headers.get('Content-Disposition');
        const fileExtension = format === 'pdf' ? 'pdf' : 'xlsx';
        let filename = `${reportType}_report_${Date.now()}.${fileExtension}`;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Download file (both PDF and Excel)
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        return { success: true, filename };
      } catch (error: any) {
        console.error('Export error details:', error);
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
          throw new Error('Cannot connect to server. Please check if the backend is running.');
        }
        throw error;
      }
    }
  }
};


