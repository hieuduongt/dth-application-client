const PATH = {
    ADMIN: {
        HOME: "/admin",
        LIST_PRODUCTS: "/admin/list-products",
        PRODUCT_DETAIL: "/admin/product/:id",
        LIST_CATEGORIES: "/admin/list-categories",
        CATEGORY: "/admin/category/:id",
    },
    USER: {
        HOME: "/",
        LIST_PRODUCTS: "category/:id",
        PRODUCT_DETAIL: "/product/:id",
        LIST_CATEGORIES: "/list-categories",
    },
    CART: "/buy/cart",
    BASEURL: "https://localhost:7023/api",
    IMAGEBASEURL: "https://localhost:7023",
    LOGIN: "/login",
    REGISTER: "/register"
};

export default PATH;