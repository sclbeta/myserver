// 基于准备好的dom，初始化echarts实例
var pm25 = echarts.init(document.getElementById('pm25'));
// 指定图表的配置项和数据
var option = {
 title: {
     text: 'PM2.5'
 },
 tooltip: {},
 legend: {
     data:['PM2.5']
 },
 xAxis: {
     data: []
 },
 yAxis: {},
 series: [{
     name: 'PM2.5',
     type: 'bar',
     data: []
 }]
};
pm25.setOption(option)
function set_option(x_data, y_data) {

    pm25.setOption({
    xAxis: {
        data: x_data
    },
    series: [{
        // 根据名字对应到相应的系列
        name: 'PM2.5',
        type: 'bar',
        data: y_data
         }]
    });
}


function get_data(date) {
    var url = "/test/test/"+date
	fetch(url).then(function(res)
	{
	 	// res instanceof Response == true.
		if (res.ok)
		{
		    res.json().then(function(data)
		    {
		    	console.log(data.error);
		    	console.log(data.data);
		    	if(data.error)
                {
                    var x_data = []
                    var y_data = []
                    for(var i in data.data)
                    {
                        x_data[i] = i
                        y_data[i] = data.data[i].data
                        set_option(x_data, y_data)
                    }
                }
                else
                {
                    alert("没有所选择日期的数据")
                }
		    });
		}
		else
		{
	    	console.log("Looks like the response wasn't perfect, got status", res.status);
	  	}
	},
	function(e)
	{
	  console.log("Fetch failed!", e);
	}
	);
}

function page_loaded()
{
	var cur_time = new Date()
	var date = cur_time.getFullYear()+"-"+(cur_time.getMonth()+1)+"-"+cur_time.getDate()
//	alert(date)
    get_data(date)
}

function set_new_data()
{
	var date = $("#date_pick").val()
	var n = date.search("\\\d\\\d\\\d\\\d-\\\d\\\d-\\\d\\\d")
	if(n == -1)
	{
		// alert(n)
        alert("日期选择错误")
	}
	else
	{
		// alert(date)
        get_data(date)
	}
}
