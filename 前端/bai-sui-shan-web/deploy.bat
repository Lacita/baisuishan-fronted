@echo off

@echo 开始下载依赖...
npm install

@echo 开始打包...
npm run build

@echo 打包完成 文件夹为本目录\dist\，将其拷贝到nginx根目录中即可

pause>nul