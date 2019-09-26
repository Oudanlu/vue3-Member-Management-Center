const Mock = require('mockjs')
const data = Mock.mock({
    //定义数据生成规则
    'memberList|2-6': [
        {
            'id|+1': 2, // 自增长1 ，初始值为2，
            'name|1-3': 'oudanlu', // 随机生成1到3个重叠danlu  'name|2': 'oudanlu'  生成2个danlu
            'phone|11': '8', 
            'age|1-120': 1, 
            'salary|6000-8000.1-3': 1, 
            'status|1': true, 
            'open|2-4': false, // 生成的概率， true 4/(2+4) false 2/(2+4)
            'order|2': {id: 1, name: '订单1', price: 999}, 
            'order2|2-3': {id: 1, name: '订单1', price: 999}, 
            'idCard': /\d{15}|\d{18}/ // 指定正则表达式，当前生成身份证号.! 不要用单引号引起来。
        }
    ]

    'empList|6':[
    {
        'id|+1': 1,
        'name': '@cname', //'@string',
        'price': '@float',
        'status': '@boolean',
        'birthday': '@date("yyyy/MM/dd")',
        'createDate': '@datetime("yyyy/MM/dd HH:mm:ss")', 
        'pic': '@image',
        'title': '@title',
        'ctitle': '@ctitle(10, 30)',
        'content': '@csentence(100, 500)',
        'first': '@cfirst',
        'last': '@clast',
        'url': '@url("http", "oudanlu.com")',
        "domain": '@domain',
        'ip': '@ip',
        "area": "@region",
        "address": "@county(true)",
        'zipCode': '@zip',
        'phone|11': '@integer(0, 9)'
    }
]
})
console.log( JSON.stringify(data, null, 2))
