import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("admin/products", "routes/admin.products.tsx"),
  route("api/upload-product-image", "routes/api.upload-product-image.tsx"),
  route("language-selection", "routes/language-selection.tsx"),
  route("auth-Japanese", "routes/auth-Japanese.tsx"),
  route("auth-English", "routes/auth-English.tsx"),
] satisfies RouteConfig;
