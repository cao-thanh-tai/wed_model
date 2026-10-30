# Frontend Notes

Tài liệu này ghi lại các quy ước và quyết định quan trọng khi tiếp tục chỉnh
sửa frontend. Mục tiêu là giúp các phiên làm việc sau hiểu đúng cấu trúc hiện
tại và tránh làm hỏng flow inference.

## Current UI structure

- `App.tsx` giữ state dùng chung cho trạng thái backend, danh sách model, model
  đang loaded và chuỗi tìm kiếm model.
- `AppShell.tsx` bao bọc toàn bộ ứng dụng bằng hai header:
  - `Sidebar.tsx` hiện đang render **navbar ngang phía trên**, dù tên file vẫn
    là `Sidebar`.
  - `Topbar.tsx` hiển thị tiêu đề, breadcrumb và runtime model popover.
- `WorkspacePage.tsx` là trang chính với cấu trúc cuộn dọc:
  1. Hero section cao `100vh`.
  2. Khu vực catalogue/showcase phía dưới.
  3. Mỗi model hiển thị thành một hàng full-width, chia hai cột và luân phiên
     vị trí hình ảnh.
- Các route khác cần giữ hoạt động:
  - `/models/:modelId`
  - `/models/:modelId/test`
  - `/runs`

## Header behavior

- `AppShell.tsx` quản lý một state scroll dùng chung cho cả `Sidebar` và
  `Topbar`.
- Khi scroll xuống, hai header cùng ẩn.
- Khi scroll lên hoặc ở gần đầu trang, hai header cùng hiện lại.
- Navbar có chiều cao CSS qua `--top-nav-height`.
- `Topbar` dùng `top: var(--top-nav-height)` để không đè lên navbar.
- Khi sửa header, không tạo thêm listener scroll riêng trong từng component.
- Header hiện dùng nền đen đặc, không dùng nền trong suốt.

## Visual direction

Giao diện đang theo hướng Vercel-inspired, không sao chép nguyên bản:

- Nền đen.
- Typography trắng/xám.
- Border mảnh và nhiều khoảng trống.
- Button trắng tương phản cao.
- Glow/radial spotlight nhẹ để phân tách các vùng content.
- Không đổi sang palette sáng hoặc neon nếu không có yêu cầu rõ ràng.

## Search and model showcase

- Search nằm trong navbar và được quản lý ở `App.tsx`.
- Search lọc model theo:
  - tên model,
  - category,
  - input type,
  - output type.
- Shortcut model trong navbar cập nhật cùng chuỗi search.
- Không thay đổi model registry hoặc API chỉ để phục vụ việc lọc frontend.

## Model images

- Asset public đặt trong `frontend/public/models/`.
- Mapping ảnh model đặt tại `src/services/modelAssets.ts`.
- Showcase mới dùng một ảnh cover chính cho mỗi model, không cần tạo ảnh
  riêng cho từng class.
- Model Fruit Classification dự kiến dùng:

```text
frontend/public/models/fruit-classification/cover.jpg
```

- Khi thêm ảnh mới, cập nhật mapping trong `modelAssets.ts` và kiểm tra đúng
  model id backend trả về.

## Behavior that must be preserved

- Không đưa Python, PyTorch hoặc inference logic vào frontend.
- Giữ API version `/api/v1/...`.
- Giữ upload ảnh, drag-and-drop, prediction result, copy/JSON export.
- Giữ release runtime model và loaded-model popover.
- Giữ run history ở local storage.
- Không dùng `onnxruntime-web` cho flow hiện tại nếu chưa có yêu cầu chuyển
  inference sang browser.

## Validation

Chạy build từ thư mục `frontend/`:

```bash
npm run build
```

Build có thể cập nhật `tsconfig.tsbuildinfo`; đây là file sinh tự động, không
nên đưa vào thay đổi tính năng nếu repository không yêu cầu.
