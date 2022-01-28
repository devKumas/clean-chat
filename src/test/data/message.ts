export default {};

export const getMessages = {
  chatList: [
    {
      id: 1,
      ChatContents: [
        {
          id: 5,
          content: '안녕하세요',
          imagePath: null,
          delete: null,
          User: {
            id: 1,
            name: '홍길동',
          },
        },
        {
          id: 4,
          content: '안녕하세요',
          imagePath: null,
          delete: null,
          User: {
            id: 1,
            name: '홍길동',
          },
        },
        {
          id: 3,
          content: '안녕하세요',
          imagePath: null,
          delete: null,
          User: {
            id: 1,
            name: '홍길동',
          },
        },
        {
          id: 2,
          content: '안녕하세요',
          imagePath: null,
          delete: null,
          User: {
            id: 1,
            name: '홍길동',
          },
        },
        {
          id: 1,
          content: '안녕하세요',
          imagePath: null,
          delete: null,
          User: {
            id: 1,
            name: '홍길동',
          },
        },
      ],
    },
  ],
};

export const createMessage = {
  chatList: [
    {
      id: 1,
    },
  ],
  createChatContetn: {
    content: '안녕하세요',
    ChatListId: 1,
    UserId: 1,
  },
  chatUser: [
    {
      id: 1,
    },
  ],
};

export const removeMessage = {
  mesage: {
    User: {
      id: 1,
    },
  },
};
