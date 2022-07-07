// 路由配置信息
// 引入路由组件
// import Home from "@/pagaes/Home/Home.vue";
// import Login from "@/pagaes/Login";
// import Register from "@/pagaes/Register";
// import Search from "@/pagaes/search/index.vue";
// import Detail from "@/pagaes/Detail";
// import AddCartSuccess from "@/pagaes/AddCartSuccess";
// import ShopCart from "@/pagaes/ShopCart";
// import Trade from "@/pagaes/Trade";
// import Pay from "@/pagaes/Pay";
// import PaySuccess from "@/pagaes/PaySuccess";
// import Center from "@/pagaes/Center";
// 引入二级路由组件
// import MyOrder from "@/pagaes/Center/myOrder";
// import GroupBuy from "@/pagaes/Center/groupOrder";
export default [{
        path: "/center",
        component: () =>
            import ("@/pagaes/Center"),
        //二级路由
        children: [{
                // path: '/center/myorder',
                path: "myorder",
                component: () =>
                    import ("@/pagaes/Center/myOrder"),
            },
            {
                path: "groupbuy",
                component: () =>
                    import ("@/pagaes/Center/groupOrder"),
            },
            { //重定向一上来就展示myorder组件
                path: '',
                redirect: 'myorder'
            }
        ],
        meta: {
            show: true,
        },
    },
    {
        path: "/paySuccess",
        component: () =>
            import ("@/pagaes/PaySuccess"),
        meta: {
            show: true,
        },
    },
    {
        path: "/pay",
        component: () =>
            import ("@/pagaes/Pay"),
        meta: {
            show: true,
        },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            if (from.path == '/trade') {
                next()
            } else {
                next(false)
            }
        }
    },
    {
        path: "/trade",
        component: () =>
            import ("@/pagaes/Trade"),
        meta: {
            show: true,
        },
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            if (from.path == '/shopcart') {
                next()
            } else {
                next(false)
            }
        }
    },
    {
        path: "/shopcart",
        component: () =>
            import ("@/pagaes/ShopCart"),
        name: "ShopCart",
        meta: {
            show: true,
        },
    },
    {
        path: "/addCartsuccess",
        component: () =>
            import ("@/pagaes/AddCartSuccess"),
        name: "addcartsuccess",
        meta: {
            show: true,
        },
    },
    {
        path: "*",
        redirect: "/Home", //一上来就展示首页
    },
    {
        path: "/detail/:skuId",
        component: () =>
            import ("@/pagaes/Detail"),
        meta: {
            show: true,
        },
    },
    {
        path: "/login",
        component: () =>
            import ("@/pagaes/Login"),
        meta: {
            show: true,
        },
    },
    {
        path: "/home",
        component: () =>
            import ("@/pagaes/Home/Home.vue"),
    },
    {
        path: "/register",
        component: () =>
            import ("@/pagaes/Register"),
    },
    {
        path: "/search/:keyword?",
        name: "soso",
        component: () =>
            import ("@/pagaes/search/index.vue"),
        meta: {
            show: true,
        },
        props: ($route) => ({
            keyword: $route.params.keyword,
            k: $route.query.k,
        }),
    },
];
