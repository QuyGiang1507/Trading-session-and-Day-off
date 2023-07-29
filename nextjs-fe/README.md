# Cài đặt và deploy

## Test account
email: test11@test.com
pwd: Test@123

## Cài đặt modules
1. cd src
2. npm install

## Cài đặt địa chỉ api
Vào thư mục env và sửa biến NEXT_PUBLIC_URL_AUTH_SERVICE

## Chạy test trên môi trường local
1. next dev -p 4000 : code sẽ chạy trên localhost:4000

## build
1. npm run build : tạo thư mục .next là thư mục chứa build. Sau khi build xong có thể thấy được thông tin các pages và phương thức render của pages
2. npm run srtart: chạy node server
