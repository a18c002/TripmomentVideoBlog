<template>
  <div class="home">
    <ViedoPlayer ref="videoplayer"></ViedoPlayer>
    <div class="scrollTopBtn" @click="scrollTo()">
      <span>︿</span>
    </div>
    <div class="navbar">
      <div class="container">
        <img src="https://tripmoment.com/images/TripMoment.svg" alt="">
      </div>
    </div>
    <div class="banner"></div>
    <div class="content-wrapper">
      <div class="container">
        <div :class="['video-listers', showLeftMenu?'left':'']">
          <span class="title">影片分類</span>
          <ul class="tag-list">
            <li class="tag" v-for="(tag,tag_ind) in list" :key="tag_ind" @click="scrollTo(tag.id)"> {{ tag.title }}</li>
          </ul>
        </div>
        <div class="video-list-cont" v-for="(videoList,videoList_ind) in list" :key="videoList_ind" :ref="videoList.id">
          <div class="tag-title">
            <span>{{ videoList.title }}</span>
            <hr>
          </div>
          <div class="video-wrapper" >
            <div class="video-card" v-for="(video,video_ind) in videoList.videoList" :key="video_ind" @click="openVideo(video)">
              <div class="video-img" :style="`background-image: url('${video.snippet.thumbnails.high.url}');`"></div>
              <div class="video-title">{{video.snippet.title}}</div>
              <div class="video-time">{{video.snippet.publishedAt.replace("T"," ").replace("Z","")}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ViedoPlayer from '../components/VideoPlayer'
export default {
  name: 'Home',
  components: {
    ViedoPlayer
  },
  data () {
    return {
      list: [
        {
          title: '熱門推薦',
          id: 'HOT',
          videoList: []
        }
      ],
      showLeftMenu: false
    }
  },
  mounted () {
    this.getVideoList()
    document.addEventListener('scroll',()=>{
      if(document.documentElement.scrollTop > 500){
        this.showLeftMenu = true
      }else{
        this.showLeftMenu = false
      }
    })
  },
  methods: {
    getVideoList () {
      let _self = this
      axios('https://www.googleapis.com/youtube/v3/playlists?key=AIzaSyD5TKRgppKIBqfwvQRjMBa1yq0V1Oi94Og&channelId=UC99-H8Kh1-CF5HcKhUyhJfQ&part=snippet,player,contentDetails&maxResults=50').then((res) => {
        let items = res.data.items
        items.forEach((d) =>{
          this.list.push({
            title: d.snippet.title,
            id: d.id,
            videoList: []
          })
        })
        this.list.forEach((d,i) =>{
          this.getVideo(d.id).then(resd => this.list[i].videoList = resd)
        })
      })
    },
    getVideo (id) {
      return new Promise( (resolve, reject) => {
        if(id == 'HOT'){
          axios('https://www.googleapis.com/youtube/v3/search?key=AIzaSyD5TKRgppKIBqfwvQRjMBa1yq0V1Oi94Og&part=snippet&maxResults=12&channelId=UC99-H8Kh1-CF5HcKhUyhJfQ&order=viewCount&type=video').then(res => {
            resolve(res.data.items)
          })
          return
        }
        axios('https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyD5TKRgppKIBqfwvQRjMBa1yq0V1Oi94Og&part=snippet,contentDetails&maxResults=50&playlistId='+id).then(res => {
          resolve(res.data.items)
        })
      })
    },
    openVideo (obj) {
      if(obj.contentDetails == undefined){
        this.$refs.videoplayer.openVideo(obj.id.videoId)
      }else{
        this.$refs.videoplayer.openVideo(obj.contentDetails.videoId)
      }
    },
    scrollTo (el=null) {
      window.scroll({
        top: el==null? 0:this.$refs[el][0].offsetTop - 100,
        behavior: 'smooth'
      });
    }
  }
}
</script>

<style lang="sass">
.scrollTopBtn
  position: fixed
  right: 50px
  bottom: 50px
  border: solid 3px #25728c
  color: #25728c
  font-size: 30px
  height: 50px
  width: 50px
  border-radius: 100%
  font-weight: bold
  cursor: pointer
  span
    top: 35%
    left: 50%
    transform: translate(-50%,-50%)
    position: absolute
.navbar
  padding: 20px 0
  text-align: center
  display: block
  position: fixed
  background-color: #fff
  border-bottom: solid 0.5px #ddd
  width: 100%
  top: 0
  z-index: 2
.banner
  height: 15vw
  background-image: url('../assets/images/banner.jpg')
  background-size: cover
  margin-top: 66px
.video-listers
  padding: 40px 15px 40px 18px
  &.left
    position: fixed
    top: 50px
    left: 80px
    z-index: 1
    .tag-list
      display: block
      .tag
        padding: 4px 10px 3px 10px
        width: 100px
        margin: 10px 0 10px 0px
        font-size: 14px
        display: -webkit-box
        -webkit-line-clamp: 1
        -webkit-box-orient: vertical
        overflow: hidden
        text-overflow: ellipsis
        &:hover
          width: auto
      .title
        text-align: center
  .title
    font-size: 18px
    font-weight: 300
    letter-spacing: .3px
    color: #949494
    margin-bottom: 5px
  .tag-list
    display: flex
    flex-wrap: wrap
    .tag
      font-size: 16px
      letter-spacing: .2px
      color: #25728c
      border: 2px solid #25728c
      padding: 10px 15px
      border-radius: 25px
      color: #25728c
      margin: 10px 0 10px 10px
      cursor: pointer
      &:hover
        transition: 0.3s
        background-color: #25728c
        color: #fff
      &.active
        background-color: #25728c
        color: #fff
.video-list-cont
  .tag-title
    position: relative
    span
      font-size: 28px
      font-weight: 500
      color: #5a5a5a
      border-left: solid 5px rgb(37, 114, 140)
      padding: 0 20px
      background-color: #fff
      display: inline-block
    hr
      color: #5a5a5a
      position: absolute
      top: 50%
      transform: translateY(-50%)
      width: 100%
      z-index: -1
  .video-wrapper
    display: flex
    flex-wrap: wrap
    padding: 30px 10px
    .video-card
      width: calc(100%/4 - 20px)
      border: 1px solid #dedede
      border-radius: 8px
      margin: 0 20px 30px 0
      padding: 10px
      cursor: pointer
      .video-img
        height: 150px
        background-size: cover
        background-position: center
      .video-title
        font-size: 17px
        letter-spacing: .3px
        display: -webkit-box
        -webkit-line-clamp: 2
        -webkit-box-orient: vertical
        overflow: hidden
        text-overflow: ellipsis
        color: #0c0c0c
        height: 47px
        margin: 10px 0
      .video-time
        font-size: 12px
        margin-top: 20px
        text-align: right
        color: #5d5d5d
</style>
