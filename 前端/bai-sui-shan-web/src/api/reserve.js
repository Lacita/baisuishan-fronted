import commonrequest from '../util/common';

/***
 * 临时车预约功能
 */
export function resrveCarNo(data){
    return commonrequest({
        url:'/operate/reserve',
        method:'post',
        data:data
    });
}