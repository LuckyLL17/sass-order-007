import type { Review } from '@/types';

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();
const daysAgo = (days: number) => hoursAgo(days * 24);

const avatar = (prompt: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=square`;

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    toolId: '1',
    userId: 'u-review-1',
    userName: '李思远',
    userAvatar: avatar('professional%20asian%20male%20avatar%20glasses%20minimal'),
    rating: 5,
    content:
      '团队用了大半年，实时协作体验非常流畅，组件库和设计系统大幅提升了我们的出图效率。开发交付也顺畅，强烈推荐给所有产品设计团队。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=design%20software%20workspace%20clean%20modern%20screenshot&image_size=landscape_4_3',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ui%20design%20component%20library%20colorful%20interface&image_size=landscape_4_3',
    ],
    createdAt: daysAgo(2),
    likedBy: ['u-review-2', 'u-review-3', 'u-review-4'],
    replies: [
      {
        id: 'reply-1',
        userId: 'u-review-2',
        userName: '王小雅',
        userAvatar: avatar('professional%20asian%20female%20avatar%20minimal'),
        content: '同感，自动布局功能上手后再也回不去了。',
        createdAt: daysAgo(1),
      },
    ],
  },
  {
    id: 'review-2',
    toolId: '1',
    userId: 'u-review-2',
    userName: '王小雅',
    userAvatar: avatar('professional%20asian%20female%20avatar%20minimal'),
    rating: 4,
    content:
      '功能很全面，原型交互动效也够用。扣一星是因为大文件多的时候偶尔会卡顿，希望后续版本继续优化性能。',
    images: [],
    createdAt: daysAgo(6),
    likedBy: ['u-review-3'],
    replies: [],
  },
  {
    id: 'review-3',
    toolId: '1',
    userId: 'u-review-3',
    userName: '陈默',
    userAvatar: avatar('professional%20designer%20male%20avatar%20beard'),
    rating: 5,
    content:
      '订阅 Pro 方案之后团队库和版本历史太香了，权限管理清晰，新人上手成本低。客服响应也很快。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=design%20collaboration%20team%20dashboard%20dark%20mode&image_size=landscape_4_3',
    ],
    createdAt: daysAgo(14),
    likedBy: ['u-review-1', 'u-review-2', 'u-review-5', 'u-review-6'],
    replies: [],
  },
  {
    id: 'review-4',
    toolId: '1',
    userId: 'u-review-4',
    userName: '赵一帆',
    userAvatar: avatar('young%20asian%20male%20avatar%20casual%20minimal'),
    rating: 3,
    content:
      '基础功能够用，但离线模式基本等于没有，网络不好的时候比较影响工作，期待改进。',
    images: [],
    createdAt: daysAgo(30),
    likedBy: [],
    replies: [],
  },
  {
    id: 'review-5',
    toolId: '2',
    userId: 'u-review-5',
    userName: '孙浩然',
    userAvatar: avatar('professional%20asian%20engineer%20male%20avatar'),
    rating: 5,
    content:
      'Actions 的 CI/CD 配置非常灵活，私有仓库容量也足够，安全扫描帮我们提前发现了好几个依赖漏洞，值回票价。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=code%20repository%20ci%20pipeline%20dashboard%20terminal&image_size=landscape_4_3',
    ],
    createdAt: daysAgo(3),
    likedBy: ['u-review-1', 'u-review-6'],
    replies: [],
  },
  {
    id: 'review-6',
    toolId: '2',
    userId: 'u-review-6',
    userName: '周婷',
    userAvatar: avatar('professional%20asian%20female%20engineer%20avatar'),
    rating: 4,
    content:
      '代码审查体验很好，PR 讨论和建议改动都很顺手。Pro 对个人开发者来说价格还算合理，希望学生能有更多优惠。',
    images: [],
    createdAt: hoursAgo(20),
    likedBy: ['u-review-5'],
    replies: [],
  },
  {
    id: 'review-7',
    toolId: '3',
    userId: 'u-review-7',
    userName: '林可欣',
    userAvatar: avatar('professional%20asian%20female%20product%20manager%20avatar'),
    rating: 5,
    content:
      '文档、知识库、项目管理全都在一个地方，团队的信息孤岛问题解决了。数据库功能强大，搭个人 wiki 也非常合适。',
    images: [],
    createdAt: daysAgo(5),
    likedBy: ['u-review-2', 'u-review-3', 'u-review-7'],
    replies: [],
  },
];
