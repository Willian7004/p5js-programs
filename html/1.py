import webview

# 创建窗口并加载本地HTML文件
window = webview.create_window(
    title="本地网页演示",
    url="index.html",  # 直接指向本地文件路径
    width=1280,
    height=720
)

# 启动窗口
webview.start()