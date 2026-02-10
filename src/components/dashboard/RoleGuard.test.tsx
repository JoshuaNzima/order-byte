import { render, screen } from '@testing-library/react';
import { RoleProvider } from '@/context/RoleContext';
import { RoleGuard, RoleBadge } from '@/components/dashboard/RoleGuard';

describe('RoleGuard', () => {
  it('renders children when role has permission', () => {
    render(
      <RoleProvider initialRole="admin">
        <RoleGuard allowedRoles={['admin', 'manager']}>
          <div data-testid="protected-content">Protected Content</div>
        </RoleGuard>
      </RoleProvider>
    );
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('renders fallback when role does not have permission', () => {
    render(
      <RoleProvider initialRole="waiter">
        <RoleGuard 
          allowedRoles={['admin', 'manager']}
          fallback={<div data-testid="fallback">Access Denied</div>}
        >
          <div data-testid="protected-content">Protected Content</div>
        </RoleGuard>
      </RoleProvider>
    );
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('renders nothing when role does not have permission and no fallback provided', () => {
    const { container } = render(
      <RoleProvider initialRole="chef">
        <RoleGuard allowedRoles={['admin']}>
          <div data-testid="protected-content">Protected Content</div>
        </RoleGuard>
      </RoleProvider>
    );
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it('allows multiple roles to access content', () => {
    const allowedRoles = ['chef', 'barman', 'manager'] as const;
    
    // Test with chef
    const { rerender } = render(
      <RoleProvider initialRole="chef">
        <RoleGuard allowedRoles={[...allowedRoles]}>
          <div data-testid="kitchen-content">Kitchen Content</div>
        </RoleGuard>
      </RoleProvider>
    );
    
    expect(screen.getByTestId('kitchen-content')).toBeInTheDocument();
    
    // Test with barman (simulate re-render with different provider)
    rerender(
      <RoleProvider initialRole="barman">
        <RoleGuard allowedRoles={[...allowedRoles]}>
          <div data-testid="kitchen-content">Kitchen Content</div>
        </RoleGuard>
      </RoleProvider>
    );
    
    expect(screen.getByTestId('kitchen-content')).toBeInTheDocument();
  });
});

describe('RoleBadge', () => {
  it.each([
    ['admin', 'Admin'],
    ['manager', 'Manager'],
    ['chef', 'Chef'],
    ['barman', 'Barman'],
    ['reception', 'Reception'],
    ['waiter', 'Waiter'],
    ['staff', 'Staff'],
  ])('renders correct label for role %s', (role, expectedLabel) => {
    render(<RoleBadge role={role as any} />);
    
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<RoleBadge role="admin" className="custom-class" />);
    
    expect(screen.getByText('Admin')).toHaveClass('custom-class');
  });

  it('has color-coded styling', () => {
    render(<RoleBadge role="admin" />);
    
    const badge = screen.getByText('Admin');
    expect(badge).toHaveClass('bg-purple-100', 'text-purple-800', 'border-purple-200');
  });
});
