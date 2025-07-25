@echo off
:: 项目拉到git中出现无法提交项目的时候使用
set "path=%cd%"
set "path=%path:\=/%"
echo 当前路径是:%path%
"C:\Program Files\Git\bin\git.exe" config --global --add safe.directory %path%
pause
