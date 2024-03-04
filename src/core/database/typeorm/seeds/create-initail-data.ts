import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user/user.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    await userRepository.insert([
      {
        githubId: 23456,
        avatarUrl: '',
        githubUrl: '',
        nickname: 'test',
        refreshToken: '',
      },
      {
        githubId: 23456778,
        avatarUrl: '',
        githubUrl: '',
        nickname: 'test2',
        refreshToken: '',
      },
    ]);
  }
}
