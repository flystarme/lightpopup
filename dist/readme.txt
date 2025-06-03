README.txt

## LightPopup 组件 使用说明

感谢使用 LightPopup 组件！本组件是一个轻量级的弹窗组件，包含常见的弹窗功能如 alert、confirm、prompt 等。

### 使用步骤

1. **打包完成后，拷贝文件到目标目录**
   
   只需要将 `dist/lightpopup/` 目录中的文件拷贝到你网站的相应目录中。

   例如：
   - 将 `dist/lightpopup/` 拷贝到你的 Web 服务器上，目录结构可以是：
     ```
     /path/to/your/website/lightpopup/
     ├── lightpopup.min.js  <-- 打包后的 JavaScript 文件
     ├── lightpopup.min.css <-- 打包后的 CSS 文件
     ```

2. **引入 JavaScript 和 CSS 文件**

   ```html
   <link rel="stylesheet" href="lightpopup/lightpopup.min.css">
   <script type="module" src="lightpopup/lightpopup.min.js"></script>
