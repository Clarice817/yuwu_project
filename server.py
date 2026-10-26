#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简单的本地HTTP服务器
用于测试前端从Data.json加载数据的功能

使用方法：
1. 确保已安装Python（访问 https://www.python.org 下载）
2. 在命令行中运行：python server.py
3. 在浏览器中访问：http://localhost:8000/搜索框/research_classify.html
"""

import http.server
import socketserver
import os
import webbrowser
import threading

PORT = 8000

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器"""
    
    def end_headers(self):
        # 添加CORS头部，允许跨域请求
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        # 处理预检请求
        self.send_response(200)
        self.end_headers()

def start_server():
    """启动HTTP服务器"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"=" * 60)
        print(f"服务器已启动!")
        print(f"访问地址: http://localhost:{PORT}")
        print(f"=" * 60)
        print(f"按 Ctrl+C 停止服务器")
        print(f"=" * 60)
        
        # 2秒后自动打开浏览器
        threading.Timer(2, lambda: webbrowser.open(f'http://localhost:{PORT}/搜索框/research_classify.html')).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")
            httpd.shutdown()

if __name__ == "__main__":
    start_server()
