# Classical Ciphers - Cấu trúc thư mục hoàn chỉnh

## Tổng quan

Dự án đã được tái cấu trúc hoàn chỉnh với tách biệt JavaScript và sử dụng navbar dùng chung cho tất cả các trang.

## Cấu trúc thư mục

```
📁 Classical Ciphers/
├── 📁 HTML/              # Tất cả file HTML
│   ├── index.html        # Trang chủ
│   ├── caesar.html       # Caesar Cipher
│   ├── polybius.html     # Polybius Square
│   ├── playfair.html     # Playfair Cipher
│   ├── disk.html         # Cipher Disk
│   ├── trithemius.html   # Trithemius Cipher
│   └── template.html     # Template cho trang mới
├── 📁 JS/                # Tất cả file JavaScript
│   ├── script.js         # Utilities chung (CipherUtils)
│   ├── navbar.js         # Navbar component dùng chung
│   ├── caesar.js         # Logic Caesar Cipher
│   ├── polybius.js       # Logic Polybius Square
│   ├── playfair.js       # Logic Playfair Cipher
│   ├── cipher-disk.js    # Logic Cipher Disk
│   └── trithemius.js     # Logic Trithemius Cipher
├── 📁 CSS/               # Tất cả file CSS
│   └── styles.css        # Styles chung
└── README.md             # Hướng dẫn này
```

## Lợi ích của cấu trúc mới

### ✅ Tổ chức rõ ràng

- **HTML/**: Tất cả giao diện người dùng
- **JS/**: Tất cả logic và tương tác
- **CSS/**: Tất cả styles và thiết kế

### ✅ Navbar dùng chung

- Tự động load trên tất cả trang
- Active state tự động dựa trên URL
- Consistency across all pages

### ✅ JavaScript modular

- Mỗi cipher có file riêng
- Logic tách biệt rõ ràng
- Dễ maintain và debug

### ✅ Template system

- Base template cho trang mới
- Placeholders có thể thay thế
- Standardized structure

Navbar sẽ được load tự động khi trang được tải:

```javascript
// Trong navbar.js
document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
});
```

### Active state tự động

Navbar sẽ tự động đánh dấu trang hiện tại là active dựa trên URL.

## Tạo trang mới

1. Copy `template.html`
2. Thay thế `{{PAGE_TITLE}}`, `{{PAGE_CONTENT}}`, `{{PAGE_SCRIPTS}}`
3. Tạo file JavaScript riêng cho trang (nếu cần)
4. Import JavaScript file vào template

#### 2. Tạo mật khẩu mạnh

- Chọn loại ký tự muốn sử dụng
- Điều chỉnh độ dài mật khẩu (8-64 ký tự)
- Xem đánh giá độ mạnh realtime
- Sao chép mật khẩu vào clipboard

#### 3. Thông tin thuật toán

- Chọn thuật toán từ dropdown
- Xem thông tin chi tiết về:
  - Mô tả và cách hoạt động
  - Thông số kỹ thuật
  - Mức độ bảo mật

#### 4. Tính toán dung lượng

- Nhập dung lượng đĩa gốc
- Chọn % overhead mã hóa
- Xem kết quả tính toán chi tiết

## 📁 Cấu trúc dự án

```
Cipher/
├── index.html          # Trang chính
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md          # Tài liệu này
```

## 🔒 Bảo mật

### Thuật toán được hỗ trợ:

- **AES-256**: Standard NSA cho thông tin tối mật
- **ChaCha20**: Hiện đại, nhanh, dùng trong TLS 1.3
- **Serpent**: Margin bảo mật cao với 32 rounds
- **Twofish**: Linh hoạt với key-dependent S-boxes

### Best Practices:

- Sử dụng mật khẩu ít nhất 12 ký tự
- Kết hợp nhiều loại ký tự
- Backup recovery key an toàn
- Cập nhật hệ điều hành thường xuyên

## 🖥️ Hỗ trợ trình duyệt

- Chrome/Chromium 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 📱 Responsive Design

Trang web được tối ưu hóa cho:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + G`: Tạo mật khẩu mới
- `Ctrl/Cmd + C`: Sao chép mật khẩu (khi focused)
- `Enter`: Thực hiện action trong tools

## 🎨 Customization

### Thay đổi màu chủ đạo:

Chỉnh sửa trong `styles.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #ff6b6b;
}
```

### Thêm thuật toán mới:

Chỉnh sửa trong `script.js`, function `showAlgorithmInfo()`:

```javascript
const algorithmData = {
    // Thêm thuật toán mới ở đây
    newAlgorithm: {
        name: 'Tên thuật toán',
        description: 'Mô tả...',
        features: ['Đặc điểm 1', 'Đặc điểm 2'],
        security: 'Mức độ bảo mật'
    }
};
```

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Clipboard không hoạt động**

   - Đảm bảo sử dụng HTTPS hoặc localhost
   - Kiểm tra quyền clipboard trong browser

2. **CSS không load**

   - Kiểm tra đường dẫn file
   - Clear browser cache

3. **JavaScript errors**
   - Mở Developer Tools (F12)
   - Kiểm tra Console tab

## 📄 License

MIT License - Xem chi tiết trong file LICENSE

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📞 Hỗ trợ

- Email: info@diskcrypt.com
- Issues: Tạo issue trên GitHub
- Documentation: Xem README này

## 🔄 Cập nhật

### Version 1.0.0 (2025-01-27)

- Phiên bản đầu tiên
- Hỗ trợ Windows, Linux, macOS
- Công cụ tạo mật khẩu
- Thông tin thuật toán
- Tính toán dung lượng

### Kế hoạch tương lai:

- [ ] Thêm guide cho VeraCrypt
- [ ] Tool kiểm tra entropy
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PWA support

---

**Lưu ý**: Đây là công cụ giáo dục và hỗ trợ. Luôn backup dữ liệu quan trọng trước khi thực hiện mã hóa đĩa.
