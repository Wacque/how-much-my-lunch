<?php

namespace app\index\controller;

use app\index\helper\friendHelper;
use think\Controller;
use think\Db;
use think\Request;

class Friend extends Controller
{
    /**
     * 新增饭友
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
   public function addFriend() {

        $openid = input('openid');
        $friend_name = htmlentities(input('friend_name', null, 'trim'));
        $friend_avatar = input('friend_avatar');

        // 检查token， 返回userid
        $userid = tokenCheck($openid);

        if($friend_name === '') {
            return defaultData(1, '缺少饭友名字', [], 0);
        }

        $res = friendHelper::addFriend($userid, $friend_name, $friend_avatar);

        if($res) {
            return defaultData(0, '新增成功', [], 0);
        }else {
            return defaultData(0, '新增成功', array($res), 0);
        }

   }

   public function queryFriend() {
       $openid = input('openid');
       $userid = tokenCheck($openid);
       $sort = input('ifSort');

       // 判断是否排序
       if($sort) {
            $res = Db::name('friends')
                ->query('SELECT
                                COUNT( mo.id ) AS count,
                                friend_avatar,
                                friend_name,
                                mf.id 
                            FROM
                                meat_friends AS mf 
                                LEFT JOIN meat_order_detail AS mo ON mo.friend_id = mf.id
                            GROUP BY
                                mf.id 
                            ORDER BY
                                COUNT( mo.id ) DESC,
				id');
       }else {
           $res = Db::name('friends')
               ->field('id,friend_name,friend_avatar')
               ->where('refer_to', $userid)
               ->select();
       }

       if(!$res) {
         $res = [];
       }
       return defaultData(0, 'success',$res , 0);
   }
}
