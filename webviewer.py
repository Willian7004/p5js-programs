import webview

def main():
    window = webview.create_window(
        'JS Viewer',
        'html/index.html',
        width=1280,
        height=720,
        resizable=True
    )
    webview.start()

if __name__ == '__main__':
    main()