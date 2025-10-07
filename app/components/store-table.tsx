import React from 'react';

const StoreTable = () => {
    const tableData = [
        {
            doorName: "嘉兴山姆会员店",
            doorAddress: "浙江省嘉兴市经开区",
            area: "约4万平方米",
            expectedOpening: "2025年3月",
            notes: "首店"
        },
        {
            doorName: "合肥庐山山姆会员店",
            doorAddress: "安徽省合肥市经开区",
            area: "约2.9万平方米",
            expectedOpening: "2025年4月",
            notes: "首店"
        },
        {
            doorName: "深圳宝安山姆会员店",
            doorAddress: "广东省深圳市宝安区新桥街道\n计划通过空中廊桥与万丰海岸城连通，深圳目前有4家山姆会员店已开业，分别位于福田、龙华、前海和龙岗。",
            area: "约2.12万平方米",
            expectedOpening: "2025年10月",
            notes: "深圳5店"
        },
        {
            doorName: "中山山姆会员店",
            doorAddress: "广东省中山市石岐街道石岐西路15号规划为大湾区首家达到国家绿色建筑三星级标准的山姆会员店。",
            area: "约3.7万平方米",
            expectedOpening: "2025年9月",
            notes: "首店"
        },
        {
            doorName: "张家港山姆会员店",
            doorAddress: "江苏省张家港市长沙路与老宅路交汇处",
            area: "约5.6万平方米",
            expectedOpening: "2025年第四季度",
            notes: "江苏10店"
        },
        {
            doorName: "江苏扬州会员店",
            doorAddress: "江苏省扬州市邗江区",
            area: "约3.8万平方米",
            expectedOpening: "2025年一季度",
            notes: "江苏9店"
        },
        {
            doorName: "东莞山姆会员店",
            doorAddress: "东莞市寮步镇寮步华金富街138号",
            area: "约2.3万平方米",
            expectedOpening: "2024年11月",
            notes: "首店"
        },
        {
            doorName: "沈阳浑南山姆会员店",
            doorAddress: "辽宁省沈阳市皇姑区鸭绿江北街与圣安路交叉口",
            area: "约2.83万平方米",
            expectedOpening: "2025年内",
            notes: "辽宁2店"
        },
        {
            doorName: "漳州山姆会员店",
            doorAddress: "广东省广州市荔湾区观海路",
            area: "约3万平方米",
            expectedOpening: "2025年内",
            notes: "广州3店"
        },
        {
            doorName: "上海金桥山姆会员店",
            doorAddress: "上海市浦东新区利川路",
            area: "约3万平方米",
            expectedOpening: "2025年内",
            notes: "上海7店"
        },
        {
            doorName: "昌平山姆会员店",
            doorAddress: "北京市昌平区",
            area: "约2.9万平方米",
            expectedOpening: "2025年内",
            notes: "首店"
        },
    ];

    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
            {/* Title - Changed text-white to text-gray-900 */}
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 text-center mb-2 leading-tight">
                OPENING A STORE THROUGH MEMBERSHIP CHANNELS
            </h2>
            {/* Subtitle - Changed text-white to text-gray-700 */}
            <p className="text-2xl md:text-3xl font-bold text-gray-700 text-center mb-8">
                会员渠道开店 2025山姆会员店新增,目前21个城市56家
            </p>

            {/* Table Container */}
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-gray-200"> {/* Added subtle border */}
                <table className="w-full text-sm text-left text-gray-900"> {/* Changed text-white to text-gray-900 */}
                    <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-300"> {/* Light header background */}
                        <tr>
                            <th scope="col" className="py-3 px-6 text-base font-bold">
                                门店名
                            </th>
                            <th scope="col" className="py-3 px-6 text-base font-bold">
                                门店地址
                            </th>
                            <th scope="col" className="py-3 px-6 text-base font-bold">
                                面积
                            </th>
                            <th scope="col" className="py-3 px-6 text-base font-bold">
                                预计开业
                            </th>
                            <th scope="col" className="py-3 px-6 text-base font-bold">
                                备注
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            // Changed border-gray-700 to border-gray-200 and hover:bg-gray-800/50 to hover:bg-gray-100
                            <tr key={index} className="bg-transparent border-b border-gray-200 hover:bg-gray-100">
                                {/* Ensure all td content uses the default dark text color inherited from the table */}
                                <td className="py-4 px-6 font-medium whitespace-nowrap">
                                    {row.doorName}
                                </td>
                                <td className="py-4 px-6 whitespace-pre-line">
                                    {row.doorAddress}
                                </td>
                                <td className="py-4 px-6">
                                    {row.area}
                                </td>
                                <td className="py-4 px-6">
                                    {row.expectedOpening}
                                </td>
                                <td className="py-4 px-6">
                                    {row.notes}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default StoreTable;