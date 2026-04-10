// Build ward mapping from the official Nghị quyết 1656 data
// Source: thuvienphapluat.vn - Bảng tra cứu 126 phường xã Hà Nội sau sáp nhập
// This creates: hanoi_new_wards.json (126 new wards) and hanoi_ward_mapping.json (old → new)

const fs = require('fs');
const path = require('path');

// Complete list of 126 new wards/communes extracted from the official document
const newWards = [
  { stt: 1, name: "Hoàn Kiếm", type: "Phường", mergedFrom: ["Hàng Bạc", "Hàng Bồ", "Hàng Buồm", "Hàng Đào", "Hàng Gai", "Hàng Mã", "Lý Thái Tổ", "Cửa Đông*", "Cửa Nam*", "Điện Biên*", "Đồng Xuân*", "Hàng Bông*", "Hàng Trống*", "Tràng Tiền*"] },
  { stt: 2, name: "Cửa Nam", type: "Phường", mergedFrom: ["Hàng Bài", "Phan Chu Trinh", "Trần Hưng Đạo", "Cửa Nam*", "Nguyễn Du*", "Phạm Đình Hổ*", "Hàng Bông*", "Hàng Trống*", "Tràng Tiền*"] },
  { stt: 3, name: "Ba Đình", type: "Phường", mergedFrom: ["Quán Thánh", "Trúc Bạch", "Cửa Nam*", "Điện Biên*", "Đội Cấn*", "Kim Mã*", "Ngọc Hà*", "Thụy Khuê*", "Cửa Đông*", "Đồng Xuân*"] },
  { stt: 4, name: "Ngọc Hà", type: "Phường", mergedFrom: ["Vĩnh Phúc", "Liễu Giai", "Cống Vị*", "Kim Mã*", "Ngọc Khánh*", "Nghĩa Đô*", "Đội Cấn*", "Ngọc Hà*"] },
  { stt: 5, name: "Giảng Võ", type: "Phường", mergedFrom: ["Cát Linh", "Láng Hạ", "Ngọc Khánh", "Thành Công", "Cống Vị*"] },
  { stt: 6, name: "Hai Bà Trưng", type: "Phường", mergedFrom: ["Bạch Đằng", "Lê Đại Hành", "Nguyễn Du", "Thanh Nhàn", "Phạm Đình Hổ*"] },
  { stt: 7, name: "Vĩnh Tuy", type: "Phường", mergedFrom: ["Mai Động", "Thanh Lương", "Vĩnh Hưng", "Vĩnh Tuy"] },
  { stt: 8, name: "Bạch Mai", type: "Phường", mergedFrom: ["Bạch Mai", "Bách Khoa", "Quỳnh Mai", "Minh Khai*", "Đồng Tâm*", "Lê Đại Hành*", "Phương Mai*", "Trương Định*", "Thanh Nhàn*"] },
  { stt: 9, name: "Đống Đa", type: "Phường", mergedFrom: ["Thịnh Quang", "Quang Trung*", "Láng Hạ*", "Nam Đồng*", "Ô Chợ Dừa*", "Trung Liệt*"] },
  { stt: 10, name: "Kim Liên", type: "Phường", mergedFrom: ["Kim Liên", "Khương Thượng", "Nam Đồng*", "Phương Liên - Trung Tự*", "Trung Liệt*", "Phương Mai*", "Quang Trung*"] },
  { stt: 11, name: "Văn Miếu - Quốc Tử Giám", type: "Phường", mergedFrom: ["Khâm Thiên", "Thổ Quan", "Văn Chương", "Điện Biên*", "Hàng Bột*", "Văn Miếu - Quốc Tử Giám*", "Cửa Nam*", "Lê Đại Hành*", "Nam Đồng*", "Nguyễn Du*", "Phương Liên - Trung Tự*"] },
  { stt: 12, name: "Láng", type: "Phường", mergedFrom: ["Láng Thượng", "Láng Hạ*", "Ngọc Khánh*"] },
  { stt: 13, name: "Ô Chợ Dừa", type: "Phường", mergedFrom: ["Cát Linh*", "Điện Biên*", "Thành Công*", "Ô Chợ Dừa*", "Trung Liệt*", "Hàng Bột*", "Văn Miếu - Quốc Tử Giám*"] },
  { stt: 14, name: "Hồng Hà", type: "Phường", mergedFrom: ["Chương Dương", "Phúc Tân", "Phúc Xá", "Nhật Tân*", "Phú Thượng*", "Quảng An*", "Thanh Lương*", "Tứ Liên*", "Yên Phụ*", "Bồ Đề*", "Ngọc Thụy*", "Bạch Đằng*"] },
  { stt: 15, name: "Lĩnh Nam", type: "Phường", mergedFrom: ["Lĩnh Nam", "Thanh Trì", "Trần Phú", "Yên Sở*", "Thanh Lương*"] },
  { stt: 16, name: "Hoàng Mai", type: "Phường", mergedFrom: ["Giáp Bát", "Hoàng Liệt", "Hoàng Văn Thụ", "Lĩnh Nam", "Tân Mai", "Thịnh Liệt", "Tương Mai", "Trần Phú", "Vĩnh Hưng", "Yên Sở"] },
  { stt: 17, name: "Vĩnh Hưng", type: "Phường", mergedFrom: ["Vĩnh Hưng*", "Lĩnh Nam*", "Thanh Trì*", "Vĩnh Tuy*"] },
  { stt: 18, name: "Tương Mai", type: "Phường", mergedFrom: ["Giáp Bát", "Phương Liệt", "Mai Động*", "Minh Khai*", "Đồng Tâm*", "Trương Định*", "Hoàng Văn Thụ*", "Tân Mai*", "Tương Mai*", "Vĩnh Hưng*"] },
  { stt: 19, name: "Định Công", type: "Phường", mergedFrom: ["Định Công", "Hoàng Liệt", "Thịnh Liệt", "Tân Triều*", "Thanh Liệt*", "Đại Kim*", "Giáp Bát*"] },
  { stt: 20, name: "Hoàng Liệt", type: "Phường", mergedFrom: ["Hoàng Liệt", "Văn Điển", "Tam Hiệp*", "Thanh Liệt*", "Đại Kim*"] },
  { stt: 21, name: "Yên Sở", type: "Phường", mergedFrom: ["Thịnh Liệt", "Yên Sở", "Tứ Hiệp*", "Hoàng Liệt*", "Trần Phú*"] },
  { stt: 22, name: "Thanh Xuân", type: "Phường", mergedFrom: ["Nhân Chính", "Thanh Xuân Bắc", "Thanh Xuân Trung", "Thượng Đình", "Trung Hoà", "Trung Văn"] },
  { stt: 23, name: "Khương Đình", type: "Phường", mergedFrom: ["Hạ Đình", "Khương Đình", "Khương Trung", "Đại Kim*", "Tân Triều*", "Thanh Xuân Trung*", "Thượng Đình*"] },
  { stt: 24, name: "Phương Liệt", type: "Phường", mergedFrom: ["Khương Mai", "Thịnh Liệt*", "Phương Liệt*", "Định Công*", "Khương Đình*", "Khương Trung*"] },
  { stt: 25, name: "Cầu Giấy", type: "Phường", mergedFrom: ["Dịch Vọng", "Dịch Vọng Hậu", "Quan Hoa", "Mỹ Đình 1", "Mỹ Đình 2", "Yên Hòa"] },
  { stt: 26, name: "Nghĩa Đô", type: "Phường", mergedFrom: ["Nghĩa Tân", "Cổ Nhuế 1*", "Mai Dịch*", "Nghĩa Đô*", "Xuân La*", "Xuân Tảo*", "Dịch Vọng*", "Dịch Vọng Hậu*", "Quan Hoa*"] },
  { stt: 27, name: "Yên Hòa", type: "Phường", mergedFrom: ["Mễ Trì", "Nhân Chính", "Trung Hòa", "Yên Hòa*"] },
  { stt: 28, name: "Tây Hồ", type: "Phường", mergedFrom: ["Bưởi", "Phú Thượng*", "Xuân La*", "Nhật Tân*", "Quảng An*", "Tứ Liên*", "Yên Phụ*", "Nghĩa Đô*", "Thụy Khuê*"] },
  { stt: 29, name: "Phú Thượng", type: "Phường", mergedFrom: ["Đông Ngạc", "Xuân La", "Xuân Đỉnh", "Xuân Tảo", "Phú Thượng*"] },
  { stt: 30, name: "Tây Tựu", type: "Phường", mergedFrom: ["Minh Khai*", "Tây Tựu*", "Kim Chung*"] },
  { stt: 31, name: "Phú Diễn", type: "Phường", mergedFrom: ["Phú Diễn", "Cổ Nhuế 1*", "Mai Dịch*", "Phúc Diễn*"] },
  { stt: 32, name: "Xuân Đỉnh", type: "Phường", mergedFrom: ["Xuân Đỉnh*", "Cổ Nhuế 1*", "Xuân La*", "Xuân Tảo*"] },
  { stt: 33, name: "Đông Ngạc", type: "Phường", mergedFrom: ["Đức Thắng", "Cổ Nhuế 2*", "Thụy Phương*", "Minh Khai*", "Đông Ngạc*"] },
  { stt: 34, name: "Thượng Cát", type: "Phường", mergedFrom: ["Liên Mạc", "Thượng Cát", "Minh Khai*", "Tây Tựu*", "Cổ Nhuế 2*", "Thụy Phương*"] },
  { stt: 35, name: "Từ Liêm", type: "Phường", mergedFrom: ["Cầu Diễn", "Mễ Trì*", "Phú Đô*", "Mai Dịch*", "Mỹ Đình 1*", "Mỹ Đình 2*"] },
  { stt: 36, name: "Xuân Phương", type: "Phường", mergedFrom: ["Phương Canh", "Xuân Phương", "Đại Mỗ*", "Tây Mỗ*", "Vân Canh*", "Minh Khai*", "Phúc Diễn*"] },
  { stt: 37, name: "Tây Mỗ", type: "Phường", mergedFrom: ["Đại Mỗ", "Dương Nội", "An Khánh*", "Tây Mỗ*"] },
  { stt: 38, name: "Đại Mỗ", type: "Phường", mergedFrom: ["Dương Nội", "Đại Mỗ", "Mộ Lao", "Mễ Trì*", "Nhân Chính*", "Trung Hòa*", "Phú Đô*", "Trung Văn*"] },
  { stt: 39, name: "Long Biên", type: "Phường", mergedFrom: ["Cự Khối", "Phúc Đồng", "Thạch Bàn", "Bát Tràng*", "Long Biên*", "Bồ Đề*", "Gia Thụy*"] },
  { stt: 40, name: "Bồ Đề", type: "Phường", mergedFrom: ["Ngọc Lâm", "Đức Giang*", "Gia Thụy*", "Thượng Thanh*", "Phúc Đồng*", "Ngọc Thụy*", "Bồ Đề*", "Long Biên*"] },
  { stt: 41, name: "Việt Hưng", type: "Phường", mergedFrom: ["Giang Biên", "Phúc Đồng", "Việt Hưng", "Phúc Lợi*", "Gia Thụy*", "Đức Giang*", "Thượng Thanh*"] },
  { stt: 42, name: "Phúc Lợi", type: "Phường", mergedFrom: ["Thạch Bàn", "Cổ Bi*", "Giang Biên*", "Việt Hưng*", "Phúc Lợi*", "Phúc Đồng*"] },
  { stt: 43, name: "Hà Đông", type: "Phường", mergedFrom: ["Phúc La", "Vạn Phúc", "Quang Trung*", "Đại Mỗ*", "Hà Cầu*", "La Khê*", "Văn Quán*", "Tân Triều*", "Mộ Lao*"] },
  { stt: 44, name: "Dương Nội", type: "Phường", mergedFrom: ["Dương Nội", "Phú La", "Yên Nghĩa", "La Phù*", "Đại Mỗ*", "La Khê*"] },
  { stt: 45, name: "Yên Nghĩa", type: "Phường", mergedFrom: ["Đồng Mai", "Yên Nghĩa*"] },
  { stt: 46, name: "Phú Lương", type: "Phường", mergedFrom: ["Phú Lãm", "Kiến Hưng*", "Phú Lương*", "Cự Khê*", "Hữu Hòa*"] },
  { stt: 47, name: "Kiến Hưng", type: "Phường", mergedFrom: ["Kiến Hưng", "Phú Lương", "Quang Trung*", "Hà Cầu*", "Phú La*"] },
  { stt: 48, name: "Thanh Trì", type: "Xã", mergedFrom: ["Văn Điển", "Ngũ Hiệp*", "Vĩnh Quỳnh*", "Yên Mỹ*", "Duyên Hà*", "Tứ Hiệp*", "Yên Sở*"] },
  { stt: 49, name: "Đại Thanh", type: "Xã", mergedFrom: ["Tam Hiệp", "Hữu Hòa*", "Kiến Hưng*", "Văn Điển*", "Tả Thanh Oai*", "Vĩnh Quỳnh*"] },
  { stt: 50, name: "Nam Phù", type: "Xã", mergedFrom: ["Vạn Phúc", "Liên Ninh*", "Ninh Sở*", "Đông Mỹ*", "Duyên Thái*", "Ngũ Hiệp*", "Yên Mỹ*", "Duyên Hà*"] },
  { stt: 51, name: "Ngọc Hồi", type: "Xã", mergedFrom: ["Ngọc Hồi", "Duyên Thái*", "Đại Áng*", "Khánh Hà*", "Liên Ninh*"] },
  { stt: 52, name: "Thanh Liệt", type: "Phường", mergedFrom: ["Tả Thanh Oai", "Đại Kim*", "Thanh Xuân Bắc*", "Hạ Đình*", "Văn Quán*", "Thanh Liệt*", "Tân Triều*"] },
  { stt: 53, name: "Thượng Phúc", type: "Xã", mergedFrom: ["Tân Minh", "Dũng Tiến", "Quất Động", "Nghiêm Xuyên", "Nguyễn Trãi"] },
  { stt: 54, name: "Thường Tín", type: "Xã", mergedFrom: ["Thường Tín", "Tiền Phong", "Hiền Giang", "Hòa Bình", "Nhị Khê", "Văn Bình", "Văn Phú", "Đại Áng*", "Khánh Hà*"] },
  { stt: 55, name: "Chương Dương", type: "Xã", mergedFrom: ["Chương Dương", "Lê Lợi", "Thắng Lợi", "Tự Nhiên", "Tô Hiệu*", "Vạn Nhất*"] },
  { stt: 56, name: "Hồng Vân", type: "Xã", mergedFrom: ["Hà Hồi", "Hồng Vân", "Liên Phương", "Vân Tảo", "Duyên Thái*", "Ninh Sở*", "Đông Mỹ*"] },
  { stt: 57, name: "Phú Xuyên", type: "Xã", mergedFrom: ["Phú Minh", "Phú Xuyên", "Hồng Thái", "Minh Cường", "Nam Phong", "Nam Tiến", "Quang Hà", "Văn Tự", "Tô Hiệu*", "Vạn Nhất*"] },
  { stt: 58, name: "Phượng Dực", type: "Xã", mergedFrom: ["Hoàng Long", "Hồng Minh", "Phú Túc", "Văn Hoàng", "Phượng Dực"] },
  { stt: 59, name: "Chuyên Mỹ", type: "Xã", mergedFrom: ["Tân Dân", "Châu Can", "Phú Yên", "Vân Từ", "Chuyên Mỹ"] },
  { stt: 60, name: "Đại Xuyên", type: "Xã", mergedFrom: ["Bạch Hạ", "Khai Thái", "Minh Tân", "Phúc Tiến", "Quang Lãng", "Tri Thủy", "Đại Xuyên"] },
  { stt: 61, name: "Thanh Oai", type: "Xã", mergedFrom: ["Kim Bài", "Đỗ Động", "Kim An", "Phương Trung", "Thanh Mai", "Kim Thư*"] },
  { stt: 62, name: "Bình Minh", type: "Xã", mergedFrom: ["Bích Hòa", "Bình Minh", "Cao Viên", "Thanh Cao", "Lam Điền*", "Cự Khê*", "Phú Lương*"] },
  { stt: 63, name: "Tam Hưng", type: "Xã", mergedFrom: ["Mỹ Hưng", "Thanh Thùy", "Thanh Văn", "Tam Hưng"] },
  { stt: 64, name: "Dân Hòa", type: "Xã", mergedFrom: ["Cao Xuân Dương", "Hồng Dương", "Liên Châu", "Tân Ước", "Dân Hòa"] },
  { stt: 65, name: "Vân Đình", type: "Xã", mergedFrom: ["Vân Đình", "Cao Sơn Tiến", "Phương Tú", "Tảo Dương Văn"] },
  { stt: 66, name: "Ứng Thiên", type: "Xã", mergedFrom: ["Hoa Viên", "Liên Bạt", "Quảng Phú Cầu", "Trường Thịnh"] },
  { stt: 67, name: "Hòa Xá", type: "Xã", mergedFrom: ["Hòa Phú", "Thái Hòa", "Bình Lưu Quang", "Phù Lưu Thành"] },
  { stt: 68, name: "Ứng Hòa", type: "Xã", mergedFrom: ["Đại Cường", "Đại Hùng", "Đông Lỗ", "Đồng Tân", "Kim Đường", "Minh Đức", "Trầm Lộng", "Trung Tú"] },
  { stt: 69, name: "Mỹ Đức", type: "Xã", mergedFrom: ["Đại Nghĩa", "An Phú", "Đại Hưng", "Hợp Thanh", "Phù Lưu Tế"] },
  { stt: 70, name: "Hồng Sơn", type: "Xã", mergedFrom: ["Phùng Xá", "An Mỹ", "Hợp Tiến", "Lê Thanh", "Xuy Xá", "Hồng Sơn"] },
  { stt: 71, name: "Phúc Sơn", type: "Xã", mergedFrom: ["Mỹ Xuyên", "Phúc Lâm", "Thượng Lâm", "Tuy Lai", "Đồng Tâm*"] },
  { stt: 72, name: "Hương Sơn", type: "Xã", mergedFrom: ["An Tiến", "Hùng Tiến", "Vạn Tín", "Hương Sơn"] },
  { stt: 73, name: "Chương Mỹ", type: "Phường", mergedFrom: ["Biên Giang", "Chúc Sơn", "Đại Yên", "Ngọc Hòa", "Phụng Châu", "Tiên Phương", "Thụy Hương", "Đồng Mai*"] },
  { stt: 74, name: "Phú Nghĩa", type: "Xã", mergedFrom: ["Đông Phương Yên", "Đông Sơn", "Thanh Bình", "Trung Hòa", "Trường Yên", "Phú Nghĩa"] },
  { stt: 75, name: "Xuân Mai", type: "Xã", mergedFrom: ["Xuân Mai", "Nam Phương Tiến", "Thủy Xuân Tiên", "Tân Tiến*"] },
  { stt: 76, name: "Trần Phú", type: "Xã", mergedFrom: ["Hoàng Văn Thụ", "Hữu Văn", "Mỹ Lương", "Trần Phú", "Đồng Tâm*", "Tân Tiến*"] },
  { stt: 77, name: "Hòa Phú", type: "Xã", mergedFrom: ["Hòa Phú", "Đồng Lạc", "Hồng Phú", "Thượng Vực", "Văn Võ", "Kim Thư*"] },
  { stt: 78, name: "Quảng Bị", type: "Xã", mergedFrom: ["Hoàng Diệu", "Hợp Đồng", "Quảng Bị", "Tốt Động", "Lam Điền*"] },
  { stt: 79, name: "Minh Châu", type: "Xã", mergedFrom: ["Minh Châu", "Tây Đằng*", "Chu Minh*"] },
  { stt: 80, name: "Quảng Oai", type: "Xã", mergedFrom: ["Cam Thượng", "Đông Quang", "Tiên Phong", "Thụy An*", "Tây Đằng*", "Chu Minh*"] },
  { stt: 81, name: "Vật Lại", type: "Xã", mergedFrom: ["Thái Hòa", "Phú Sơn", "Đồng Thái", "Phú Châu", "Vật Lại"] },
  { stt: 82, name: "Cổ Đô", type: "Xã", mergedFrom: ["Phú Cường", "Cổ Đô", "Phong Vân", "Phú Hồng", "Phú Đông", "Vạn Thắng"] },
  { stt: 83, name: "Bất Bạt", type: "Xã", mergedFrom: ["Thuần Mỹ", "Tòng Bạt", "Sơn Đà", "Cẩm Lĩnh*", "Minh Quang*"] },
  { stt: 84, name: "Suối Hai", type: "Xã", mergedFrom: ["Ba Trại", "Tản Lĩnh", "Thụy An*", "Cẩm Lĩnh*"] },
  { stt: 85, name: "Ba Vì", type: "Xã", mergedFrom: ["Ba Vì", "Khánh Thượng", "Minh Quang*"] },
  { stt: 86, name: "Yên Bài", type: "Xã", mergedFrom: ["Vân Hòa", "Yên Bài", "Thạch Hòa*"] },
  { stt: 87, name: "Sơn Tây", type: "Phường", mergedFrom: ["Ngô Quyền", "Phú Thịnh", "Viên Sơn", "Đường Lâm", "Trung Hưng*", "Sơn Lộc*", "Thanh Mỹ*"] },
  { stt: 88, name: "Tùng Thiện", type: "Phường", mergedFrom: ["Xuân Khanh", "Trung Sơn Trầm", "Xuân Sơn", "Trung Hưng*", "Sơn Lộc*", "Thanh Mỹ*"] },
  { stt: 89, name: "Đoài Phương", type: "Xã", mergedFrom: ["Kim Sơn", "Sơn Đông", "Cổ Đông*"] },
  { stt: 90, name: "Phúc Thọ", type: "Xã", mergedFrom: ["Phúc Thọ", "Long Thượng", "Phúc Hòa", "Phụng Thượng", "Tích Lộc", "Trạch Mỹ Lộc"] },
  { stt: 91, name: "Phúc Lộc", type: "Xã", mergedFrom: ["Nam Hà", "Sen Phương", "Vân Phúc", "Võng Xuyên", "Xuân Đình"] },
  { stt: 92, name: "Hát Môn", type: "Xã", mergedFrom: ["Tam Hiệp", "Hiệp Thuận", "Liên Hiệp", "Ngọc Tảo", "Tam Thuấn", "Thanh Đa", "Hát Môn"] },
  { stt: 93, name: "Thạch Thất", type: "Xã", mergedFrom: ["Liên Quan", "Cẩm Yên", "Đại Đồng", "Kim Quan", "Lại Thượng", "Phú Kim"] },
  { stt: 94, name: "Hạ Bằng", type: "Xã", mergedFrom: ["Cần Kiệm", "Đồng Trúc", "Bình Yên*", "Hạ Bằng*", "Tân Xã*", "Phú Cát*"] },
  { stt: 95, name: "Tây Phương", type: "Xã", mergedFrom: ["Phùng Xá", "Hương Ngải", "Lam Sơn", "Thạch Xá", "Quang Trung*", "Quốc Oai*", "Ngọc Liệp*", "Phượng Sơn*"] },
  { stt: 96, name: "Hòa Lạc", type: "Xã", mergedFrom: ["Tiến Xuân", "Thạch Hòa", "Cổ Đông*", "Bình Yên*", "Hạ Bằng*", "Tân Xã*"] },
  { stt: 97, name: "Yên Xuân", type: "Xã", mergedFrom: ["Đông Xuân", "Yên Bình", "Yên Trung", "Tiến Xuân*", "Thạch Hòa*"] },
  { stt: 98, name: "Quốc Oai", type: "Xã", mergedFrom: ["Thạch Thán", "Sài Sơn", "Ngọc Mỹ*", "Quốc Oai*", "Phượng Sơn*"] },
  { stt: 99, name: "Hưng Đạo", type: "Xã", mergedFrom: ["Cộng Hoà", "Đồng Quang", "Hưng Đạo"] },
  { stt: 100, name: "Kiều Phú", type: "Xã", mergedFrom: ["Cấn Hữu", "Liệp Nghĩa", "Tuyết Nghĩa", "Ngọc Liệp*", "Quang Trung*", "Ngọc Mỹ*"] },
  { stt: 101, name: "Phú Cát", type: "Xã", mergedFrom: ["Đông Yên", "Hoà Thạch", "Phú Mãn", "Phú Cát*"] },
  { stt: 102, name: "Hoài Đức", type: "Xã", mergedFrom: ["Trạm Trôi", "Di Trạch", "Đức Giang", "Đức Thượng", "Tây Tựu*", "Tân Lập*", "Kim Chung*"] },
  { stt: 103, name: "Dương Hòa", type: "Xã", mergedFrom: ["Cát Quế", "Dương Liễu", "Đắc Sở", "Minh Khai", "Yên Sở"] },
  { stt: 104, name: "Sơn Đồng", type: "Xã", mergedFrom: ["Lại Yên", "Sơn Đồng", "Tiền Yên", "An Khánh*", "Song Phương*", "Vân Côn*", "An Thượng*", "Vân Canh*"] },
  { stt: 105, name: "An Khánh", type: "Xã", mergedFrom: ["Đông La", "Dương Nội*", "An Khánh*", "La Phù*", "Song Phương*", "Vân Côn*", "An Thượng*"] },
  { stt: 106, name: "Đan Phượng", type: "Xã", mergedFrom: ["Phùng", "Đồng Tháp", "Song Phượng", "Thượng Mỗ", "Đan Phượng"] },
  { stt: 107, name: "Ô Diên", type: "Xã", mergedFrom: ["Hạ Mỗ", "Tân Hội", "Liên Hà*", "Hồng Hà*", "Liên Hồng*", "Liên Trung*", "Văn Khê*", "Tây Tựu*", "Tân Lập*"] },
  { stt: 108, name: "Liên Minh", type: "Xã", mergedFrom: ["Phương Đình", "Trung Châu*", "Thọ Xuân*", "Thọ An*", "Hồng Hà*", "Tiến Thịnh*"] },
  { stt: 109, name: "Gia Lâm", type: "Xã", mergedFrom: ["Dương Xá", "Kiêu Kỵ", "Trâu Quỳ*", "Thạch Bàn*", "Phú Sơn*", "Cổ Bi*", "Đa Tốn*", "Bát Tràng*"] },
  { stt: 110, name: "Thuận An", type: "Xã", mergedFrom: ["Dương Quang", "Lệ Chi", "Đặng Xá*", "Phú Sơn*"] },
  { stt: 111, name: "Bát Tràng", type: "Xã", mergedFrom: ["Kim Đức", "Cự Khối*", "Thạch Bàn*", "Trâu Quỳ*", "Đa Tốn*", "Bát Tràng*"] },
  { stt: 112, name: "Phù Đổng", type: "Xã", mergedFrom: ["Yên Viên", "Ninh Hiệp", "Phù Đổng", "Thiên Đức", "Yên Thường", "Yên Viên", "Cổ Bi*", "Đặng Xá*"] },
  { stt: 113, name: "Thư Lâm", type: "Xã", mergedFrom: ["Thụy Lâm", "Vân Hà", "Xuân Nộn*", "Đông Anh*", "Liên Hà*", "Dục Tú*", "Nguyên Khê*", "Uy Nỗ*", "Việt Hùng*"] },
  { stt: 114, name: "Đông Anh", type: "Xã", mergedFrom: ["Cổ Loa", "Đông Hội", "Mai Lâm", "Đông Anh*", "Tàm Xá*", "Tiên Dương*", "Vĩnh Ngọc*", "Xuân Canh*", "Liên Hà*", "Dục Tú*", "Uy Nỗ*", "Việt Hùng*"] },
  { stt: 115, name: "Phúc Thịnh", type: "Xã", mergedFrom: ["Bắc Hồng", "Nam Hồng", "Vân Nội", "Vĩnh Ngọc*", "Nguyên Khê*", "Xuân Nộn*", "Tiên Dương*", "Đông Anh*"] },
  { stt: 116, name: "Thiên Lộc", type: "Xã", mergedFrom: ["Võng La", "Kim Chung*", "Đại Mạch*", "Kim Nỗ*", "Tiền Phong*", "Hải Bối*"] },
  { stt: 117, name: "Vĩnh Thanh", type: "Xã", mergedFrom: ["Tàm Xá", "Xuân Canh", "Vĩnh Ngọc*", "Kim Chung*", "Hải Bối*", "Kim Nỗ*"] },
  { stt: 118, name: "Mê Linh", type: "Xã", mergedFrom: ["Tráng Việt", "Tiền Phong*", "Văn Khê*", "Mê Linh*", "Đại Thịnh*", "Hồng Hà*", "Liên Hà*", "Liên Hồng*", "Liên Trung*", "Đại Mạch*"] },
  { stt: 119, name: "Yên Lãng", type: "Xã", mergedFrom: ["Chu Phan", "Hoàng Kim", "Liên Mạc", "Thạch Đà*", "Văn Khê*", "Tiến Thịnh*", "Trung Châu*", "Thọ Xuân*", "Thọ An*", "Hồng Hà*"] },
  { stt: 120, name: "Tiến Thắng", type: "Xã", mergedFrom: ["Tam Đồng", "Tiến Thắng", "Tự Lập", "Đại Thịnh*", "Kim Hoa*", "Thanh Lâm*", "Văn Khê*", "Thạch Đà*"] },
  { stt: 121, name: "Quang Minh", type: "Xã", mergedFrom: ["Chi Đông", "Quang Minh", "Mê Linh*", "Tiền Phong*", "Đại Thịnh*", "Kim Hoa*", "Thanh Lâm*"] },
  { stt: 122, name: "Sóc Sơn", type: "Xã", mergedFrom: ["Sóc Sơn", "Tân Minh", "Đông Xuân", "Phù Lỗ", "Phù Linh", "Tiên Dược", "Mai Đình*", "Phú Minh*", "Quang Tiến*"] },
  { stt: 123, name: "Đa Phúc", type: "Xã", mergedFrom: ["Bắc Phú", "Đức Hoà", "Kim Lũ", "Tân Hưng", "Việt Long", "Xuân Giang", "Xuân Thu"] },
  { stt: 124, name: "Nội Bài", type: "Xã", mergedFrom: ["Phú Cường", "Hiền Ninh", "Thanh Xuân", "Mai Đình*", "Phú Minh*", "Quang Tiến*"] },
  { stt: 125, name: "Trung Giã", type: "Xã", mergedFrom: ["Bắc Sơn", "Hồng Kỳ", "Nam Sơn", "Trung Giã"] },
  { stt: 126, name: "Kim Anh", type: "Xã", mergedFrom: ["Tân Dân", "Minh Phú", "Minh Trí"] },
];

