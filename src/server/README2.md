# Cấu trúc thư mục `server`

Thư mục `server` chứa các tệp và thư mục liên quan đến phần backend của ứng dụng. Dưới đây là cấu trúc thư mục và mô tả chức năng của từng thành phần:

```
server/
├── controllers/
├── models/
├── routes/
├── services/
├── utils/
└── index.js
```

## controllers/
Thư mục này chứa các tệp điều khiển (controller) xử lý logic nghiệp vụ và tương tác với các dịch vụ và mô hình dữ liệu.

## models/
Thư mục này chứa các tệp mô hình (model) định nghĩa cấu trúc dữ liệu và các phương thức tương tác với cơ sở dữ liệu.

## routes/
Thư mục này chứa các tệp định nghĩa các tuyến đường (route) của API, ánh xạ các yêu cầu HTTP tới các phương thức trong controller.

## services/
Thư mục này chứa các tệp dịch vụ (service) thực hiện các tác vụ phức tạp và tương tác với các thành phần khác như cơ sở dữ liệu, API bên ngoài.

## utils/
Thư mục này chứa các tệp tiện ích (utility) cung cấp các hàm và công cụ hỗ trợ cho các phần khác của ứng dụng.

## index.js
Tệp này là điểm vào chính của phần backend, khởi tạo và cấu hình server, kết nối cơ sở dữ liệu và thiết lập các tuyến đường.
