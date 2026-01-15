import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("shop", "routes/shop.tsx"),
  route("admin", "routes/admin.index.tsx"),
  route("admin/sales", "routes/admin.sales.tsx"),
  route("admin/products", "routes/admin.products.tsx"),
  route("admin/products-manage", "routes/admin.products-manage.tsx"),
  route("api/upload-product-image", "routes/api.upload-product-image.tsx"),
] satisfies RouteConfig;

