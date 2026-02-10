import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleProvider } from '@/context/RoleContext';
import RoleSwitcher from '@/components/dashboard/RoleSwitcher';

describe('RoleSwitcher', () => {
  beforeEach(() => {
    // Clear cookies
    document.cookie = 'ob_demo_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  it('renders current role label', () => {
    render(
      <RoleProvider initialRole="admin">
        <RoleSwitcher />
      </RoleProvider>
    );
    
    expect(screen.getByText('Role: Admin')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    render(
      <RoleProvider>
        <RoleSwitcher />
      </RoleProvider>
    );
    
    await userEvent.click(screen.getByText('Role: Admin'));
    
    expect(screen.getByText('Switch Role (Demo)')).toBeInTheDocument();
    expect(screen.getByText('Chef')).toBeInTheDocument();
    expect(screen.getByText('Barman')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('switches role when selecting from dropdown', async () => {
    render(
      <RoleProvider>
        <RoleSwitcher />
      </RoleProvider>
    );
    
    // Open dropdown
    await userEvent.click(screen.getByText('Role: Admin'));
    
    // Select a different role
    await userEvent.click(screen.getByText('Chef'));
    
    // Button should now show new role
    expect(screen.getByText('Role: Chef')).toBeInTheDocument();
  });

  it('closes dropdown when selecting a role', async () => {
    render(
      <RoleProvider>
        <RoleSwitcher />
      </RoleProvider>
    );
    
    // Open dropdown
    await userEvent.click(screen.getByText('Role: Admin'));
    expect(screen.getByText('Switch Role (Demo)')).toBeInTheDocument();
    
    // Select role
    await userEvent.click(screen.getByText('Manager'));
    
    // Dropdown should be closed
    expect(screen.queryByText('Switch Role (Demo)')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <RoleProvider>
        <RoleSwitcher />
      </RoleProvider>
    );
    
    // Open dropdown
    await userEvent.click(screen.getByText('Role: Admin'));
    expect(screen.getByText('Switch Role (Demo)')).toBeInTheDocument();
    
    // Click the overlay (fixed div that covers entire screen behind dropdown)
    const overlay = document.querySelector('.fixed.inset-0.z-40');
    if (overlay) {
      await userEvent.click(overlay);
    }
    
    // Dropdown should be closed
    expect(screen.queryByText('Switch Role (Demo)')).not.toBeInTheDocument();
  });

  it('marks current role with checkmark', async () => {
    render(
      <RoleProvider initialRole="chef">
        <RoleSwitcher />
      </RoleProvider>
    );
    
    await userEvent.click(screen.getByText('Role: Chef'));
    
    // Chef should be the current role
    const chefButton = screen.getByText('Chef').closest('button');
    expect(chefButton).toHaveClass('bg-gray-50', 'font-medium');
  });

  it('has different color styles for different roles', () => {
    // Test admin role
    const { unmount } = render(
      <RoleProvider key="admin" initialRole="admin">
        <RoleSwitcher />
      </RoleProvider>
    );
    
    const adminButton = document.querySelector('button.bg-purple-100');
    expect(adminButton).toBeInTheDocument();
    expect(adminButton).toHaveClass('text-purple-800');
    
    unmount();
    
    // Test chef role
    render(
      <RoleProvider key="chef" initialRole="chef">
        <RoleSwitcher />
      </RoleProvider>
    );
    
    const chefButton = document.querySelector('button.bg-orange-100');
    expect(chefButton).toBeInTheDocument();
    expect(chefButton).toHaveClass('text-orange-800');
  });
});
