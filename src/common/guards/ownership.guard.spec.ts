import {
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../../auth/enums/role.enum';
import { OwnershipGuard } from './ownership.guard';

describe('OwnershipGuard', () => {
  let repository: { findOne: jest.Mock };
  let guard: OwnershipGuard;

  const createContext = (user: any, id = 'product-1') =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          params: { id },
        }),
      }),
    }) as ExecutionContext;

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
    };

    guard = new OwnershipGuard(repository as any);
  });

  it('allows an admin to access any product', async () => {
    repository.findOne.mockResolvedValue({
      id: 'product-1',
      creator: { id: 'vendor-2' },
    });

    await expect(
      guard.canActivate(createContext({ id: 'admin-1', role: Role.ADMIN })),
    ).resolves.toBe(true);
  });

  it('allows a vendor to access their own product', async () => {
    repository.findOne.mockResolvedValue({
      id: 'product-1',
      creator: { id: 'vendor-1' },
    });

    await expect(
      guard.canActivate(createContext({ id: 'vendor-1', role: Role.VENDOR })),
    ).resolves.toBe(true);
  });

  it('throws a forbidden error when a vendor accesses another vendor product', async () => {
    repository.findOne.mockResolvedValue({
      id: 'product-1',
      creator: { id: 'vendor-2' },
    });

    await expect(
      guard.canActivate(createContext({ id: 'vendor-1', role: Role.VENDOR })),
    ).rejects.toThrow(
      new ForbiddenException(
        'You do not have permission to modify or delete this resource',
      ),
    );
  });

  it('throws a not found error when the product does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(
      guard.canActivate(createContext({ id: 'vendor-1', role: Role.VENDOR })),
    ).rejects.toThrow(new NotFoundException('Resource not found'));
  });
});
