# cnblogsUpload

![GitHub](https://img.shields.io/github/license/HeMOua/cnblogsUpload)![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/HeMOua/cnblogsUpload)


## 项目背景

​	因为习惯使用Markdown格式做笔记，有时希望将它放到网上方便在任何有网络的地方查找。开始是放到Github中的，但是有时访问的速度太慢了所以准备将笔记放到博客园中，这样访问速度就快了。

​	但是使用Markdown写的文件中时不时会有几张图片，上传笔记的时候还要一个一个的去本地找照片，再上传到博客园上。如果说一两张图片还好，但是图片多了，这样重复无聊的动作就会让人烦躁，因此便产生了编写能自动上传Markdown中的本地图片，并自动改掉文章中的链接的程序的想法

## 安装

安装依赖

```shell
$ npm install
```

本地运行

```shell
$ npm run start
```

打包

```shell
$ npm run package
```

## 使用说明

### 登录

方法一、软件内登录

![软件界面](https://img2023.cnblogs.com/other/1491349/202301/1491349-20230115224809784-1540017174.png)

点击登录按钮，**在弹出窗口完成登录后关闭窗口**，用户的 cookie 信息会**自动填充**到输入框



方法二：手动获取 cookie

1、先按F12打开开发者设置，然后找到Network那一项，选中它

2、访问自己的博客园首页

![操作](https://img2020.cnblogs.com/blog/1491349/202005/1491349-20200509092434698-955659134.png)

比我自己的这个博客hemou/，点击一下它

3、headers -> request headers -> cookie，把cookie对应的值全部复制下来，粘贴到输入框即可

### 上传

**先拖拽** markdown 文件到左边虚线框内

![](https://img2020.cnblogs.com/blog/1491349/202005/1491349-20200509092432176-2015116906.png)

然后拖拽图片文件，找到存放图片的位置，ctrl+a全部复制，不管图片是不是在文章中引用过，程序会自动剔除多余的图片。要注意的是这个是根据正则表达式判断的，只写了`![]()`类型的，还有种格式`<img src>`大概长这样的类型并没用考虑。底下有可上传图片的数量，左边虚线框有图片的样子，可以判断上传是否有误。

![](https://img2020.cnblogs.com/blog/1491349/202005/1491349-20200509092433190-1409077563.gif)

还有需要注意的地方，图片的位置只能是相对路径，否则不能上传成功。如果你使用的是Typora文本编辑器的话可以在偏好设置里调节，为保证成功上传，设置成如下图所示就行了。这样当我们拖动一个文件到Typora文本编辑器里时，软件会自动复制图像到指定的相对路径中。
![](https://img2020.cnblogs.com/blog/1491349/202005/1491349-20200509092432821-2137018504.png)

最后点击解析上传就行，程序会将本地地址替换为链接，并输出为一个副本，不用担心对之前的文本有损伤

## 维护者

[@HeMOua](https://github.com/heMOua/)

## License

[Apache-2.0 license](https://github.com/HeMOua/cnblogsUpload/blob/master/LICENSE) © HeMOua