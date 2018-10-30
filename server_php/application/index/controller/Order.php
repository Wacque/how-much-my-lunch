<?php

namespace app\index\controller;

use think\Console;
use think\Controller;
use think\Db;
use think\Request;

class Order extends Controller
{
    /**
     * 饭单查询
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function orderQuery() {
        $userid = tokenCheck(input('openid'));

        $details = Db::name('order')->alias('o')
            ->join('order_detail od', 'o.id = od.order_id')
            ->join('friends f', 'od.friend_id = f.id')
            ->where('o.userid', $userid)
            ->field('create_time,friend_avatar,friend_name,od.id,origin_price,order_id,origin_price')
            ->select();

//        return json_encode($details);

        $tempdata = array();
        foreach ($details as $k => $v) {
            $exist = false;
            foreach ($tempdata as $k1 => $v1) {
                if($v1['order_id'] === $v['order_id']) {
                    $tempdata[$k1]['details'][] = $v;
                    $exist = true;
                }
            }
            if($exist === false) {
                $item = ['create_time' =>  date("Y年m月d日", $v['create_time']) , 'order_id' => $v['order_id'], 'details' => [$v]];
                $tempdata[] = $item;
            }
        }
        return defaultData(0, 's', $tempdata, 0);

    }

    /**
     * 写入新的饭单
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function addOrder() {
        $userid = tokenCheck(input('openid'));
        $detail = json_decode(input('detail'), true) ;
        if(count($detail) < 1) {
            return defaultData(0, '没有传入数据！', [], 0);
        }
        $basicOrderInfo = [
            'userid' => $userid,
            'create_time' => time()
        ];

        // 写入饭单基础信息表
        $orderId = Db::name('order')->insertGetId($basicOrderInfo);

        // 饭单详情
        foreach ($detail as $key => $item){
            $detail[$key]['order_id'] = $orderId;
        }

        $dbRes = Db::name('order_detail')->insertAll($detail);
//        return Db::name('order_detail')->getLastSql();

        return defaultData(0, 'success', [], 0);

    }
}
