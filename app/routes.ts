import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
                route("payment", "routes/payment.tsx"),
                route("cash", "routes/cash.tsx"), 
                route("paypay", "routes/paypay.tsx"),
] satisfies RouteConfig;
