import { MigrationInterface, QueryRunner } from 'typeorm';
import UserEntity from '@user/models/user.model';
import initialAdminOptions from '@database/config/initial-admin.config';

class AdminSeeding implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const admin = queryRunner.manager.create<UserEntity>(UserEntity, {
      username: initialAdminOptions.username,
      password: initialAdminOptions.password,
    });

    await queryRunner.manager.save(admin);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const admin = queryRunner.manager.create<UserEntity>(UserEntity, {
      username: initialAdminOptions.username,
      password: initialAdminOptions.password,
    });

    await queryRunner.manager.softRemove(admin);
  }
}

export default AdminSeeding;
