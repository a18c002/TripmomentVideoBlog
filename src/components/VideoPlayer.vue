<template>
  <div class="vidoe-wrapper" v-if="show">
    <div class="close-btn" @click="colse">X</div>
    <div class="vidoe-box">
      <youtube :video-id="videoId" @ended="videoEndEvent" ref="youtube" width="800px"></youtube>
      <div class="info-wrapper">
        <div class="video-info">
          <div class="title" v-if="videoInfo != null">{{ videoInfo.snippet.title }}</div>
          <div class="info" v-if="videoInfo != null">觀看次數：{{ videoInfo.statistics.viewCount }}人次 • {{ videoInfo.snippet.publishedAt.replace("T"," ").replace("Z","") }}</div>
        </div>
        <div class="msg-list">
          <p class="title">訪客留言</p>
          <div class="item-block">
            <p class="noMsg" v-if="messageList.length <= 0">還沒有人留言喔～快來當第一個吧</p>
            <div class="msg-item" v-for="(msg,msg_ind) in messageList" :key="msg_ind">
              <div class="icon"></div>
              <div class="message">
                <p class="index">訪客{{msg_ind+1}}號說...</p>
                <P class="text">{{ msg.message }}</P>
              </div>
            </div>
          </div>
        </div>
        <div class="input-msg">
          <input class="input" type="text" placeholder="留言..." v-model="messageInput">
          <div class="btn" @click="setMessage">發布</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      show: false,
      videoId: '',
      videoInfo: null,
      messageList: [],
      messageInput: ''
    }
  },
  methods:{
    colse () {
      this.show = false,
      this.videoInfo = null
      this.messageList = []
      this.messageInput = ''
    },
    openVideo (videoId) {
      this.videoId = videoId
      this.show = true
      this.getVideoDetal()
      this.getMessage()
    },
    getVideoDetal () {
      var timer = setInterval(()=>{
        if(this.$refs.youtube != undefined){
          this.$refs.youtube.player.playVideo()
          clearInterval(timer)
        }
      },1)
      axios('https://www.googleapis.com/youtube/v3/videos?key=AIzaSyD5TKRgppKIBqfwvQRjMBa1yq0V1Oi94Og&part=snippet,statistics&id='+this.videoId).then(res => {
        this.videoInfo=res.data.items[0]
      })
    },
    getMessage () {
      axios('http://127.0.0.1:5050/getMessage?videoId='+this.videoId).then(res => {
        this.messageList = res.data.data
      })
    },
    setMessage () {
      axios.post('http://127.0.0.1:5050/sendMessage',{
        videoId: this.videoId,
        message: this.messageInput
      }).then(res => {
        if(res.data.status == "success"){
          var getDate = new Date();
          var nowdate = (getDate.getFullYear()) + '-' + ("0" + (getDate.getMonth() + 1)).slice(-2) + '-' + ("0" + getDate.getDate()).slice(-2);
          this.messageList.push({
            message: this.messageInput,
            time: nowdate
          })
          this.messageInput = ''
        }
      })
    },
    videoEndEvent () {
      this.$refs.youtube.player.stopVideo()
    }
  }
}
</script>

<style lang="sass" scoped>
.close-btn
  position: absolute
  top: 20px
  right: 30px
  font-size: 40px
  color: #fff
  cursor: pointer
.vidoe-wrapper
  position: fixed
  height: 100vh
  width: 100vw
  background: rgba(#000, 0.6)
  z-index: 999
  top: 0
.vidoe-box
  position: absolute
  top: 10%
  left: 50%
  width: 800px
  transform: translateX(-50%)
  background-color: #fff
  z-index: 9999
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.5)
  border-radius: 4px
.info-wrapper
  padding: 10px 10px 0 10px
.video-info
  .title
    margin-bottom: 10px
    font-size: 18px
  .info
    font-size: 16px
    color: #5d5d5d
    margin-bottom: 10px
.msg-list
  border-top: solid 1px #ddd
  padding: 10px
  .title
    color: #5d5d5d
    margin-bottom: 20px
  .item-block
    max-height: 195px
    overflow: hidden
    overflow-y: scroll
    .noMsg
      text-align: center
      color: #5d5d5d
      margin: 20px 0
  .msg-item
    display: flex
    .icon
      height: 50px
      width: 50px
      border: solid 1px #ddd
      border-radius: 100%
      background-image: url('../assets/images/unnamed.jpg')
      background-size: 80%
      background-position: center
      margin-right: 10px
    .message
      margin-bottom: 20px
      .index
        color: #949494
      .text
        margin-top: 3px
        margin-left: 15px
        color: #5d5d5d
.input-msg
  display: flex
  border-top: solid 1px #ddd
  padding: 15px 5px
  .input
    width: 95%
    border: none
    color: #5d5d5d
    font-size: 20px
    box-sizing: border-box
    &:focus
      outline: none
  .btn
    cursor: pointer
    width: 5%
    text-align: center
    color: #25728c
    font-weight: 500
</style>