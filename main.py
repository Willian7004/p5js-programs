import http.server
import socketserver
import threading
import tkinter as tk
from tkinter import scrolledtext
import webbrowser
import os
import shutil

# 配置服务器参数
PORT = 8001
HTML_DIR = 'html'
PAGES_DIR = 'pages'

# 自定义HTTP请求处理器
class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=HTML_DIR, **kwargs)

# 启动HTTP服务器
def start_server():
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"服务器已启动，地址：http://localhost:{PORT}")
        httpd.serve_forever()

# 创建主窗口
root = tk.Tk()
root.title("p5.js 示例控制器")
root.geometry("500x400")

# 服务器地址显示
server_frame = tk.Frame(root)
server_frame.pack(pady=10)
tk.Label(server_frame, text=f"服务器地址：http://localhost:{PORT}", fg="blue").pack()

# 单选按钮容器
radio_frame = tk.LabelFrame(root, text="示例列表")
radio_frame.pack(pady=10, fill='x')

# 文本显示区域
txt_frame = tk.LabelFrame(root, text="示例说明")
txt_frame.pack(pady=10, fill='both', expand=True)
txt_content = scrolledtext.ScrolledText(txt_frame, wrap=tk.WORD, width=50, height=10)
txt_content.pack(padx=5, pady=5, fill='both', expand=True)

# 初始化单选按钮和文件列表
selected_js = tk.StringVar(value='main')
js_files = [f[:-3] for f in os.listdir(PAGES_DIR) if f.endswith('.js')]

# 创建单选按钮
for js in js_files:
    rb = tk.Radiobutton(radio_frame, 
                       text=js, 
                       variable=selected_js, 
                       value=js,
                       command=lambda: update_sketch())
    rb.pack(anchor='w', padx=5)

# 更新sketch.js和说明文本
def update_sketch():
    selected = selected_js.get()
    # 更新JS文件
    src_js = os.path.join(PAGES_DIR, f"{selected}.js")
    dst_js = os.path.join(HTML_DIR, "sketch.js")
    shutil.copyfile(src_js, dst_js)
    # 更新说明文本
    txt_file = os.path.join(PAGES_DIR, f"{selected}.txt")
    with open(txt_file, 'r', encoding='utf-8') as f:
        txt_content.delete(1.0, tk.END)
        txt_content.insert(tk.INSERT, f.read())

# 初始化默认选择
update_sketch()

# 启动服务器线程
server_thread = threading.Thread(target=start_server)
server_thread.daemon = True
server_thread.start()

# 自动打开浏览器
webbrowser.open(f"http://localhost:{PORT}")

# 运行主循环
root.mainloop()