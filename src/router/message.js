const messageRouter = [
  {
    path: 'announcement',
    component: (resolve) => require(['@/views/message/Announcement.vue'], resolve),
    meta: {
      title: '公告',
    }
  },
  {
    path: 'notice',
    component: (resolve) => require(['@/views/message/Notice.vue'], resolve),
    meta: {
      title: '提醒',
    }
  }
]


export default messageRouter