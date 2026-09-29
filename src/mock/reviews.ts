import type { Review } from '@/types';

const avatar = (prompt: string) =>
  `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square`;

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

/**
 * 种子评价数据：仅有部分工具预置评价，
 * 其余工具无评价时页面回退到 tool.rating 静态评分。
 */
export const mockReviews: Review[] = [
  {
    id: 'review-1',
    toolId: '1',
    userId: 'user-101',
    userName: '林晓',
    userAvatar: avatar('professional asian female designer avatar portrait minimal'),
    rating: 5,
    content:
      '实时协作体验非常流畅，团队一起改稿几乎没有延迟。组件库和自动布局功能大幅提升了我们的设计系统维护效率，强烈推荐给设计团队。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=figma%20design%20file%20with%20multiple%20frames%20dark%20ui&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=design%20component%20library%20tokens%20sidebar&image_size=landscape_16_9',
    ],
    createdAt: hoursAgo(3),
    likedBy: ['user-102', 'user-103', 'user-104', 'user-105'],
    replies: [
      {
        id: 'reply-1',
        userId: 'user-102',
        userName: '陈志远',
        userAvatar: avatar('professional asian male product manager avatar'),
        content: '同意，开发模式的标注也很好用，省了很多沟通成本。',
        createdAt: hoursAgo(2),
      },
    ],
  },
  {
    id: 'review-2',
    toolId: '1',
    userId: 'user-102',
    userName: '陈志远',
    userAvatar: avatar('professional asian male product manager avatar'),
    rating: 4,
    content:
      '整体很好用，插件生态也很丰富。扣一星是因为超大文件时偶尔会卡顿，希望后续版本能继续优化性能。',
    images: [],
    createdAt: daysAgo(2),
    likedBy: ['user-101', 'user-106'],
    replies: [],
  },
  {
    id: 'review-3',
    toolId: '1',
    userId: 'user-103',
    userName: 'Mia',
    userAvatar: avatar('professional western female ux researcher avatar minimal'),
    rating: 5,
    content:
      '原型交互动效做得很直观，用户测试时直接丢一个链接就行。订阅 Professional 之后无限文件真的太香了。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=interactive%20prototype%20flow%20arrows%20wireframe&image_size=landscape_16_9',
    ],
    createdAt: daysAgo(6),
    likedBy: ['user-101'],
    replies: [],
  },
  {
    id: 'review-4',
    toolId: '1',
    userId: 'user-104',
    userName: '王珂',
    userAvatar: avatar('professional asian male frontend engineer avatar'),
    rating: 3,
    content:
      '功能没话说，但对国内网络环境不太友好，有时候加载字体和图片资源比较慢，需要自备网络环境。',
    images: [],
    createdAt: daysAgo(12),
    likedBy: ['user-105', 'user-106', 'user-107'],
    replies: [
      {
        id: 'reply-2',
        userId: 'user-105',
        userName: '苏晴',
        userAvatar: avatar('professional asian female illustrator avatar'),
        content: '深有同感，希望能有更稳定的接入方式。',
        createdAt: daysAgo(11),
      },
    ],
  },
  {
    id: 'review-5',
    toolId: '1',
    userId: 'user-105',
    userName: '苏晴',
    userAvatar: avatar('professional asian female illustrator avatar'),
    rating: 5,
    content:
      '从 Sketch 迁移过来之后再也回不去了，矢量编辑、布尔运算都很顺手，学生和自由职业者的价格也能接受。',
    images: [],
    createdAt: daysAgo(20),
    likedBy: ['user-101', 'user-103', 'user-104'],
    replies: [],
  },
  {
    id: 'review-6',
    toolId: '2',
    userId: 'user-106',
    userName: '赵鹏',
    userAvatar: avatar('professional asian male devops engineer avatar'),
    rating: 5,
    content:
      'Actions 的 CI/CD 配置即用，矩阵构建和缓存都很好使，代码扫描在 Pro 里就免费用，团队迁移过来之后效率提升明显。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=github%20actions%20workflow%20green%20checks%20terminal&image_size=landscape_16_9',
    ],
    createdAt: daysAgo(1),
    likedBy: ['user-102', 'user-104', 'user-107', 'user-108'],
    replies: [],
  },
  {
    id: 'review-7',
    toolId: '2',
    userId: 'user-107',
    userName: 'Alex',
    userAvatar: avatar('professional western male backend developer avatar'),
    rating: 4,
    content:
      '代码审查体验是同类产品里最好的，PR 视图、建议修改、ruleset 都很成熟。私有仓库的存储额度稍微有点紧张。',
    images: [],
    createdAt: daysAgo(4),
    likedBy: ['user-106'],
    replies: [
      {
        id: 'reply-3',
        userId: 'user-108',
        userName: '何雨',
        userAvatar: avatar('professional asian female qa engineer avatar'),
        content: 'Team 版存储会多一些，我们小团队 Pro 完全够用。',
        createdAt: daysAgo(3),
      },
    ],
  },
  {
    id: 'review-8',
    toolId: '2',
    userId: 'user-108',
    userName: '何雨',
    userAvatar: avatar('professional asian female qa engineer avatar'),
    rating: 4,
    content: 'Issues + Projects 做测试跟踪很方便，希望移动端的通知能再及时一点。',
    images: [],
    createdAt: daysAgo(9),
    likedBy: [],
    replies: [],
  },
  {
    id: 'review-9',
    toolId: '3',
    userId: 'user-109',
    userName: '周一楠',
    userAvatar: avatar('professional asian female writer knowledge worker avatar'),
    rating: 5,
    content:
      '用 Notion 搭了团队的知识库和项目排期，数据库视图切换太方便了。模板社区里能挖到很多宝藏。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=notion%20wiki%20knowledge%20base%20kanban%20board&image_size=landscape_16_9',
    ],
    createdAt: daysAgo(3),
    likedBy: ['user-101', 'user-102', 'user-105'],
    replies: [],
  },
  {
    id: 'review-10',
    toolId: '3',
    userId: 'user-110',
    userName: 'Kevin',
    userAvatar: avatar('professional western male startup founder avatar'),
    rating: 4,
    content: '自由度极高，几乎什么都能搭；但上手有一定学习成本，新人需要培训一下数据库的关联逻辑。',
    images: [],
    createdAt: daysAgo(8),
    likedBy: ['user-109', 'user-106'],
    replies: [],
  },
];
