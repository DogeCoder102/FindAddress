# Tra cứu Địa chỉ Hành chính Hà Nội — Thiết kế

## Mục tiêu
Website mobile tối giản giúp người dân tra cứu địa chỉ hành chính mới của Hà Nội sau sáp nhập phường/xã (có hiệu lực từ 01/07/2025, theo Nghị quyết 1656/NQ-UBTVQH15).

## Công nghệ
- Single HTML file (HTML + CSS + JS thuần)
- Dữ liệu JSON nhúng sẵn trong file
- Không cần backend, deploy tĩnh (GitHub Pages, Netlify...)

## Tính năng

### Chế độ 1: Tra cứu từ đường phố
- Input: số nhà + tên đường (ví dụ: "123 nguyễn ngọc nại")
- Output: địa chỉ hành chính đầy đủ (ví dụ: "Số 123 phố Nguyễn Ngọc Nại, phường Phương Liệt, thành phố Hà Nội")
- Hệ thống tự parse số nhà và tên đường từ input tự do

### Chế độ 2: Chuyển đổi phường cũ → mới
- Input: tên phường cũ (ví dụ: "phường Khương Trung")
- Output: phường mới tương ứng (ví dụ: "Phường Khương Trung (cũ) → Phường Thanh Xuân (mới), thành phố Hà Nội")
- Tự nhận diện khi input chứa từ "phường"

### Tính năng phụ
- Smart parsing: tự nhận diện số nhà + tên đường
- Fuzzy search: tìm kiếm không dấu, chấp nhận sai chính tả nhẹ
- Autocomplete: gợi ý đường phố khi gõ
- Copy result: nút copy địa chỉ đầy đủ
- Tự nhận diện chế độ tra cứu

## Giao diện (Mobile-first)
- Header: tiêu đề "Tra cứu Địa chỉ Hà Nội"
- Ô tìm kiếm lớn chiếm trung tâm màn hình
- Placeholder gợi ý cách nhập
- Autocomplete dropdown khi gõ
- Kết quả hiện ngay bên dưới ô tìm kiếm
- Nút copy kết quả
- Phong cách: gradient xanh dương → tím nhẹ, bo tròn, shadow mềm, font Inter

## Cấu trúc dữ liệu

```json
{
  "streets": [
    {
      "name": "Nguyễn Ngọc Nại",
      "ward": "Phương Liệt",
      "district": "Thanh Xuân",
      "type": "phố"
    }
  ],
  "ward_mapping": [
    {
      "old_ward": "Khương Trung",
      "old_district": "Thanh Xuân",
      "new_ward": "Thanh Xuân",
      "new_district": "Thanh Xuân"
    }
  ]
}
```

## Phạm vi dữ liệu
12 quận nội thành: Hoàn Kiếm, Ba Đình, Đống Đa, Hai Bà Trưng, Thanh Xuân, Cầu Giấy, Hoàng Mai, Long Biên, Tây Hồ, Bắc Từ Liêm, Nam Từ Liêm, Hà Đông.

## Quyết định thiết kế
- Single file HTML vì bài toán đơn giản, dữ liệu tĩnh, dễ deploy
- Dữ liệu tự xây dựng từ nguồn chính thức (Nghị quyết, website quận)
- Mobile-first vì target chính là người dùng di động
- Tối giản UI vì ưu tiên tốc độ và dễ dùng
