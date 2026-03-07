# ali-blog
www.fleven.com
2020-01-29 12:36:17

链接
ssh blog
scp file.txt blog:/path/


# Vercel 部署
## 1. 安装 Vercel
   npm install -g vercel

## 2. 登录
   cd ~/Documents/my-github/new-blog
   vercel login

## 3. 部署
   vercel --prod

## 4. 添加域名
   vercel domains add fleven.com
   vercel domains add www.fleven.com

## 5. 验证（会提示 DNS 配置方式）
   vercel domains inspect fleven.com