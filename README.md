# Disqus-Proxy: Server

## API

* 获取所有文章
  + GET `/api/getThreads` 
  + 参数: 
    - identifier: `string` 
      - 文章 Indent, 一般就是对应的 Post 的 url
* 获取所有评论, 按时间顺序
  + GET `/api/listPosts` 
  + 参数:
    - limit: `number`
      - 默认 `20`, 
    - include: `string[]` 
      - 默认 `approved` , 可选选项: unapproved, approved, spam, deleted, flagged, highlighted
* 获取特定文章评论
  + GET `/api/getComments` 
  + 参数: 
    - identifier: `string` 
      - 文章 Indent, 一般就是对应的 Post 的 url
* 添加评论 
  + POST `/api/createComment` 
  + 参数:
    - author_email: `string` 
      - 邮箱名
    - author_name: `string` 
      - 用户名
    - message: `string` 
      - 正文内容
    - parent: `null | number` 
      - null 或者 parent 评论的 ID
    - thread: `number` 
      - 文章 ID, 注意这里不是 Ident, 只接受纯数字
* 评论 Approve/Spam/Restore/Remove
  + POST `/api/comment/:action`
  + 路由变量:
    - action: `string`
      - 可选选项: approve, spam, restore, remove
  + 参数:
    - post: `number`
      - 对应的评论 id
    - access_token: `number`
      - 此部分操作仅仅管理员可以操作, 可以到自己的 Disqus 账户页面找到 access_token 的值
* 评论 Vote
  + POST `/api/comment/vote`
  + 参数:
    - post: `number`
      - 对应的评论 id
    - vote: `number`
      - 对当前评论的 vote 值, 可选选项: -1, 0, 1
    - access_token: `number`
      - 标记垃圾评论的操作仅仅管理员可以操作, 可以到自己的 Disqus 账户页面找到 access_token 的值
    

## Dev

1. 安装依赖
    ``` 
      npm install
    ```
2. 配置 server 目录下的config.js
    ``` js
    module.exports = {
      // 服务端端口，需要与 disqus-proxy 前端设置一致
      port: 5050, 
      // Disqus Public Key
      api_key: '',
      // Disqus Secret Key
      api_secret: '',
      // Disqus Name
      username: 'szhshp',
      // 用于测试的 thread identifier, 测试时所有评论都会加到这个 thread, 部署的时候一定设为空
      //testPage: 'http://szhshp.org/tech/2019/08/04/efficiencytools.html'
      testPage: ''
    };
    ```
    各种 Key 需要在 [Disqus 的 API 页面](https://disqus.com/api/applications/) 申请

    **重要** 另外需要到 `Settings => Community` 里开启访客评论

3. 启动服务

    ``` 
    cd server
    npm start
    ```

    > 正常运行服务，关闭 ssh 的时候就会关闭服务器，因此可以考虑使用 forever 插件

4. 让服务跟随服务器自动启动  

## Debug

本地运行的条件是 **本地已经可以访问 Disqus**, 因此建议挂载到 VPS 进行 FTP 连接调试.

进入 `\server` 执行:

``` 
npm install
nodemon index.js
```

即可开启调试.

确认开启服务端之后到浏览器输入 `http://localhost:5050/api/listPosts` 应该会显示所有评论数据
