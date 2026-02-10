import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleProvider, useRole, type StaffRole } from '@/context/RoleContext';

// Test component that consumes the context
function TestConsumer() {
  const { role, setRole, hasPermission } = useRole();
  
  return (
    <div>
      <div data-testid="current-role">{role}</div>
      <div data-testid="has-admin">{hasPermission(['admin']) ? 'yes' : 'no'}</div>
      <div data-testid="has-manager">{hasPermission(['manager']) ? 'yes' : 'no'}</div>
      <button onClick={() => setRole('manager')}>Switch to Manager</button>
      <button onClick={() => setRole('chef')}>Switch to Chef</button>
    </div>
  );
}

describe('RoleContext', () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie = 'ob_demo_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  it('provides default role of admin', () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>
    );
    
    expect(screen.getByTestId('current-role')).toHaveTextContent('admin');
  });

  it('allows setting a custom initial role', () => {
    render(
      <RoleProvider initialRole="chef">
        <TestConsumer />
      </RoleProvider>
    );
    
    expect(screen.getByTestId('current-role')).toHaveTextContent('chef');
  });

  it('updates role when setRole is called', async () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>
    );
    
    expect(screen.getByTestId('current-role')).toHaveTextContent('admin');
    
    await userEvent.click(screen.getByText('Switch to Manager'));
    
    expect(screen.getByTestId('current-role')).toHaveTextContent('manager');
  });

  it('hasPermission returns correct values', async () => {
    render(
      <RoleProvider initialRole="manager">
        <TestConsumer />
      </RoleProvider>
    );
    
    // Manager does not have admin permission
    expect(screen.getByTestId('has-admin')).toHaveTextContent('no');
    // Manager has manager permission
    expect(screen.getByTestId('has-manager')).toHaveTextContent('yes');
    
    // Switch to admin
    await act(async () => {
      await userEvent.click(screen.getByText('Switch to Chef'));
    });
    
    // Chef has neither admin nor manager permission in this test
    expect(screen.getByTestId('has-admin')).toHaveTextContent('no');
    expect(screen.getByTestId('has-manager')).toHaveTextContent('no');
  });

  it('persists role to cookie', async () => {
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>
    );
    
    await userEvent.click(screen.getByText('Switch to Manager'));
    
    // Check that cookie was set
    expect(document.cookie).toContain('ob_demo_role=manager');
  });

  it('reads role from existing cookie', () => {
    // Set cookie before rendering
    document.cookie = 'ob_demo_role=barman; path=/';
    
    render(
      <RoleProvider>
        <TestConsumer />
      </RoleProvider>
    );
    
    expect(screen.getByTestId('current-role')).toHaveTextContent('barman');
  });
});
