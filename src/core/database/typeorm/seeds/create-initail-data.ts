import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user/user.entity';
import { Post } from 'src/entities/post/post.entity';
import { Scrap } from 'src/entities/scrap/scrap.entity';
import { Subscription } from 'src/entities/subscription/subscription.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const postRepository = dataSource.getRepository(Post);
    const scrapRepository = dataSource.getRepository(Scrap);
    const subscriptionRepository = dataSource.getRepository(Subscription);

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
      {
        githubId: 23466778,
        avatarUrl: '',
        githubUrl: '',
        nickname: 'test3',
        refreshToken: '',
      },
      {
        githubId: 23486778,
        avatarUrl: '',
        githubUrl: '',
        nickname: 'test4',
        refreshToken: '',
      },
      {
        githubId: 23416778,
        avatarUrl: '',
        githubUrl: '',
        nickname: 'test5',
        refreshToken: '',
      },
      {
        githubId: 23356778,
        avatarUrl: '',
        githubUrl: '',
        nickname: 'test6',
        refreshToken: '',
      },
      {
        githubId: 23956778,
        avatarUrl: '',
        githubUrl: '',
        nickname: 'test7',
        refreshToken: '',
      },
    ]);

    await postRepository.insert([
      {
        writerId: 1,
        title: 'test',
        thumbnail: 'test',
        link: 'test',
        description: 'test',
        category: 'ANDROID',
      },
      {
        writerId: 2,
        title: 'test',
        thumbnail: 'test',
        link: 'test',
        description: 'test',
        category: 'NODEJS',
      },
      {
        writerId: 3,
        title: 'asdasd',
        thumbnail: 'dsfsdf',
        link: 'test',
        description: 'asdsad',
        category: 'NODEJS',
      },
      {
        writerId: 4,
        title: 'fsdgfg',
        thumbnail: 'adsfds',
        link: 'test',
        description: 'dsafdsaf',
        category: 'WEB_DEV',
      },
      {
        writerId: 5,
        title: 'sagdfgs',
        thumbnail: 'sdfsdf',
        link: 'test',
        description: 'sfdgfdg',
        category: 'ANDROID',
      },
      {
        writerId: 2,
        title: 'asdfdasf',
        thumbnail: 'dsfasdf',
        link: 'test',
        description: 'dfafd',
        category: 'IOS',
      },
      {
        writerId: 3,
        title: 'fdsafds',
        thumbnail: 'asdfadsf',
        link: 'test',
        description: 'fadggf',
        category: 'IOS',
      },

      {
        writerId: 8,
        title: 'fdsafds',
        thumbnail: 'asdfadsf',
        link: 'test',
        description: 'fadggf',
        category: 'GIT',
      },

      {
        writerId: 8,
        title: 'fdsafds',
        thumbnail: 'asdfadsf',
        link: 'test',
        description: 'fadggf',
        category: 'IOS',
      },
    ]);

    await scrapRepository.insert([
      {
        userId: 1,
        postId: 4,
      },
      {
        userId: 1,
        postId: 5,
      },
      {
        userId: 2,
        postId: 1,
      },
      {
        userId: 3,
        postId: 1,
      },
      {
        userId: 4,
        postId: 5,
      },
      {
        userId: 5,
        postId: 3,
      },
      {
        userId: 2,
        postId: 4,
      },
      {
        userId: 3,
        postId: 6,
      },
      {
        userId: 5,
        postId: 4,
      },
      {
        userId: 5,
        postId: 2,
      },
      {
        userId: 8,
        postId: 1,
      },
      {
        userId: 8,
        postId: 2,
      },
      {
        userId: 8,
        postId: 3,
      },
    ]);

    await subscriptionRepository.insert([
      { subscriberId: 1, targetUserId: 8 },
      { subscriberId: 2, targetUserId: 1 },
      { subscriberId: 3, targetUserId: 1 },
      { subscriberId: 4, targetUserId: 1 },
      { subscriberId: 5, targetUserId: 1 },
      { subscriberId: 6, targetUserId: 1 },
      { subscriberId: 7, targetUserId: 3 },
      { subscriberId: 1, targetUserId: 2 },
      { subscriberId: 8, targetUserId: 1 },
      { subscriberId: 1, targetUserId: 3 },
    ]);
  }
}
