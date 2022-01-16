export default [
  {
    id: 1,
    group: false,
    ChatUsers: [
      {
        id: 1,
        chatTitle: null,
        User: {
          id: 2,
          name: '흥부',
        },
      },
    ],
  },
  {
    id: 2,
    group: false,
    ChatUsers: [
      {
        id: 3,
        chatTitle: null,
        User: {
          id: 3,
          name: '놀부',
        },
      },
    ],
  },
];

export const getChatLists = {
  chatLists: [
    {
      id: 1,
      ChatUsers: [
        {
          chatTitle: null,
        },
      ],
    },
    {
      id: 2,
      ChatUsers: [
        {
          chatTitle: null,
        },
      ],
    },
  ],
  chatUsers: [
    {
      id: 1,
      ChatUsers: [
        {
          User: {
            id: 2,
            name: '흥부',
          },
        },
      ],
    },
    {
      id: 2,
      ChatUsers: [
        {
          User: {
            id: 3,
            name: '놀부',
          },
        },
      ],
    },
  ],
  chatResult: [
    {
      id: 1,
      chatTitle: null,
      chatUsers: [
        {
          id: 2,
          name: '흥부',
        },
      ],
    },
    {
      id: 2,
      chatTitle: null,
      chatUsers: [
        {
          id: 3,
          name: '놀부',
        },
      ],
    },
  ],
};

export const createChatList = {
  userChatLists: [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ],
  targetChatLists: [
    {
      id: 1,
    },
  ],
  newChatList: {
    id: 1,
    group: false,
  },
};

export const updateChatList = {
  accessChat: {
    id: 1,
  },
};
