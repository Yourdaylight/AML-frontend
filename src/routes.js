import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import MLmodel from './views/nav1/MLmodel.vue'
import user from './views/nav1/user.vue'
import Clean from './views/nav1/Clean.vue'
import History from './views/nav2/History.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '结构化数据建模',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            {
                path: '/main',
                component: Main,
                name: '主页',
                hidden: true ,
                meta:{keepAlive: true}
            },
            { path: '/table', component: Table, name: '我的数据集', meta:{keepAlive: true} },
            { path: '/user', component: user, name: '数据预览', meta:{keepAlive: true} },
            { path:'/clean', component: Clean, name:'数据清洗', meta:{keepAlive: true}},
            { path: '/MLmodel', component: MLmodel, name: '快速建模', meta:{keepAlive: true} },

        ],
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/',
        component: Home,
        name: '构建历史',
        iconCls: 'fa fa-id-card-o',
        children: [
            {path: '/history', component: History, name: '历史记录'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '文本数据建模',
        iconCls: 'fa fa-address-card',
        // leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '页面6' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;