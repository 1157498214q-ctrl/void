# 虚空档案系统 - Vercel 部署指南

## 前提条件

- GitHub 账号（已有仓库：https://github.com/1157498214q-ctrl/void）
- Vercel 账号（免费注册）
- 已配置的 Supabase 项目

---

## 第一步：注册 Vercel

1. 打开 https://vercel.com
2. 点击 **Sign Up**
3. 选择 **Continue with GitHub**（使用 GitHub 登录）
4. 授权 Vercel 访问你的 GitHub

---

## 第二步：导入项目

1. 登录后点击 **Add New...** → **Project**
2. 在 **Import Git Repository** 中找到 `void` 仓库
3. 点击 **Import**

---

## 第三步：配置环境变量（重要！）

在部署页面，展开 **Environment Variables** 部分，添加以下两个变量：

| 变量名 | 值 |
|--------|-----|
| `VITE_SUPABASE_URL` | 你的 Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | 你的 Supabase 匿名密钥 |

> **如何获取这些值**：
> 1. 打开 Supabase 控制台 → 你的项目
> 2. 进入 **Settings** → **API**
> 3. 复制 **Project URL** 和 **anon public** 密钥

---

## 第四步：配置构建设置

Vercel 会自动检测 Vite 项目，通常不需要修改。确认以下设置：

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## 第五步：部署

1. 点击 **Deploy** 按钮
2. 等待构建完成（约 1-2 分钟）
3. 部署成功后会显示你的网站地址，如：`void-xxx.vercel.app`

---

## 部署后验证

1. 打开分配的网址
2. 测试登录/注册功能
3. 创建一个测试戏录确认数据保存正常

---

## 常见问题

### Q: 部署后显示空白页面

**解决方案**：检查环境变量是否正确配置。在 Vercel 项目设置中确认 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 已添加。

### Q: 登录后无法保存数据

**解决方案**：确保 Supabase 中已执行以下 SQL 脚本：
- `supabase_init.sql`（数据库表和策略）
- `supabase_storage.sql`（图片存储）
- `supabase_sharing.sql`（共享策略）

### Q: 如何更新部署？

只需推送代码到 GitHub，Vercel 会自动重新部署：
```bash
git add .
git commit -m "更新描述"
git push
```

### Q: 如何绑定自定义域名？

1. 进入 Vercel 项目 → **Settings** → **Domains**
2. 添加你的域名
3. 按照提示配置 DNS 记录

---

## 重要提醒

⚠️ **不要将 `.env.local` 文件提交到 GitHub**，它包含敏感的 API 密钥。生产环境的密钥应该只通过 Vercel 环境变量配置。
