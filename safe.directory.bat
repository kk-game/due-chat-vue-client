@echo off
:: ��Ŀ����git�г����޷��ύ��Ŀ��ʱ��ʹ��
set "path=%cd%"
set "path=%path:\=/%"
echo ��ǰ·����:%path%
"C:\Program Files\Git\bin\git.exe" config --global --add safe.directory %path%
pause
