import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import AppDataSource from '../data-source';
import { Role } from '../../auth/enums/role.enum';
import { User } from '../../users/entities/user.entity';

async function seedAdminUser(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  const existingAdmin = await userRepository.findOne({
    where: { role: Role.ADMIN },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping seed.');
    return;
  }

  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@example.com';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? 'Admin@123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = userRepository.create({
    email: adminEmail,
    name: 'System Admin',
    password: hashedPassword,
    role: Role.ADMIN,
    isActive: true,
  });

  await userRepository.save(adminUser);

  console.log(`Default admin created with email: ${adminEmail}`);
}

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    await seedAdminUser(AppDataSource);
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Unable to seed default admin user:', error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

void bootstrap();
