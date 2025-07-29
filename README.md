# Bộ công cụ Mã hóa Cổ điển | Classical Cipher Toolkit

Một bộ sưu tập các công cụ mã hóa cổ điển được triển khai dưới dạng một ứng dụng web tương tác. Dự án này được tạo ra với mục đích giáo dục, giúp người dùng tìm hiểu và thực hành với các thuật toán mật mã lịch sử một cách trực quan và sinh động.

<img alt="image" src="./pic/pic1.png" width="800">
<img alt="image" src="./pic/pic2.png" width="800">
<img alt="image" src="./pic/pic3.png" width="800">
<img alt="image" src="./pic/pic4.png" width="800">
<img alt="image" src="./pic/pic5.png" width="800">
<img alt="image" src="./pic/pic6.png" width="800">
<img alt="image" src="./pic/pic7.png" width="800">
<img alt="image" src="./pic/pic8.png" width="800">
<img alt="image" src="./pic/pic9.png" width="800">

## ✨ Tính năng

-   **Giao diện Trực quan:** Giao diện người dùng đơn giản, dễ sử dụng cho việc mã hóa và giải mã.
-   **Tương tác Thời gian thực:** Xem kết quả ngay lập tức khi bạn nhập văn bản và khóa.
-   **Không cần Cài đặt:** Chạy trực tiếp trên trình duyệt mà không cần bất kỳ sự phụ thuộc nào (zero-dependency).
-   **Triển khai đa dạng các thuật toán:**
    -   [Mã hóa Caesar](caesar.html)
    -   [Mã hóa Đĩa (Cipher Disk)](disk.html) được dựng theo [video](https://youtu.be/cAN9ll_XolQ?si=Ow2c5ff2rXDlAH_P) này.
    -   [Mã hóa Playfair](playfair.html)
    -   [Mã hóa Polybius](polybius.html)
    -   [Mã hóa Trithemius](trithemius.html)
    -   [Mã hóa Vigenère](vigenere.html)

## 🚀 Live Demo

Bạn có thể trải nghiệm trực tiếp sản phẩm tại đây: **[glasspham.github.io/Classical-Ciphers/](glasspham.github.io/Classical-Ciphers/)**

## 🛠️ Bắt đầu

Để chạy dự án này trên máy cục bộ của bạn, hãy làm theo các bước sau:

1.  **Clone repository:**
    ```bash
    git clone https://github.com/Glasspham/Classical-Ciphers.git
    ```
2.  **Điều hướng đến thư mục dự án:**
    ```bash
    cd Classical-Ciphers
    ```
3.  **Mở `index.html`:**
    Chỉ cần mở file `index.html` trong trình duyệt web của bạn để bắt đầu.

## 📖 Cách sử dụng

1.  Mở ứng dụng và chọn một thuật toán mã hóa từ thanh điều hướng.
2.  Nhập văn bản bạn muốn mã hóa (plaintext) vào ô nhập liệu.
3.  Nếu thuật toán yêu cầu, hãy nhập khóa (key).
4.  Văn bản đã được mã hóa (ciphertext) sẽ tự động hiển thị.
5.  Quá trình giải mã diễn ra tương tự.

## 📂 Cấu trúc dự án

```
/
├── index.html              # Trang chủ
├── *.html                  # Các trang cho từng thuật toán
├── CSS/
│   └── styles.css          # File CSS chung
└── JS/
    ├── *.js                # Các file JavaScript cho từng thuật toán
    ├── navbar.js           # Script cho thanh điều hướng
    └── footer.js           # Script cho chân trang
```

## 🤝 Đóng góp

Chào mừng mọi sự đóng góp! Nếu bạn có ý tưởng để cải thiện dự án, vui lòng tạo một **Fork** và gửi **Pull Request**.

1.  Fork a project
2.  Tạo branch cho tính năng của bạn (`git checkout -b feature/AmazingFeature`)
3.  Commit thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`)
4.  Push lên branch (`git push origin feature/AmazingFeature`)
5.  Mở một Pull Request