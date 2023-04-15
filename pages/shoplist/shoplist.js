// pages/shoplist/shoplist.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	query:{},
	shopList:[],
	page:1,//页面值
	pageSize:10,//页面数据值
	total:0,
	isloading:false /*节流*/
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
  this.setData({
	  query:options
	})
	this.getShopList()
	},
getShopList(cb){
	//节流
	this.setData({
		isloading:true
	})
//展示loading效果
wx.showLoading({
	title: '页面加载中...',
})

	wx.request({
		url: `https://applet-base-api-t.itheima.net/categories/${this.data.query.id}/shops`,
		method:'GET',
		data:{
			_page:this.data.page,
			_limit:this.data.pageSize
		},
		success:(res) => {
			this.setData({
				shopList:[...this.data.shopList,...res.data],
				total:res.header['X-Total-Count']-0  //-0字符串转换成数字
			})
		},
		complete:()=>{
			//隐藏loading效果
			wx.hideLoading()
			this.setData({
				isloading:false
			})
			//关闭上拉刷新窗口
			//wx.stopPullDownRefresh()
			cb&&cb()
		}
	})
},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {
  wx.setNavigationBarTitle({
		name: this.data.query.name,
	})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {
	 //需要重置关键数据
	 this.setData({
		 page:1,
		 shopList:[],
		 total:0
	 })
	 //重新发起数据请求
	 this.getShopList(()=>{
		 wx.stopPullDownRefresh()
	 })
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {
if(this.data.page*this.data.pageSize>=this.data.total){
	//证明没有下一页数据
	return wx.showToast({
		title: '数据加载完毕！',
		icon:'none'
	})
}

		if(this.data.isloading) return
  this.setData({
		page:this.data.page+1
	})
	this.getShopList()
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})