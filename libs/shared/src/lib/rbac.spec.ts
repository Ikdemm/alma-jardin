import type { PermissionCode } from './permissions';

describe('hasPermission', () => {
  it('grants all permissions to super admin', async () => {
    const { hasPermission } = await import('./rbac');

    expect(
      hasPermission(
        { isSuperAdmin: true, permissions: [] },
        'admins.delete',
      ),
    ).toBe(true);
  });

  it('checks effective permissions for regular admin', async () => {
    const { hasPermission } = await import('./rbac');
    const permissions = ['admins.read', 'roles.read'] as PermissionCode[];

    expect(
      hasPermission({ isSuperAdmin: false, permissions }, 'admins.read'),
    ).toBe(true);
    expect(
      hasPermission({ isSuperAdmin: false, permissions }, 'admins.delete'),
    ).toBe(false);
  });
});
