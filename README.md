# Patrick 的静心小站

一个无需框架的静态个人博客：Markdown 是唯一内容源，Node 脚本生成一个浏览器可直接加载的数据文件。

## 本地使用

```bash
npm run check
npm run build
python3 -m http.server 4173 --bind 127.0.0.1
```

打开 [check.html](./check.html) 查看浏览器内的可视化检查；打开 `http://127.0.0.1:4173/index.html` 预览站点。

## 内容规范

- 随笔：`content/essays/*.md`
- 阅读：`content/reading/<book>/<article>/index.md`
- 项目：`content/projects/<lowercase-kebab-slug>/index.md`，相关图片、PDF 放到同级 `assets/`。
- 每篇内容必须使用 Front Matter。创建新文章可复制 `content/templates/` 内模板。

`npm run check` 会校验 Front Matter 必填字段、日期格式与 Markdown 中的本地资源引用。`npm run build` 会在校验通过后生成唯一的数据产物 `assets/data/site-data.js`。

## 发布

`npm run publish` 仅校验、构建并提交指定站点文件；`npm run publish:push` 会额外推送远程仓库。
