import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { staffService } from '../services/staffService';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock credentials - update these to match your actual staff emails
const MOCK_EMAIL = 'contact.jahswill@gmail.com';
const MOCK_PASSWORD = 'spex12+++';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check credentials
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      // Fetch the actual staff member from database to get real UUID
      try {
        console.log('Fetching staff member from database...');
        console.log('Email to search:', email);
        
        const { data: staffMember, error: staffError } = await supabase
          .from('staff')
          .select('id, name, email, role')
          .eq('email', email)
          .maybeSingle(); // Use maybeSingle instead of single to avoid 406 error

        console.log('Query result - Data:', staffMember);
        console.log('Query result - Error:', staffError);

        if (staffError) {
          console.error('❌ Supabase error:', staffError);
          throw staffError;
        }

        if (!staffMember) {
          console.error('❌ No staff member found for email:', email);
          console.log('🔍 Let me try to list all staff to debug...');
          
          // Debug: Try to get all staff
          const { data: allStaff, error: allError } = await supabase
            .from('staff')
            .select('id, email')
            .limit(10);
          
          console.log('All staff in database:', allStaff);
          console.log('All staff error:', allError);
          
          throw new Error('Staff member not found');
        }

        console.log('✅ Staff member found:', staffMember);
        console.log('   UUID:', staffMember.id);
        console.log('   Type:', typeof staffMember.id);

        const mockUser: User = {
          id: staffMember.id,
          name: staffMember.name,
          email: staffMember.email,
          role: staffMember.role,
        };
        
        // Store user and token
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        localStorage.setItem('auth_token', 'mock-jwt-token-' + Date.now());
        
        setUser(mockUser);
        
        // Record login activity with real UUID
        try {
          await staffService.recordLogin(mockUser.id, mockUser.name);
          console.log('✅ Login activity recorded');
        } catch (error) {
          console.warn('Failed to record login activity (non-fatal):', error);
        }
        
        setIsLoading(false);
        return true;
      } catch (error) {
        console.error('❌ Failed to fetch staff member from database:', error);
        console.log('Using fallback mock user');
        
        // Fallback to mock user if database query fails
        const mockUser: User = {
          id: '1',
          name: 'Spex Admin',
          email: MOCK_EMAIL,
          role: 'Admin',
        };
        
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        localStorage.setItem('auth_token', 'mock-jwt-token-' + Date.now());
        
        setUser(mockUser);
        setIsLoading(false);
        return true;
      }
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    // Record logout activity before clearing user
    if (user) {
      try {
        staffService.recordLogout(user.id, user.name);
      } catch (error) {
        console.error('Failed to record logout activity:', error);
      }
    }
    
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