// Build the old → new mapping
// Note: entries with * mean only part of the old ward was merged
// We strip the * for the mapping (user's address in old ward still maps to new ward)
const wardMapping = {};

for (const ward of newWards) {
  const newName = `${ward.type} ${ward.name}`;
  for (let oldName of ward.mergedFrom) {
    // Strip the partial marker
    const isPartial = oldName.endsWith('*');
    oldName = oldName.replace('*', '').trim();
    
    if (!wardMapping[oldName]) {
      wardMapping[oldName] = [];
    }
    wardMapping[oldName].push({
      newWard: ward.name,
      newType: ward.type,
      isPartial: isPartial
    });
  }
}

// Save new wards list
const outNewWards = path.join(__dirname, '..', 'data', 'hanoi_new_wards.json');
fs.writeFileSync(outNewWards, JSON.stringify(newWards, null, 2), 'utf8');
console.log(`Saved ${newWards.length} new wards to ${outNewWards}`);

// Save ward mapping (old → new)
const outMapping = path.join(__dirname, '..', 'data', 'hanoi_ward_mapping.json');
fs.writeFileSync(outMapping, JSON.stringify(wardMapping, null, 2), 'utf8');
console.log(`Saved ward mapping (${Object.keys(wardMapping).length} old wards) to ${outMapping}`);

// Stats
console.log('\n--- Stats ---');
console.log(`New wards (phường): ${newWards.filter(w => w.type === 'Phường').length}`);
console.log(`New communes (xã): ${newWards.filter(w => w.type === 'Xã').length}`);
console.log(`Total: ${newWards.length}`);
console.log(`Old ward names mapped: ${Object.keys(wardMapping).length}`);

// Show wards that map to multiple new wards (partial splits)
const multiMap = Object.entries(wardMapping).filter(([k, v]) => v.length > 1);
console.log(`\nOld wards split across multiple new wards: ${multiMap.length}`);
multiMap.slice(0, 10).forEach(([old, news]) => {
  console.log(`  ${old} → ${news.map(n => n.newWard).join(', ')}`);
});
