# cooMap
可多人协作编辑的地图，基于Express + Socket.io + EJS + ArcGis JavaScript API完成，数据存储在本地data目录下

## 本地部署

1. 克隆或者下载本仓库master分支
2. 进入根目录，执行`npm install`
3. 进入根目录，执行`node app`
4. 浏览器访问，`localhost:666/users/yourname`，`yourname`请根据自己名字替换
5. 浏览器访问，`localhost:666` 可以进入主页，进行登陆



## 功能

1. 左侧按钮提供了地图上绘制点、线、面，加载feature layer等功能
2. 地图左下角有一个输入框，用于输入需要加载的feature layer服务地址，默认提供了一个当前extent的服务
3. 右侧浮层提供多人实时在线聊天功能，可以知道当前在线人数
4. 多个用户共享地图的区域（extent），一个人编辑地图（移动地图区域、绘制点线等），其他人可以实时看到
5. 绘制地图的结果可以保存到服务器，刷新或者下次访问，绘制结果依然可以看到，数据在data目录下



## 目录结构

1. app.js - 服务器入口文件

2. routers - 服务器路由

3. views - EJS模板

4. data - 服务器数据

5. public - 前端静态文件

   ​	css - css样式文件

   ​	js - js文件

   ​		util - 工具js
