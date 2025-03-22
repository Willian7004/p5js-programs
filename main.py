import os
import tkinter as tk
from tkinter import ttk, messagebox
import subprocess
import shutil

class Application(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Control Panel")
        self.webview_process = None
        
        # 初始化UI
        self.create_widgets()
        self.protocol("WM_DELETE_WINDOW", self.on_close)
        
        # 获取pages目录中的js文件
        self.pages_dir = "pages"
        self.js_files = self.get_js_files()
        
        # 设置默认选择并初始化
        self.selected = tk.StringVar(value="main.js")
        self.initialize_sketch()
        self.create_radio_buttons()
        self.update_description()

    def create_widgets(self):
        # 创建主容器
        main_frame = ttk.Frame(self)
        main_frame.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)

        # 单选按钮区域
        self.radio_frame = ttk.LabelFrame(main_frame, text="Available Pages")
        self.radio_frame.pack(fill=tk.X, pady=5)

        # 描述区域
        desc_frame = ttk.LabelFrame(main_frame, text="Description")
        desc_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.desc_text = tk.Text(desc_frame, wrap=tk.WORD, height=10)
        scrollbar = ttk.Scrollbar(desc_frame, command=self.desc_text.yview)
        self.desc_text.configure(yscrollcommand=scrollbar.set)
        
        self.desc_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def get_js_files(self):
        files = [f for f in os.listdir(self.pages_dir) if f.endswith(".js")]
        if not files:
            messagebox.showerror("Error", "No JS files found in pages directory!")
            self.destroy()
        return files

    def create_radio_buttons(self):
        for js_file in self.js_files:
            rb = ttk.Radiobutton(
                self.radio_frame,
                text=js_file,
                variable=self.selected,
                value=js_file,
                command=self.update_sketch
            )
            rb.pack(anchor=tk.W, padx=5, pady=2)

    def initialize_sketch(self):
        self.copy_js_file()
        self.start_webview()

    def copy_js_file(self):
        src = os.path.join(self.pages_dir, self.selected.get())
        dst = os.path.join("html", "sketch.js")
        try:
            shutil.copy(src, dst)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to copy JS file: {str(e)}")

    def update_description(self):
        txt_file = self.selected.get().replace(".js", ".txt")
        path = os.path.join(self.pages_dir, txt_file)
        try:
            with open(path, "r",encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            content = f"Description unavailable: {str(e)}"
        
        self.desc_text.delete(1.0, tk.END)
        self.desc_text.insert(tk.END, content)

    def update_sketch(self):
        self.copy_js_file()
        self.update_description()
        self.restart_webview()

    def start_webview(self):
        self.webview_process = subprocess.Popen(["python", "webviewer.py"])

    def restart_webview(self):
        if self.webview_process:
            self.webview_process.terminate()
            self.webview_process.wait()
        self.start_webview()

    def on_close(self):
        if self.webview_process:
            self.webview_process.terminate()
            self.webview_process.wait()
        self.destroy()

if __name__ == "__main__":
    app = Application()
    app.mainloop()