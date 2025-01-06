const fs = require('fs');
const path = require('path');

const deleteFilesRecursively = (directory, extensions) => {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Lỗi khi đọc thư mục ${directory}:`, err);
      return;
    }
    files.forEach(file => {
      const fullPath = path.join(directory, file.name);
      if (file.isDirectory()) {
        deleteFilesRecursively(fullPath, extensions);
      } else if (extensions.some(ext => file.name.endsWith(ext))) {
        fs.unlink(fullPath, err => {
          if (err) {
            console.error(`Lỗi khi xóa tệp ${fullPath}:`, err);
          } else {
            console.log(`Đã xóa tệp: ${fullPath}`);
          }
        });
      }
    });
  });
};

// Xóa tất cả các tệp .js và .js.map trong thư mục "src"
deleteFilesRecursively(path.join(__dirname, 'src'), ['.js', '.js.map']);
