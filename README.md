# disqus-proxy-serverless
如有疑问请阅读这篇[博客](https://blog.lightina.cn/2019/12/30/hexo+netlify&serverless+disqus/), inspired by [szhielelp](https://github.com/szhielelp)

## 使用步骤
1. 配置src目录下的config.js
    ``` js
    module.exports = {
      // 因为要部署在Serverless服务上，端口无所谓，随便填
      port: 5050, 
      // Your Disqus Public Key
      api_key: '',
      // Your Disqus Secret Key
      api_secret: '',
      // Your Disqus Name
      username: 'jacklightchen',
    };
    ```
    各种 Key 需要在 [Disqus 的 API 页面](https://disqus.com/api/applications/) 申请

    **重要** 另外需要到 `Settings => Community` 里开启访客评论

2. 部署至Serverless平台Now

    ``` 
    git clone https://github.com/jacklightChen/disqus-proxy-serverless.git
    cd disqus-proxy-serverless
    now login 输入邮箱并验证
    now --name Disqus-Proxy
    ```
    此时可在自己的 ZEIT 的 Dashboard 那边: https://zeit.co/dashboard 看到该服务分配的域名: disqus-proxy.1797079433.now.sh 这个域名需填在hexo的配置文件中
    
3. 修改hexo的配置文件
    
    使用 [disqus-proxy](https://github.com/ciqulover/disqus-proxy)
    
    3.1 在`Hexo`博客目录执行
    ```
    npm install hexo-disqus-proxy --save
    ```
    
    3.2 在你的`Hexo`博客目录中修改`_config.yml`文件 添加如下配置：（注意缩进和空格）
    
    配置文件需要注意port 如果用https就是443 http就是80
    ``` 
      disqus_proxy:
      shortname: jacklightchen
      username: jacklightchen
      host: disqus-proxy.1797079433.now.sh
      port: 443
    ```
    
4. 大功告成 重新部署你的hexo查看效果吧！