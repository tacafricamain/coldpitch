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
    
    try {
      // Try Supabase Auth first
      console.log('🔐 Attempting login with Supabase Auth...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.warn('⚠️ Supabase Auth failed:', authError.message);
        
        // Fallback to hardcoded admin credentials
        if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
          console.log('✅ Using hardcoded admin credentials');
          
          const { data: staffMember } = await supabase
            .from('staff')
            .select('id, name, email, role')
            .eq('email', email)
            .maybeSingle();

          const mockUser: User = staffMember || {
            id: '1',
            name: 'Spex Admin',
            email: MOCK_EMAIL,
            role: 'Admin',
          };
          
          localStorage.setItem('auth_user', JSON.stringify(mockUser));
          localStorage.setItem('auth_token', 'mock-jwt-token-' + Date.now());
          setUser(mockUser);
          
          if (staffMember) {
            try {
              await staffService.recordLogin(mockUser.id, mockUser.name);
            } catch (error) {
              console.warn('Failed to record login activity:', error);
            }
          }
          
          setIsLoading(false);
          return true;
        }
        
        setIsLoading(false);
        return false;
      }

      // Auth successful - get staff data
      console.log('✅ Supabase Auth successful');
      const userId = authData.user.id;
      
      const { data: staffMember, error: staffError } = await supabase
        .from('staff')
        .select('id, name, email, role')
        .eq('id', userId)
        .single();

      if (staffError || !staffMember) {
        console.error('❌ Staff record not found for auth user:', userId);
        await supabase.auth.signOut();
        setIsLoading(false);
        return false;
      }

      const user: User = {
        id: staffMember.id,
        name: staffMember.name,
        email: staffMember.email,
        role: staffMember.role,
      };
      
      // Store user and token
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', authData.session?.access_token || 'mock-token');
      
      setUser(user);
      
      // Record login activity
      try {
        await staffService.recordLogin(user.id, user.name);
        console.log('✅ Login activity recorded');
      } catch (error) {
        console.warn('Failed to record login activity (non-fatal):', error);
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('❌ Login error:', error);
      setIsLoading(false);
      return false;
    }
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
