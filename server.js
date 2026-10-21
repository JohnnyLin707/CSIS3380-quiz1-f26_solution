const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
// 中文：从 'public' 目录提供静态文件服务（例如 style.css）
app.use(express.static(path.join(__dirname, 'public')));

// Our 'database' for this exercise
// 中文：本次练习用的“数据库”（其实只是内存中的一个数组，服务器重启后数据会清空）
const guests = [];

// Middleware to parse URL-encoded form bodies
// 中文：中间件，用于解析 URL-encoded 格式的表单请求体（这样 req.body 才有值）
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
// Convert array of names into array of <li> elements, then join them into one long string
// 中文：把姓名数组转换成 <li> 元素数组，再用 join('') 拼接成一个完整的字符串
  const guestListItems = guests.map(name => `<li>${name}</li>`).join('');

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Event Guest List</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="container">
            <h1>Event Guest List</h1>
            <form method="POST" action="/">
                <input type="text" name="guestName" placeholder="Name" required>
                <button type="submit">Add Guest</button>
            </form>
            <h2>Guests Registered:</h2>
            <ul>
                <!-- DYNAMIC LIST ITEMS GO HERE -->
                <!-- 中文：动态生成的列表项会插入到这里（由 guestListItems 变量填充） -->
                ${guestListItems}
            </ul>
        </div>
    </body>
    </html>
  `;
  res.send(html);
});

app.post('/', (req, res) => {
  // Extract the name from the parsed form body
  // 中文：从解析后的表单请求体中取出姓名字段
  const newGuest = req.body.guestName;

  // Simple validation to avoid empty strings
  // 中文：简单校验，避免把空字符串加入数组
  if (newGuest && newGuest.trim() !== '') {
    guests.push(newGuest.trim());
  }

  // Redirect back to the home page to re-render with the new data
  // 中文：重定向回首页，用新的数据重新渲染页面（POST → 重定向 → GET，即 PRG 模式）
  res.redirect('/');
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
